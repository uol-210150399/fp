import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1742170099338 implements MigrationInterface {
    name = 'CreateTables1742170099338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transition_rule" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_deleted" boolean NOT NULL DEFAULT false, "created_by" character varying NOT NULL, "updated_by" character varying NOT NULL, "transition_rule_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rule" jsonb NOT NULL, "is_deleted_flag" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_0777f8c32f5bf8d5966be2b10cb" PRIMARY KEY ("transition_rule_id"))`);
        await queryRunner.query(`CREATE TABLE "project" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_deleted" boolean NOT NULL DEFAULT false, "project_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "team_id" uuid NOT NULL, "created_by_membership_id" uuid NOT NULL, CONSTRAINT "PK_1a480c5734c5aacb9cef7b1499d" PRIMARY KEY ("project_id"))`);
        await queryRunner.query(`CREATE TABLE "team" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_deleted" boolean NOT NULL DEFAULT false, "team_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "created_by_user_id" character varying NOT NULL, CONSTRAINT "UQ_e459cfa57273996b76d24a0fa68" UNIQUE ("slug"), CONSTRAINT "PK_a35a345d4436b82adf6bb76f3ce" PRIMARY KEY ("team_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."team_membership_role_enum" AS ENUM('OWNER', 'ADMIN', 'MEMBER')`);
        await queryRunner.query(`CREATE TABLE "team_membership" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_deleted" boolean NOT NULL DEFAULT false, "membership_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "team_id" uuid NOT NULL, "user_id" character varying NOT NULL, "role" "public"."team_membership_role_enum" NOT NULL DEFAULT 'MEMBER', CONSTRAINT "PK_d533af18a96df1186bba17e9a44" PRIMARY KEY ("membership_id"))`);
        await queryRunner.query(`CREATE TABLE "survey" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_deleted" boolean NOT NULL DEFAULT false, "created_by" character varying NOT NULL, "updated_by" character varying NOT NULL, "survey_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "project_id" uuid NOT NULL, "is_deleted_flag" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_404ab7430aef7b5ffe57e915505" PRIMARY KEY ("survey_id"))`);
        await queryRunner.query(`CREATE TABLE "question_group" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_deleted" boolean NOT NULL DEFAULT false, "created_by" character varying NOT NULL, "updated_by" character varying NOT NULL, "question_group_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "survey_id" uuid NOT NULL, "is_deleted_flag" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_dda9fb7e1d1c9bfe345b92a0812" PRIMARY KEY ("question_group_id"))`);
        await queryRunner.query(`CREATE TABLE "question" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_deleted" boolean NOT NULL DEFAULT false, "created_by" character varying NOT NULL, "updated_by" character varying NOT NULL, "question_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "question_group_id" uuid NOT NULL, "question_type_id" uuid NOT NULL, "question_order" integer NOT NULL, CONSTRAINT "PK_7c755ccdc03ae2b6206ff00363a" PRIMARY KEY ("question_id"))`);
        await queryRunner.query(`CREATE TABLE "question_type" ("question_type_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_deleted_flag" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_374ca086b5a0ae1afef2132cb22" PRIMARY KEY ("question_type_id"))`);
        await queryRunner.query(`CREATE TABLE "published_survey" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_deleted" boolean NOT NULL DEFAULT false, "created_by" character varying NOT NULL, "updated_by" character varying NOT NULL, "published_survey_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "survey_id" uuid NOT NULL, "slug" character varying NOT NULL, CONSTRAINT "PK_a534ee74faa5d3189ed9169b94d" PRIMARY KEY ("published_survey_id"))`);
        await queryRunner.query(`CREATE TABLE "question_flow" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_deleted" boolean NOT NULL DEFAULT false, "created_by" character varying NOT NULL, "updated_by" character varying NOT NULL, "question_flow_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "from_question_id" uuid NOT NULL, "to_question_id" uuid NOT NULL, "transition_rule_id" uuid NOT NULL, "is_deleted_flag" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_76add8d32bca3cbbc9276f98059" PRIMARY KEY ("question_flow_id"))`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_835c1b4e2d9550981b437ffa848" FOREIGN KEY ("team_id") REFERENCES "team"("team_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_f8eb7042d01897b5650f796bddb" FOREIGN KEY ("created_by_membership_id") REFERENCES "team_membership"("membership_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_membership" ADD CONSTRAINT "FK_91c8aa3bf9a3a7a3918fcea43a0" FOREIGN KEY ("team_id") REFERENCES "team"("team_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "survey" ADD CONSTRAINT "FK_5730d441413a362500f34b7186c" FOREIGN KEY ("project_id") REFERENCES "project"("project_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question_group" ADD CONSTRAINT "FK_620b2e9a1ec12f216e267cb4a25" FOREIGN KEY ("survey_id") REFERENCES "survey"("survey_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_d05b1685687f496b1fdd94f5fbb" FOREIGN KEY ("question_group_id") REFERENCES "question_group"("question_group_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_1266d0d727621c5ede6660609e1" FOREIGN KEY ("question_type_id") REFERENCES "question_type"("question_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "published_survey" ADD CONSTRAINT "FK_214f37f795a85be1bdb175e8321" FOREIGN KEY ("survey_id") REFERENCES "survey"("survey_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question_flow" ADD CONSTRAINT "FK_86dacf33a2b34c90c4f12b4742b" FOREIGN KEY ("from_question_id") REFERENCES "question"("question_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question_flow" ADD CONSTRAINT "FK_ba899da0302c6744ac82897a7e0" FOREIGN KEY ("to_question_id") REFERENCES "question"("question_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question_flow" ADD CONSTRAINT "FK_854b4194c56b0481446c5a457e2" FOREIGN KEY ("transition_rule_id") REFERENCES "transition_rule"("transition_rule_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_flow" DROP CONSTRAINT "FK_854b4194c56b0481446c5a457e2"`);
        await queryRunner.query(`ALTER TABLE "question_flow" DROP CONSTRAINT "FK_ba899da0302c6744ac82897a7e0"`);
        await queryRunner.query(`ALTER TABLE "question_flow" DROP CONSTRAINT "FK_86dacf33a2b34c90c4f12b4742b"`);
        await queryRunner.query(`ALTER TABLE "published_survey" DROP CONSTRAINT "FK_214f37f795a85be1bdb175e8321"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_1266d0d727621c5ede6660609e1"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_d05b1685687f496b1fdd94f5fbb"`);
        await queryRunner.query(`ALTER TABLE "question_group" DROP CONSTRAINT "FK_620b2e9a1ec12f216e267cb4a25"`);
        await queryRunner.query(`ALTER TABLE "survey" DROP CONSTRAINT "FK_5730d441413a362500f34b7186c"`);
        await queryRunner.query(`ALTER TABLE "team_membership" DROP CONSTRAINT "FK_91c8aa3bf9a3a7a3918fcea43a0"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_f8eb7042d01897b5650f796bddb"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_835c1b4e2d9550981b437ffa848"`);
        await queryRunner.query(`DROP TABLE "question_flow"`);
        await queryRunner.query(`DROP TABLE "published_survey"`);
        await queryRunner.query(`DROP TABLE "question_type"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "question_group"`);
        await queryRunner.query(`DROP TABLE "survey"`);
        await queryRunner.query(`DROP TABLE "team_membership"`);
        await queryRunner.query(`DROP TYPE "public"."team_membership_role_enum"`);
        await queryRunner.query(`DROP TABLE "team"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "transition_rule"`);
    }

}
