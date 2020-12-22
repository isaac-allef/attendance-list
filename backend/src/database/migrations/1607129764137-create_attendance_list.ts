import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createAttendanceList1607129764137 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'attendance_lists',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true,
                },
                {
                    name: 'title',
                    type: 'varchar',
                },
                {
                    name: 'note',
                    type: 'text',
                },
                {
                    name: 'closed',
                    type: 'boolean',
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('attendance_lists');
    }

}
