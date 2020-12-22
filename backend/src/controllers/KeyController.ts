import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Key from '../models/Key';

import * as Yup from 'yup';

import keyView from '../views/keys_view';

import AttendanceList from '../models/AttendanceList';

export default {   

    async add(request: Request, response: Response) {
        const {
            attendance_list_id,
            value,
        } = request.body;

        interface Data {
            attendance_list_id: string,
            value: string
        }

        const data: Data = {
            attendance_list_id,
            value,
        };

        const schema = Yup.object().shape({
            attendance_list_id: Yup.string().required(),
            value: Yup.string().required(),
        });

        await schema.validate(data, {
            abortEarly: false,
        });

        const attendance_list_repository = getRepository(AttendanceList);

        const attendance_list = await attendance_list_repository.findOneOrFail(data.attendance_list_id, {
            relations: ['keys']
        });

        const key_repository = getRepository(Key);

        const key = key_repository.create({
            attendance_list: attendance_list,
            value: data.value
        });

        await key_repository.save(key);

        return response.status(201).json(keyView.render(key));
    },

    async remove(request: Request, response: Response) {
        const { 
            attendance_list_id,
            value
        } = request.body;

        interface Data {
            attendance_list_id: string,
            value: string
        }

        const data: Data = {
            attendance_list_id,
            value,
        };

        const schema = Yup.object().shape({
            attendance_list_id: Yup.string().required(),
            value: Yup.string().required(),
        });

        await schema.validate(data, {
            abortEarly: false,
        });

        const attendance_list_repository = getRepository(AttendanceList);

        const attendance_list = await attendance_list_repository.findOneOrFail(attendance_list_id, {
             relations: ['keys']
        });

        const key_repository = getRepository(Key);

        const key = await key_repository.findOneOrFail({
            attendance_list: attendance_list,
            value: value
        }, { relations: ['attendance_list'] });

        await key_repository.remove(key);

        return response.status(200).json(keyView.render(key));
    },

    async present(request: Request, response: Response) {
        const { 
            attendance_list_id,
            value,
            present
         } = request.body;

        interface Data {
            attendance_list_id: string,
            value: string,
            present: boolean,
        }

        const data: Data = {
            attendance_list_id: attendance_list_id,
            value: value,
            present: present,
        };

        const schema = Yup.object().shape({
            attendance_list_id: Yup.string().required(),
            value: Yup.string().required(),
            present: Yup.boolean().required()
        });

        await schema.validate(data, {
            abortEarly: false,
        });
        
        const attendance_list_repository = getRepository(AttendanceList);

        const attendance_list = await attendance_list_repository.findOneOrFail(attendance_list_id, {
             relations: ['keys']
        });

        const key_repository = getRepository(Key);

        let key = await key_repository.findOneOrFail({
            attendance_list: attendance_list,
            value: value
        }, { relations: ['attendance_list'] });

        key.present = data.present;
        await key_repository.save(key);

        return response.status(200).json(keyView.render(key));
    },
}