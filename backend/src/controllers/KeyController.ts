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

    async removeById(request: Request, response: Response) {
        const { 
            id,
        } = request.params;

        interface Data {
            id: number,
        }

        const data: Data = {
            id: parseInt(id),
        };

        const schema = Yup.object().shape({
            id: Yup.number().required(),
        });

        await schema.validate(data, {
            abortEarly: false,
        });

        const key_repository = getRepository(Key);

        const key = await key_repository.findOneOrFail(id, { relations: ['attendance_list'] });

        await key_repository.remove(key);

        return response.status(200).json(keyView.render(key));
    },

    async update(request: Request, response: Response) {
        const { id } = request.params
        const { value, present } = request.body;

        interface Data {
            id: number,
            value: string,
            present: boolean,
        }

        const data: Data = {
            id: parseInt(id),
            value: value,
            present: present,
        };

        const schema = Yup.object().shape({
            id: Yup.number(),
            value: Yup.string().notOneOf([""]),
            present: Yup.boolean(),
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

        const key_repository = getRepository(Key);

        await key_repository.update(id, dataToUpdate)

        let key = await key_repository.findOneOrFail(id, { relations: ['attendance_list'] });

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

        if (attendance_list.closed) {
            return response.status(401).json({message: "This attendance list is closed"})
        }

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