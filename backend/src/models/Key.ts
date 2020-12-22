import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

import AttendanceList from './AttendanceList';

@Entity('keys')
export default class Key {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    value: string;

    @Column({ type: 'boolean', default: false})
    present: boolean;

    @ManyToOne(() => AttendanceList, attendanceList => attendanceList.keys)
    @JoinColumn({ name: 'id_list' })
    attendance_list: AttendanceList;
}