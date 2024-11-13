import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1731491134299 implements MigrationInterface {
    name = 'Init1731491134299'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blog" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "approved" boolean NOT NULL DEFAULT (0), "title" varchar NOT NULL, "content" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "fullName" varchar NOT NULL, "password" varchar NOT NULL, "isAdmin" boolean NOT NULL DEFAULT (1), "access_token" varchar)`);
        await queryRunner.query(`CREATE TABLE "temporary_blog" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "approved" boolean NOT NULL DEFAULT (0), "title" varchar NOT NULL, "content" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer, CONSTRAINT "FK_fc46ede0f7ab797b7ffacb5c08d" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_blog"("id", "approved", "title", "content", "created_at", "updated_at", "userId") SELECT "id", "approved", "title", "content", "created_at", "updated_at", "userId" FROM "blog"`);
        await queryRunner.query(`DROP TABLE "blog"`);
        await queryRunner.query(`ALTER TABLE "temporary_blog" RENAME TO "blog"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog" RENAME TO "temporary_blog"`);
        await queryRunner.query(`CREATE TABLE "blog" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "approved" boolean NOT NULL DEFAULT (0), "title" varchar NOT NULL, "content" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer)`);
        await queryRunner.query(`INSERT INTO "blog"("id", "approved", "title", "content", "created_at", "updated_at", "userId") SELECT "id", "approved", "title", "content", "created_at", "updated_at", "userId" FROM "temporary_blog"`);
        await queryRunner.query(`DROP TABLE "temporary_blog"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "blog"`);
    }

}
