import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSurveyPublishedEntity1742931290997 implements MigrationInterface {
    name = 'UpdateSurveyPublishedEntity1742931290997'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "published_survey" RENAME COLUMN "form_data" TO "form_snapshot"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "published_survey" RENAME COLUMN "form_snapshot" TO "form_data"`);
    }

}
