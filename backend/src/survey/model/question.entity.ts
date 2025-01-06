import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuestionGroupEntity } from './question-group.entity';
import { QuestionTypeEntity } from './question-type.entity';
import { AuditableEntity } from 'src/common/model/auditable.entity';

@Entity('question')
export class QuestionEntity extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'question_id' })
  questionId: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'question_group_id' })
  questionGroupId: string;

  @Column({ name: 'question_type_id' })
  questionTypeId: string;

  @Column({ name: 'question_order' })
  questionOrder: number;

  @ManyToOne(
    () => QuestionGroupEntity,
    (questionGroup) => questionGroup.questions,
  )
  @JoinColumn({
    name: 'question_group_id',
    referencedColumnName: 'questionGroupId',
  })
  questionGroup: QuestionGroupEntity;

  @ManyToOne(() => QuestionTypeEntity)
  @JoinColumn({
    name: 'question_type_id',
    referencedColumnName: 'questionTypeId',
  })
  questionType: QuestionTypeEntity;
}
