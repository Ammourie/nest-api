const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Init1731504699867 {
    name = 'Init1731504699867'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" ADD "tmp" character varying`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tmp"`);
    }
}
