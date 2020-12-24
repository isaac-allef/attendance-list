import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import AttendanceList from '../models/AttendanceList';

import {getConnection} from "typeorm";

import * as Yup from 'yup';

import attendanceListView from '../views/attendance_lists_view';

import generateId from '../generateId/handler';
import Key from '../models/Key';

export default {
    async index(request: Request, response: Response) {
        const attendance_list_repository = getRepository(AttendanceList);

        const attendance_lists = await attendance_list_repository.find({
            relations: ['keys']
        });

        return response.status(200).json(attendanceListView.renderMany(attendance_lists));
    },

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const attendance_list_repository = getRepository(AttendanceList);

        const attendance_list = await attendance_list_repository.findOneOrFail(id, {
            relations: ['keys']
        });

        return response.status(200).json(attendanceListView.render(attendance_list));
    },

    async update(request: Request, response: Response) {
        const { id } = request.params;
        const { title, note, closed } = request.body;

        interface Data {
            id: string,
            title?: string,
            note?: string,
            closed?: boolean,
        }

        const data: Data = {
            id: id,
            title: title,
            note: note,
            closed: closed
        };

        const schema = Yup.object().shape({
            id: Yup.string().required(),
            title: Yup.string(),
            note: Yup.string(),
            closed: Yup.boolean(),
        });

        await schema.validate(data, {
            abortEarly: false,
        });

        function copyToUpdate(obj: any) {
            let objCopy = {} as any
            let key
            for (key in obj) {
                if (key !== 'id' && obj[key] !== undefined) {
                    objCopy[key] = obj[key]
                }
            }
            return objCopy
        }

        const dataToUpdate = copyToUpdate(data)
        
        const attendance_list_repository = getRepository(AttendanceList);

        await attendance_list_repository.update(data.id, dataToUpdate);
    
        const attendance_list = await attendance_list_repository.findOneOrFail(id, {
            relations: ['keys']
        });

        return response.status(200).json(attendanceListView.render(attendance_list));
    },

    async create(request: Request, response: Response) {
        const {
            title,
            note,
            keys,
        } = request.body;
    
        const attendance_list_repository = getRepository(AttendanceList);

        interface Data {
            id: string,
            title: string,
            note: string,
            keys: object[]
        }

        const data: Data = {
            id: await generateId(title),
            title,
            note,
            keys,
        };

        const schema = Yup.object().shape({
            id: Yup.string().required(),
            title: Yup.string().required(),
            note: Yup.string(),
            keys: Yup.array(
                Yup.object().shape({
                    value: Yup.string().required(),
                    present: Yup.boolean(),
                })
            )
        });

        await schema.validate(data, {
            abortEarly: false,
        });
    
        const attendance_list = attendance_list_repository.create(data);
    
        await attendance_list_repository.save(attendance_list);
    
        return response.status(201).json(attendanceListView.render(attendance_list));
    },

    async remove(request: Request, response: Response) {
        const { id } = request.params;

        const attendance_list_repository = getRepository(AttendanceList);

        const attendance_list = await attendance_list_repository.findOneOrFail(id, {
            relations: ['keys']
        });

        await attendance_list_repository.remove(attendance_list);

        return response.status(200).json(attendanceListView.render(attendance_list));
    },
}