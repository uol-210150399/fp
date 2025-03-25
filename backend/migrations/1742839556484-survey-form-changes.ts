import { MigrationInterface, QueryRunner } from "typeorm";

export class SurveyFormChanges1742839556484 implements MigrationInterface {
    name = 'SurveyFormChanges1742839556484'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_form" ADD "welcome_message" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey_form" DROP COLUMN "welcome_message"`);
    }

}
