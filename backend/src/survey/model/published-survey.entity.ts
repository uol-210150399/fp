import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  BeforeInsert,
  Unique,
} from 'typeorm';
import { SurveyEntity } from './survey.entity';
import { BaseEntity } from 'src/common/model/base.entity';
import { TeamMembershipEntity } from 'src/team/model/team-membership.entity';
import typeOrmDataSource from "src/config/typeorm.config"

@Entity('published_survey')
@Unique(['surveyId', 'version'])
export class PublishedSurveyEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'form_data', type: 'jsonb' })
  formData: any;

  @ManyToOne(() => SurveyEntity, (survey) => survey.publishedVersions)
  @JoinColumn({ name: 'survey_id', referencedColumnName: 'surveyId' })
  survey: SurveyEntity;

  @Column({ name: 'survey_id' })
  surveyId: string;

  @Column({ name: 'version', type: 'integer' })
  version: number;

  @ManyToOne(() => TeamMembershipEntity, (teamMembership) => teamMembership.id)
  @JoinColumn({ name: 'published_by', referencedColumnName: 'id' })
  publishedBy: TeamMembershipEntity;

  @Column({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @BeforeInsert()
  async setVersion() {
    const lastVersion = await typeOrmDataSource.getRepository(PublishedSurveyEntity)
      .createQueryBuilder('published_survey')
      .where('published_survey.survey_id = :surveyId', { surveyId: this.surveyId })
      .orderBy('published_survey.version', 'DESC')
      .getOne();

    this.version = lastVersion ? lastVersion.version + 1 : 1;
  }
}
