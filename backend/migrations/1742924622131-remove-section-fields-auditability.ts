import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveSectionFieldsAuditability1742924622131 implements MigrationInterface {
    name = 'RemoveSectionFieldsAuditability1742924622131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_section_field" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "survey_section_field" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "survey_section_field" DROP COLUMN "is_deleted"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_section_field" ADD "is_deleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "survey_section_field" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "survey_section_field" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

}
