import { MigrationInterface, QueryRunner } from 'typeorm';
import { SEED_USERS } from './config/seed-data';

export class SeedProjectData1736130372245 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert system admin user
    await queryRunner.query(
      `
            INSERT INTO "project" (
                "project_id",
                "title",
                "created_at",
                "updated_at",
                "created_by",
                "updated_by",
                "is_deleted_flag"
            ) VALUES (
                $1,  -- project_id
                $2,  -- name
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP,
                $3,  -- created_by
                $4,  -- updated_by
                false
            )
        `,
      [
        SEED_USERS.SYSTEM_PROJECT.id,
        SEED_USERS.SYSTEM_PROJECT.title,
        SEED_USERS.SYSTEM_ADMIN.id,
        SEED_USERS.SYSTEM_ADMIN.id,
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove system admin user
    await queryRunner.query(
      `
            DELETE FROM "project" 
            WHERE "project_id" = $1
        `,
      [SEED_USERS.SYSTEM_ADMIN.id],
    );
  }
}
