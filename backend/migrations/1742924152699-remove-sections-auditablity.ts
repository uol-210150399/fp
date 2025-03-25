import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveSectionsAuditablity1742924152699 implements MigrationInterface {
    name = 'RemoveSectionsAuditablity1742924152699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_section" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "survey_section" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "survey_section" DROP COLUMN "is_deleted"`);
        await queryRunner.query(`ALTER TABLE "survey_section" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "survey_section" DROP COLUMN "updated_by"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_section" ADD "updated_by" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "survey_section" ADD "created_by" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "survey_section" ADD "is_deleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "survey_section" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "survey_section" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

}
