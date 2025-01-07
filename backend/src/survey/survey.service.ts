import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SurveyEntity } from './model/survey.entity';
import { IsUUID, IsString, IsOptional } from 'class-validator';
import { Survey } from 'src/generated/graphql';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(SurveyEntity)
    private repository: Repository<SurveyEntity>,
  ) {}

  async create(survey: CreateSurveyDto): Promise<SurveyEntity> {
    const surveyEntity = this.repository.create({
      title: survey.title,
      projectId: survey.projectId,
      createdBy: survey.userId,
      updatedBy: survey.userId,
    });
    return this.repository.save(surveyEntity);
  }

  async update(updateDto: UpdateSurveyDto): Promise<SurveyEntity> {
    const existingSurvey = await this.repository.findOne({
      where: { surveyId: updateDto.surveyId },
    });

    if (!existingSurvey) {
      throw new NotFoundException(
        `Survey with ID ${updateDto.surveyId} not found`,
      );
    }

    const updatedSurvey = {
      ...existingSurvey,
      ...updateDto,
      updatedBy: updateDto.userId,
    };

    try {
      return await this.repository.save(updatedSurvey);
    } catch (error) {
      throw new Error(`Failed to update survey: ${error.message}`);
    }
  }

  async delete(survey: DeleteSurveyDto): Promise<SurveyEntity> {
    const surveyEntity = await this.repository.findOne({
      where: { surveyId: survey.surveyId },
    });
    surveyEntity.isDeletedFlag = true;
    surveyEntity.updatedAt = new Date();
    surveyEntity.updatedBy = survey.userId;
    return this.repository.save(surveyEntity);
  }

  async get(surveyId: string): Promise<SurveyEntity> {
    return this.repository.findOne({
      where: { surveyId: surveyId },
    });
  }

  async list(projectId: string): Promise<SurveyEntity[]> {
    return this.repository.find({
      where: { projectId: projectId },
    });
  }
}

export class CreateSurveyDto {
  title: string;
  projectId: string;
  userId: string;
}

export class UpdateSurveyDto {
  @IsUUID()
  surveyId: string;
  @IsString()
  @IsOptional()
  title?: string;
  @IsUUID()
  userId: string;
}

export class DeleteSurveyDto {
  surveyId: string;
  userId: string;
}
