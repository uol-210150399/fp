import { MigrationInterface, QueryRunner } from 'typeorm';
import { SEED_USERS } from './config/seed-data';

export class SeedUserData1736130372235 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert system admin user
    await queryRunner.query(
      `
            INSERT INTO "user" (
                "user_id",
                "name",
                "created_at",
                "updated_at",
                "is_deleted_flag"
            ) VALUES (
                $1,  -- user_id
                $2,  -- name
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP,
                false
            )
        `,
      [SEED_USERS.SYSTEM_ADMIN.id, SEED_USERS.SYSTEM_ADMIN.name],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove system admin user
    await queryRunner.query(
      `
            DELETE FROM "user" 
            WHERE "user_id" = $1
        `,
      [SEED_USERS.SYSTEM_ADMIN.id],
    );
  }
}
