import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSurveyPublishedEntity1743031251633 implements MigrationInterface {
    name = 'UpdateSurveyPublishedEntity1743031251633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "published_survey" ADD "published_by" uuid`);
        await queryRunner.query(`ALTER TABLE "published_survey" ADD CONSTRAINT "FK_718048d279ff5d537b2b3b2aea0" FOREIGN KEY ("published_by") REFERENCES "team_membership"("membership_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "published_survey" DROP CONSTRAINT "FK_718048d279ff5d537b2b3b2aea0"`);
        await queryRunner.query(`ALTER TABLE "published_survey" DROP COLUMN "published_by"`);
    }

}
