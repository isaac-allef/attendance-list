import { Entity, Column, PrimaryColumn, OneToMany, JoinColumn } from 'typeorm';

import Key from './Key';

@Entity('attendance_lists')
export default class AttendanceList {
    @PrimaryColumn()
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text', default: '' })
    note: string;

    @Column({ type: 'boolean', default: false })
    closed: boolean;

    @OneToMany(() => Key, key => key.attendance_list, {
        cascade: ['insert', 'update']
    })
    @JoinColumn({ name: 'id_list' })
    keys: Key[]
}