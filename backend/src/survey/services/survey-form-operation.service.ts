import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyFormEntity } from '../model/survey-form.entity';
import { SurveySectionEntity } from '../model/survey-section.entity';
import { SurveySectionFieldEntity } from '../model/survey-section-field.entity';
import { SurveyValidationException } from '../exceptions/survey.exceptions';
import { SurveyValidationUtils } from '../utils/survey-validation.utils';
import { SurveyField, SurveyFieldTransformer } from '../types/survey-field.types';
import { SurveyFormOperationType } from '../../generated/graphql';
import { In } from 'typeorm';

@Injectable()
export class SurveyFormOperationService {
  constructor(
    @InjectRepository(SurveyFormEntity)
    private readonly formRepository: Repository<SurveyFormEntity>,
    @InjectRepository(SurveySectionEntity)
    private readonly sectionRepository: Repository<SurveySectionEntity>,
    @InjectRepository(SurveySectionFieldEntity)
    private readonly fieldRepository: Repository<SurveySectionFieldEntity>,
  ) { }

  async updateFormSections(surveyId: string, sections: any[]): Promise<void> {
    // Get the form for this survey
    const form = await this.formRepository.findOne({
      where: { surveyId },
      relations: ['sections', 'sections.fields']
    });

    if (!form) {
      throw new SurveyValidationException('Survey form not found');
    }

    // Start a transaction since we're doing multiple operations
    await this.formRepository.manager.transaction(async manager => {
      // First validate all sections
      for (const section of sections) {
        SurveyValidationUtils.validateSection(section);
      }

      // Get existing section IDs for cleanup
      const existingSectionIds = new Set(form.sections.map(s => s.id));
      const newSectionIds = new Set(sections.filter(s => s.id).map(s => s.id));

      // Delete sections that are no longer present
      const sectionsToDelete = Array.from(existingSectionIds).filter(id => !newSectionIds.has(id));
      if (sectionsToDelete.length > 0) {
        // First delete all fields in these sections
        await manager.delete(SurveySectionFieldEntity, { sectionId: In(sectionsToDelete) });
        // Then delete the sections
        await manager.delete(SurveySectionEntity, { id: In(sectionsToDelete) });
      }

      // Update or create sections
      for (const [index, sectionData] of sections.entries()) {
        let section: SurveySectionEntity;

        if (sectionData.id) {
          // Update existing section
          section = await manager.findOne(SurveySectionEntity, {
            where: { id: sectionData.id },
            relations: ['fields']
          });

          if (!section) {
            throw new SurveyValidationException(`Section with id ${sectionData.id} not found`);
          }

          section.title = sectionData.title;
          section.description = sectionData.description;
          section.order = index;
        } else {
          // Create new section
          section = manager.create(SurveySectionEntity, {
            formId: form.id,
            title: sectionData.title,
            description: sectionData.description,
            order: index
          });
        }

        // Save the section first to get its ID for fields
        section = await manager.save(section);

        // Handle fields
        const existingFieldIds = new Set(section.fields?.map(f => f.id) || []);
        const newFieldIds = new Set(sectionData.fields.filter(f => f.id).map(f => f.id));

        // Delete fields that are no longer present
        const fieldsToDelete = Array.from(existingFieldIds).filter(id => !newFieldIds.has(id));
        if (fieldsToDelete.length > 0) {
          await manager.delete(SurveySectionFieldEntity, { id: In(fieldsToDelete) });
        }

        // Update or create fields
        for (const [fieldIndex, fieldData] of sectionData.fields.entries()) {
          let field: SurveySectionFieldEntity;

          if (fieldData.id) {
            // Update existing field
            field = await manager.findOne(SurveySectionFieldEntity, {
              where: { id: fieldData.id }
            });

            if (!field) {
              throw new SurveyValidationException(`Field with id ${fieldData.id} not found`);
            }

            field.type = fieldData.type;
            field.order = fieldIndex;
            field.data = this.transformFieldData(fieldData);
          } else {
            // Create new field
            field = manager.create(SurveySectionFieldEntity, {
              sectionId: section.id,
              type: fieldData.type,
              order: fieldIndex,
              data: this.transformFieldData(fieldData)
            });
          }

          await manager.save(field);
        }
      }
    });
  }

  private transformFieldData(fieldData: any): any {
    return fieldData;
  }

  async executeOperation(formId: string, operation: SurveyFormOperationType, data: any): Promise<void> {
    switch (operation) {
      case SurveyFormOperationType.ADD_SECTION:
        return this.addSection(formId, this.validateSectionInput(data));

      case SurveyFormOperationType.UPDATE_SECTION:
        return this.updateSection(
          this.requireField(data, 'sectionId'),
          this.validateSectionInput(data)
        );

      case SurveyFormOperationType.DELETE_SECTION:
        return this.deleteSection(this.requireField(data, 'sectionId'));

      case SurveyFormOperationType.MOVE_SECTION:
        return this.moveSection(
          formId,
          this.requireField(data, 'sectionId'),
          this.requireField(data, 'newIndex')
        );

      case SurveyFormOperationType.ADD_FIELD:
        return this.addField(
          this.requireField(data, 'sectionId'),
          this.validateFieldInput(data)
        );

      case SurveyFormOperationType.UPDATE_FIELD:
        return this.updateField(
          this.requireField(data, 'fieldId'),
          this.validateFieldInput(data)
        );

      case SurveyFormOperationType.DELETE_FIELD:
        return this.deleteField(this.requireField(data, 'fieldId'));

      case SurveyFormOperationType.MOVE_FIELD_IN_SECTION:
        return this.moveFieldInSection(
          this.requireField(data, 'sectionId'),
          this.requireField(data, 'fieldId'),
          this.requireField(data, 'newIndex')
        );

      default:
        throw new SurveyValidationException(`Unknown operation: ${operation}`);
    }
  }

