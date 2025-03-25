import { MigrationInterface, QueryRunner } from "typeorm";

export class SurveyForm1742776156640 implements MigrationInterface {
    name = 'SurveyForm1742776156640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."survey_section_field_type_enum" AS ENUM('Checkpoint', 'MatrixQuestion', 'MultipleChoiceQuestion', 'NumberQuestion', 'RankingQuestion', 'RatingQuestion', 'StatementField', 'TextQuestion')`);
        await queryRunner.query(`CREATE TABLE "survey_section_field" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_deleted" boolean NOT NULL DEFAULT false, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order" integer NOT NULL, "type" "public"."survey_section_field_type_enum" NOT NULL, "data" jsonb NOT NULL, "section_id" uuid NOT NULL, CONSTRAINT "PK_b44a075734abe424b17ae93807e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "survey_section" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_deleted" boolean NOT NULL DEFAULT false, "created_by" character varying NOT NULL, "updated_by" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "form_id" uuid NOT NULL, "order" integer NOT NULL, CONSTRAINT "PK_11162fa3b3e3b54bd7abb531191" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "survey_form" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_deleted" boolean NOT NULL DEFAULT false, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "context" character varying, "survey_id" uuid NOT NULL, CONSTRAINT "REL_83183b6b5e8c8b0987ca669fe2" UNIQUE ("survey_id"), CONSTRAINT "PK_09e7f5d02b855a284fea0658609" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "survey_session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "published_survey_id" uuid NOT NULL, "survey_id" uuid NOT NULL, "respondent_id" character varying, "respondent_ip" character varying, "user_agent" character varying, "started_at" TIMESTAMP WITH TIME ZONE NOT NULL, "completed_at" TIMESTAMP WITH TIME ZONE, "last_answered_at" TIMESTAMP WITH TIME ZONE NOT NULL, "answers" jsonb NOT NULL, "is_partial" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a16533625e4fa7cf31dd9eaf1f8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "published_survey" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "published_survey" DROP COLUMN "updated_by"`);
        await queryRunner.query(`ALTER TABLE "published_survey" DROP CONSTRAINT "PK_a534ee74faa5d3189ed9169b94d"`);
        await queryRunner.query(`ALTER TABLE "published_survey" DROP COLUMN "published_survey_id"`);
        await queryRunner.query(`ALTER TABLE "published_survey" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "is_deleted_flag"`);
        await queryRunner.query(`ALTER TABLE "published_survey" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "published_survey" ADD CONSTRAINT "PK_f4d1a21182ac1332ddd684004a4" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "published_survey" ADD "form_data" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "published_survey" ADD "version" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "published_survey" ADD "published_by" uuid`);
        await queryRunner.query(`ALTER TABLE "survey" ADD "description" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."survey_status_enum" AS ENUM('DRAFT', 'PUBLISHED')`);
        await queryRunner.query(`ALTER TABLE "survey" ADD "status" "public"."survey_status_enum" NOT NULL DEFAULT 'DRAFT'`);
        await queryRunner.query(`ALTER TABLE "survey" ADD "key" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "survey" ADD CONSTRAINT "UQ_d0c2c57d8b009df74413b6022f5" UNIQUE ("key")`);
        await queryRunner.query(`ALTER TABLE "published_survey" ADD CONSTRAINT "UQ_2a2a4eb880b4f7b6635bbfefd52" UNIQUE ("survey_id", "version")`);
        await queryRunner.query(`ALTER TABLE "published_survey" ADD CONSTRAINT "FK_718048d279ff5d537b2b3b2aea0" FOREIGN KEY ("published_by") REFERENCES "team_membership"("membership_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_section_field" ADD CONSTRAINT "FK_2e369ce62dde1e971746732e0ad" FOREIGN KEY ("section_id") REFERENCES "survey_section"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_section" ADD CONSTRAINT "FK_2b5eda6a5acaeb943150c5966d8" FOREIGN KEY ("form_id") REFERENCES "survey_form"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_form" ADD CONSTRAINT "FK_83183b6b5e8c8b0987ca669fe2a" FOREIGN KEY ("survey_id") REFERENCES "survey"("survey_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_session" ADD CONSTRAINT "FK_323cfec4bf0702b36a852127c61" FOREIGN KEY ("published_survey_id") REFERENCES "published_survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey_session" ADD CONSTRAINT "FK_9df0f4ad2299b025bc49d7b947d" FOREIGN KEY ("survey_id") REFERENCES "survey"("survey_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_session" DROP CONSTRAINT "FK_9df0f4ad2299b025bc49d7b947d"`);
        await queryRunner.query(`ALTER TABLE "survey_session" DROP CONSTRAINT "FK_323cfec4bf0702b36a852127c61"`);
        await queryRunner.query(`ALTER TABLE "survey_form" DROP CONSTRAINT "FK_83183b6b5e8c8b0987ca669fe2a"`);
        await queryRunner.query(`ALTER TABLE "survey_section" DROP CONSTRAINT "FK_2b5eda6a5acaeb943150c5966d8"`);
        await queryRunner.query(`ALTER TABLE "survey_section_field" DROP CONSTRAINT "FK_2e369ce62dde1e971746732e0ad"`);
        await queryRunner.query(`ALTER TABLE "published_survey" DROP CONSTRAINT "FK_718048d279ff5d537b2b3b2aea0"`);
        await queryRunner.query(`ALTER TABLE "published_survey" DROP CONSTRAINT "UQ_2a2a4eb880b4f7b6635bbfefd52"`);
        await queryRunner.query(`ALTER TABLE "survey" DROP CONSTRAINT "UQ_d0c2c57d8b009df74413b6022f5"`);
        await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "key"`);
        await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."survey_status_enum"`);
        await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "published_survey" DROP COLUMN "published_by"`);
        await queryRunner.query(`ALTER TABLE "published_survey" DROP COLUMN "version"`);
        await queryRunner.query(`ALTER TABLE "published_survey" DROP COLUMN "form_data"`);
        await queryRunner.query(`ALTER TABLE "published_survey" DROP CONSTRAINT "PK_f4d1a21182ac1332ddd684004a4"`);
        await queryRunner.query(`ALTER TABLE "published_survey" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "survey" ADD "is_deleted_flag" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "published_survey" ADD "slug" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "published_survey" ADD "published_survey_id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "published_survey" ADD CONSTRAINT "PK_a534ee74faa5d3189ed9169b94d" PRIMARY KEY ("published_survey_id")`);
        await queryRunner.query(`ALTER TABLE "published_survey" ADD "updated_by" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "published_survey" ADD "created_by" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "survey_session"`);
        await queryRunner.query(`DROP TABLE "survey_form"`);
        await queryRunner.query(`DROP TABLE "survey_section"`);
        await queryRunner.query(`DROP TABLE "survey_section_field"`);
        await queryRunner.query(`DROP TYPE "public"."survey_section_field_type_enum"`);
    }

}
