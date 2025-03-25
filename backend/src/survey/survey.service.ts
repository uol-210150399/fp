import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyEntity } from './model/survey.entity';
import { SurveyCreateInput, SurveyUpdateInput, SurveyStatus, SurveyFormOperationInput } from '../generated/graphql';
import { SurveyNotFoundException, SurveyPermissionDeniedException } from './exceptions/survey.exceptions';
import { TeamRole } from '../team/model/team-membership.entity';
import { SurveyKeyUtils } from './utils/survey-key.utils';
import { SurveyFormEntity } from './model/survey-form.entity';
import { SurveySectionEntity } from './model/survey-section.entity';
import { SurveyValidationException } from './exceptions/survey.exceptions';
import { SurveySectionFieldEntity } from './model/survey-section-field.entity';
import { PublishedSurveyEntity } from './model/published-survey.entity';
import { SurveyFormDTOMapper } from './dtos/survey-dto-mapper';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(SurveyEntity)
    private readonly surveyRepository: Repository<SurveyEntity>,
    @InjectRepository(SurveyFormEntity)
    private readonly formRepository: Repository<SurveyFormEntity>,
    @Inject(SurveyKeyUtils)
    private readonly keyUtils: SurveyKeyUtils,
  ) { }

  private async getTeamMembership(projectId: string, userId: string) {
    const membership = await this.surveyRepository
      .createQueryBuilder('survey')
      .innerJoin('survey.project', 'project')
      .innerJoin('project.team', 'team')
      .innerJoin('team.memberships', 'memberships')
      .where('survey.projectId = :projectId', { projectId })
      .andWhere('memberships.userId = :userId', { userId })
      .select('memberships.role')
      .getRawOne();

    if (!membership) {
      throw new SurveyPermissionDeniedException('You must be a team member to perform this action');
    }

    return membership;
  }

  private async checkUserCanDelete(projectId: string, userId: string): Promise<void> {
    const membership = await this.getTeamMembership(projectId, userId);

    if (!membership || ![TeamRole.ADMIN, TeamRole.OWNER].includes(membership.memberships_role)) {
      throw new SurveyPermissionDeniedException('Only team admins and owners can delete surveys');
    }
  }

  async getSurvey(surveyId: string, userId: string): Promise<SurveyEntity> {
    const survey = await this.surveyRepository
      .createQueryBuilder('survey')
      .leftJoinAndSelect('survey.form', 'form')
      .leftJoinAndSelect('form.sections', 'sections')
      .leftJoinAndSelect('sections.fields', 'fields')
      .leftJoinAndSelect('survey.project', 'project')
      .leftJoinAndSelect('project.team', 'team')
      .where('survey.surveyId = :surveyId', { surveyId })
      .andWhere('survey.isDeleted = :isDeleted', { isDeleted: false })
      .orderBy('sections.order', 'ASC')
      .addOrderBy('fields.order', 'ASC')
      .getOne();

    if (!survey) {
      throw new SurveyNotFoundException(surveyId);
    }

    await this.getTeamMembership(survey.projectId, userId);
    return survey;
  }

  async listSurveys(input: {
    filter: { userId: string; projectId: string };
    pagination: { first: number; after?: string };
  }): Promise<{ surveys: SurveyEntity[]; hasNextPage: boolean }> {
    const { first, after } = input.pagination;
    const { userId, projectId } = input.filter;

    await this.getTeamMembership(projectId, userId);

    const queryBuilder = this.surveyRepository
      .createQueryBuilder('survey')
      .leftJoinAndSelect('survey.form', 'survey_form')
      .leftJoinAndSelect('survey_form.sections', 'survey_form_sections')
      .leftJoinAndSelect('survey_form_sections.fields', 'survey_form_sections_fields')
      .where('survey.projectId = :projectId', { projectId })
      .andWhere('survey.isDeleted = :isDeleted', { isDeleted: false })
      .orderBy('survey.createdAt', 'DESC')
      .take(first + 1);

    if (after) {
      queryBuilder.andWhere('survey.surveyId > :after', { after });
    }

    const surveys = await queryBuilder.getMany();
    const hasNextPage = surveys.length > first;

    return {
      surveys: surveys.slice(0, first),
      hasNextPage,
    };
  }

  async createSurvey(input: SurveyCreateInput, userId: string): Promise<SurveyEntity> {
    // Check if user has access to the project first
    await this.getTeamMembership(input.projectId, userId);

    const survey = this.surveyRepository.create({
      title: input.title,
      description: input.description,
      projectId: input.projectId,
      createdBy: userId,
      updatedBy: userId,
      key: await this.keyUtils.generateUniqueKey(),
    });

    const savedSurvey = await this.surveyRepository.save(survey);

    // Create an empty form for the survey
    const form = this.formRepository.create({
      surveyId: savedSurvey.surveyId
    });
    await this.formRepository.save(form);

    return savedSurvey;
  }

  async updateSurvey(input: SurveyUpdateInput, userId: string): Promise<SurveyEntity> {
    const survey = await this.getSurvey(input.id, userId);
    await this.getTeamMembership(survey.projectId, userId);

    if (input.title) {
      survey.title = input.title;
    }

    if (input.description) {
      survey.description = input.description;
    }

    // Update form fields if they exist
    if (input.context !== undefined || input.welcomeMessage !== undefined) {
      const form = survey.form || await this.surveyRepository.manager.create(SurveyFormEntity, {
        surveyId: survey.surveyId
      });

      if (input.context !== undefined) {
        form.context = input.context;
      }

      if (input.welcomeMessage !== undefined) {
        form.welcomeMessage = input.welcomeMessage;
      }

      await this.surveyRepository.manager.save(SurveyFormEntity, form);
      survey.form = form;
    }

    survey.updatedBy = userId;
    return this.surveyRepository.save(survey);
  }

  async deleteSurvey(surveyId: string, userId: string): Promise<SurveyEntity> {
    const survey = await this.getSurvey(surveyId, userId);

    // Check if user has admin/owner role in the team
    await this.checkUserCanDelete(survey.projectId, userId);

    survey.isDeleted = true;
    survey.updatedBy = userId;
    return this.surveyRepository.save(survey);
  }

  async createSurveySectionsBulk(input: {
    surveyId: string;
    sections: Array<{
      title: string;
      description?: string;
      fields: Array<any>;  // Using any since field data is JSON type
    }>
  }, userId: string): Promise<SurveyEntity> {
    const survey = await this.getSurvey(input.surveyId, userId);

    // Check if survey already has sections
    if (survey.form?.sections?.length > 0) {
      throw new SurveyValidationException('Survey already has sections. Cannot perform bulk creation.');
    }

    // Create sections in a transaction
    await this.surveyRepository.manager.transaction(async manager => {
      // Ensure form exists
      let form = survey.form;
      if (!form) {
        form = manager.create(SurveyFormEntity, {
          surveyId: survey.surveyId
        });
        form = await manager.save(form);
      }

      // Create all sections with their fields
      for (const [index, sectionData] of input.sections.entries()) {
        // Create section
        const section = manager.create(SurveySectionEntity, {
          formId: form.id,
          title: sectionData.title,
          description: sectionData.description,
          order: index
        });
        const savedSection = await manager.save(section);

        // Create fields for this section
        if (sectionData.fields && sectionData.fields.length > 0) {
          const fields = sectionData.fields.map((fieldData, fieldIndex) =>
            manager.create(SurveySectionFieldEntity, {
              sectionId: savedSection.id,
              type: fieldData.type,
              order: fieldIndex,
              data: fieldData
            })
          );
          await manager.save(fields);
        }
      }
    });

    // Return updated survey with sections
    return this.getSurvey(input.surveyId, userId);
  }

  async updateSurveySectionsBulk(input: {
    surveyId: string;
    sections: Array<{
      id?: string;
      title: string;
      description?: string;
      fields: Array<any>;  // Using any since field data is JSON type
    }>
  }, userId: string): Promise<SurveyEntity> {
    const survey = await this.getSurvey(input.surveyId, userId);
    await this.getTeamMembership(survey.projectId, userId);

    await this.surveyRepository.manager.transaction(async manager => {
      // Ensure form exists
      let form = survey.form;
      if (!form) {
        form = manager.create(SurveyFormEntity, {
          surveyId: survey.surveyId
        });
        form = await manager.save(form);
      }

      // Delete all existing sections and their fields
      if (form.sections?.length > 0) {
        // Delete fields first (due to foreign key constraints)
        await manager
          .createQueryBuilder()
          .delete()
          .from(SurveySectionFieldEntity)
          .where('sectionId IN (SELECT id FROM survey_section WHERE form_id = :formId)', { formId: form.id })
          .execute();

        await manager
          .createQueryBuilder()
          .delete()
          .from(SurveySectionEntity)
          .where('form_id = :formId', { formId: form.id })
          .execute();
      }

      const sections = input.sections.map((sectionInput, index) => {
        const section = manager.create(SurveySectionEntity, {
          id: sectionInput.id,
          title: sectionInput.title,
          description: sectionInput.description,
          form,
          order: index,
        });

        // Create fields for the section but don't assign them yet
        const fields = sectionInput.fields.map((fieldData, fieldIndex) =>
          manager.create(SurveySectionFieldEntity, {
            id: fieldData.id,
            type: fieldData.type,
            data: fieldData,
            order: fieldIndex,
          })
        );

        return { section, fields };
      });

      const savedSections = await manager.save(
        sections.map(({ section }) => section)
      );

      await Promise.all(
        savedSections.map((savedSection, index) => {
          const sectionFields = sections[index].fields.map(field => ({
            ...field,
            sectionId: savedSection.id
          }));
          return manager.save(SurveySectionFieldEntity, sectionFields);
        })
      );

      form.sections = savedSections;
      await manager.save(form);
    });

    return this.getSurvey(input.surveyId, userId);
  }

  async publishSurvey(surveyId: string, userId: string): Promise<SurveyEntity> {
    const survey = await this.getSurvey(surveyId, userId);
    const teamMembership = await this.getTeamMembership(survey.projectId, userId);

    // Validate that survey has at least one section with fields
    if (!survey.form?.sections?.length) {
      throw new SurveyValidationException('Cannot publish survey without sections');
    }

    const hasFields = survey.form.sections.some(section => section.fields?.length > 0);
    if (!hasFields) {
      throw new SurveyValidationException('Cannot publish survey without any fields');
    }

    await this.surveyRepository.manager.transaction(async manager => {
      const previousPublishedSurvey = await manager.findOne(PublishedSurveyEntity, {
        where: { surveyId: survey.surveyId },
        order: { version: 'DESC' }
      });

      const publishedSurvey = manager.create(PublishedSurveyEntity, {
        surveyId: survey.surveyId,
        formSnapshot: SurveyFormDTOMapper.toGraphQL(survey.form),
        publishedById: teamMembership.id,
        version: previousPublishedSurvey ? previousPublishedSurvey.version + 1 : 1
      });

      await manager.save(PublishedSurveyEntity, publishedSurvey);

      survey.status = SurveyStatus.PUBLISHED;
      survey.updatedBy = userId;
      await manager.save(SurveyEntity, survey);
    });

    return this.getSurvey(surveyId, userId);
  }
}