  private validateSectionInput(data: any): { title: string; description?: string } {
    if (!data.title) {
      throw new SurveyValidationException('Section title is required');
    }
    return {
      title: data.title,
      description: data.description,
    };
  }

  private validateFieldInput(data: any): SurveyField {
    const field = {
      type: data.type,
      text: data.text,
      description: data.description,
      required: data.required ?? false,
      order: data.order,
      ...data, // Include any type-specific fields
    } as SurveyField;

    SurveyValidationUtils.validateSectionField(field);
    return field;
  }

  private requireField<T>(data: any, field: string): T {
    if (data[field] === undefined) {
      throw new SurveyValidationException(`${field} is required`);
    }
    return data[field];
  }

  private async addSection(formId: string, input: { title: string; description?: string }): Promise<void> {
    const lastSection = await this.sectionRepository.findOne({
      where: { formId },
      order: { order: 'DESC' },
    });

    const section = this.sectionRepository.create({
      formId,
      title: input.title,
      description: input.description,
      order: (lastSection?.order ?? -1) + 1,
    });

    await this.sectionRepository.save(section);
  }

  private async updateSection(sectionId: string, input: { title?: string; description?: string }): Promise<void> {
    const section = await this.sectionRepository.findOneOrFail({ where: { id: sectionId } });

    if (input.title) {
      section.title = input.title;
    }
    if (input.description !== undefined) {
      section.description = input.description;
    }

    await this.sectionRepository.save(section);
  }

  private async deleteSection(sectionId: string): Promise<void> {
    await this.fieldRepository.delete({ sectionId });
    await this.sectionRepository.delete({ id: sectionId });
  }

  private async addField(sectionId: string, field: SurveyField): Promise<void> {
    const lastField = await this.fieldRepository.findOne({
      where: { sectionId },
      order: { order: 'DESC' },
    });

    const fieldWithOrder = {
      ...field,
      order: (lastField?.order ?? -1) + 1,
    };

    const persistedField = this.fieldRepository.create({
      sectionId,
      ...SurveyFieldTransformer.toPersistence(fieldWithOrder),
    });

    await this.fieldRepository.save(persistedField);
  }

  private async updateField(fieldId: string, field: Partial<SurveyField>): Promise<void> {
    const existingField = await this.fieldRepository.findOneOrFail({ where: { id: fieldId } });

    const mergedField = {
      ...SurveyFieldTransformer.fromPersistence(existingField),
      ...field,
    } as SurveyField;

    const updatedField = {
      ...existingField,
      ...SurveyFieldTransformer.toPersistence(mergedField),
    };

    await this.fieldRepository.save(updatedField);
  }

  private async deleteField(fieldId: string): Promise<void> {
    await this.fieldRepository.delete({ id: fieldId });
  }

  private async moveSection(formId: string, sectionId: string, newIndex: number): Promise<void> {
    // Get all sections in the form ordered by their current order
    const sections = await this.sectionRepository.find({
      where: { formId },
      order: { order: 'ASC' },
    });

    // Find the section to move
    const sectionToMove = sections.find(s => s.id === sectionId);
    if (!sectionToMove) {
      throw new SurveyValidationException('Section not found in form');
    }

    // Validate the new index
    if (newIndex < 0 || newIndex >= sections.length) {
      throw new SurveyValidationException('Invalid target index');
    }

    // Remove the section from its current position
    const updatedSections = sections.filter(s => s.id !== sectionId);
    // Insert it at the new position
    updatedSections.splice(newIndex, 0, sectionToMove);

    // Update all section orders in a transaction
    await this.formRepository.manager.transaction(async manager => {
      for (const [index, section] of updatedSections.entries()) {
        await manager.update(SurveySectionEntity, { id: section.id }, { order: index });
      }
    });
  }

  private async moveFieldInSection(sectionId: string, fieldId: string, newIndex: number): Promise<void> {
    // Get all fields in the section ordered by their current order
    const fields = await this.fieldRepository.find({
      where: { sectionId },
      order: { order: 'ASC' },
    });

    // Find the field to move
    const fieldToMove = fields.find(f => f.id === fieldId);
    if (!fieldToMove) {
      throw new SurveyValidationException('Field not found in section');
    }

    // Validate the new index
    if (newIndex < 0 || newIndex >= fields.length) {
      throw new SurveyValidationException('Invalid target index');
    }

    // Remove the field from its current position
    const updatedFields = fields.filter(f => f.id !== fieldId);
    // Insert it at the new position
    updatedFields.splice(newIndex, 0, fieldToMove);

    // Update all field orders in a transaction
    await this.formRepository.manager.transaction(async manager => {
      for (const [index, field] of updatedFields.entries()) {
        await manager.update(SurveySectionFieldEntity, { id: field.id }, { order: index });
      }
    });
  }
} 