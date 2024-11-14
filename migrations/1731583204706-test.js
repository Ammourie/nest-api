const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Test1731583204706 {
    name = 'Test1731583204706'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tmp"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" ADD "tmp" character varying`);
    }
}
