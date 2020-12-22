import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createKey1607169660081 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'keys',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    unsigned: true,
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'value',
                    type: 'varchar',
                },
                {
                    name: 'present',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'id_list',
                    type: 'varchar'
                }
            ],
            foreignKeys: [
                {
                    name: 'attendance_list_key',
                    columnNames: ['id_list'],
                    referencedTableName: 'attendance_lists',
                    referencedColumnNames: ['id'],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE',
                }
            ],
            uniques: [
                {
                    name: 'valueInAttendanceList',
                    columnNames: ['value', 'id_list']
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('keys')
    }

}
