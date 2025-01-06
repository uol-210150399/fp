import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuestionEntity } from './question.entity';

@Entity('question_type')
export class QuestionTypeEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'question_type_id' })
  questionTypeId: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'code' })
  code: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'is_deleted_flag', default: false })
  isDeletedFlag: boolean;

  @OneToMany(() => QuestionEntity, (question) => question.questionType)
  questions: QuestionEntity[];
}
