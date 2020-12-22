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

    async closed(request: Request, response: Response) {
        const { id } = request.params;
        const { closed } = request.body;

        interface Data {
            id: string,
            closed: boolean,
        }

        const data: Data = {
            id: id,
            closed: closed
        };

        const schema = Yup.object().shape({
            id: Yup.string().required(),
            closed: Yup.boolean().required()
        });

        await schema.validate(data, {
            abortEarly: false,
        });
        
        const attendance_list_repository = getRepository(AttendanceList);

        await attendance_list_repository.update(data.id, { closed: data.closed });
    
        const attendance_list = await attendance_list_repository.findOneOrFail(id, {
            relations: ['keys']
        });

        return response.status(200).json(attendanceListView.render(attendance_list));
    },

    async update(request: Request, response: Response) {
        const { id } = request.params;
        const {
            title,
            note,
            keys,
        } = request.body;

        interface Key {
            value: string,
            present?: boolean,
        }

        interface Data {
            id: string,
            title: string,
            note: string,
            keys: Key[]
        }

        const data: Data = {
            id,
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

        await getConnection().transaction(async transactionalEntityManager => {

            const attendance_list_repository = getRepository(AttendanceList);

            // await attendance_list_repository.update(data.id, { title, note });

            const key_repository = getRepository(Key);
            const keysToRemove = await key_repository.find({
                where: [
                    {attendance_list: data.id}
                ]
            })
            key_repository.remove(keysToRemove)

            await attendance_list_repository.save(data);
            
            const attendance_list = await attendance_list_repository.findOneOrFail(id, {
                relations: ['keys']
            });
        
            return response.status(201).json(attendanceListView.render(attendance_list));

        });
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