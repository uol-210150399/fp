import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInitialTables1736128819045 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
            CREATE TABLE "user" (
                "user_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" varchar NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "is_deleted_flag" boolean NOT NULL DEFAULT false
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "project" (
                "project_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "title" varchar NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "is_deleted_flag" boolean NOT NULL DEFAULT false,
                "created_by" uuid NOT NULL,
                "updated_by" uuid NOT NULL
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "survey" (
                "survey_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "title" varchar NOT NULL,
                "project_id" uuid NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "is_deleted_flag" boolean NOT NULL DEFAULT false,
                "created_by" uuid NOT NULL,
                "updated_by" uuid NOT NULL,

                CONSTRAINT "survey_title_not_empty" CHECK (length(trim(title)) > 0),
                CONSTRAINT "survey_project_fk" FOREIGN KEY ("project_id") 
                    REFERENCES "project"("project_id") 
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
                CONSTRAINT "survey_created_by_fk" FOREIGN KEY ("created_by") 
                    REFERENCES "user"("user_id") 
                    ON DELETE RESTRICT,
                CONSTRAINT "survey_updated_by_fk" FOREIGN KEY ("updated_by") 
                    REFERENCES "user"("user_id") 
                    ON DELETE RESTRICT
            )
        `);

    await queryRunner.query(`
            CREATE INDEX "idx_project_is_deleted" ON "project"("is_deleted_flag");
            CREATE INDEX "idx_survey_is_deleted" ON "survey"("is_deleted_flag");
            CREATE INDEX "idx_survey_project_id" ON "survey"("project_id");
        `);

    await queryRunner.query(`
            CREATE TABLE "question_group" (
                "question_group_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "title" varchar NOT NULL,
                "survey_id" uuid NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "is_deleted_flag" boolean NOT NULL DEFAULT false,
                "created_by" uuid NOT NULL,
                "updated_by" uuid NOT NULL,

                CONSTRAINT "question_group_title_not_empty" CHECK (length(trim(title)) > 0)
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "transition_rule" (
                "transition_rule_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "rule" JSONB NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "is_deleted_flag" boolean NOT NULL DEFAULT false,
                "created_by" uuid NOT NULL,
                "updated_by" uuid NOT NULL
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "question_group_flow" (
                "question_group_flow_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "from_question_group_id" uuid NOT NULL,
                "to_question_group_id" uuid NOT NULL,
                "transition_rule_id" uuid NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "is_deleted_flag" boolean NOT NULL DEFAULT false,
                "created_by" uuid NOT NULL,
                "updated_by" uuid NOT NULL
            )
        `);

    await queryRunner.query(`
          CREATE TABLE "question_type" (
              "question_type_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
              "name" varchar NOT NULL,
              "code" varchar NOT NULL,
              "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "is_deleted_flag" boolean NOT NULL DEFAULT false,
  
              CONSTRAINT "question_type_code_unique" UNIQUE ("code"),
              CONSTRAINT "question_type_name_unique" UNIQUE ("name"),
              CONSTRAINT "question_type_code_not_empty" CHECK (length(trim(code)) > 0),
              CONSTRAINT "question_type_name_not_empty" CHECK (length(trim(name)) > 0)
          )
      `);

    await queryRunner.query(`
        INSERT INTO "question_type" (name, code) VALUES
        ('Text', 'text')
    `);

    await queryRunner.query(`
            CREATE TABLE "question" (
                "question_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "title" varchar NOT NULL,
                "question_group_id" uuid NOT NULL,
                "question_type_id" uuid NOT NULL,
                "question_order" integer NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "is_deleted_flag" boolean NOT NULL DEFAULT false,
                "created_by" uuid NOT NULL,
                "updated_by" uuid NOT NULL,

                CONSTRAINT "question_title_not_empty" CHECK (length(trim(title)) > 0),
                CONSTRAINT "question_question_group_fk" FOREIGN KEY ("question_group_id") 
                    REFERENCES "question_group"("question_group_id") 
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
                CONSTRAINT "question_question_type_fk" FOREIGN KEY ("question_type_id") 
                    REFERENCES "question_type"("question_type_id") 
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "question_flow" (
                "question_flow_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "from_question_id" uuid NOT NULL,
                "to_question_id" uuid NOT NULL,
                "transition_rule_id" uuid NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "is_deleted_flag" boolean NOT NULL DEFAULT false,
                "created_by" uuid NOT NULL,
                "updated_by" uuid NOT NULL
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "published_survey" (
                "published_survey_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "survey_id" uuid NOT NULL,
                "slug" varchar NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "is_deleted_flag" boolean NOT NULL DEFAULT false,
                "created_by" uuid NOT NULL,
                "updated_by" uuid NOT NULL,
                CONSTRAINT "published_survey_slug_unique" UNIQUE ("slug")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_project_is_deleted"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_survey_is_deleted"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_survey_project_id"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "published_survey"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "question_flow"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "question"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "question_group_flow"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "question_group"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "transition_rule"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "survey"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "question_type"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "project"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
  }
}
