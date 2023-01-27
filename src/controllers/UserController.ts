import { ObjectId } from 'mongoose';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator/src/validation-result';
import { matchedData } from 'express-validator/src/matched-data';
import bcrypt from 'bcrypt';
import { UserUpdateType } from '../types/UserUpdateType';
import { UserType } from '../types/UserType';
import { StateType } from '../types/StateType';
import * as UserService from '../services/UserService';
import { AdType } from '../types/AdType';

export const userController = {
    getStates: async (req: Request, res: Response) => {
        const states = await UserService.findStates();
        res.json({ states });
    },
    infoUser: async (req: Request, res: Response) => {
        const user = req.user as UserType;
        const state = await UserService.findUserState(user.state) as StateType;
        const userId = user._id as ObjectId;
        const ads = await UserService.findAds(userId.toString()) as AdType[];
        let adList = [];

        for (let i in ads) {
            let image = { url: `${process.env.BASE}/media/default.png` };
            type AdImage = {
                url: string;
                default: boolean;
            }
            let defaultImg = ads[i].images.find((e: AdImage) => e.default);

            if (defaultImg)
                image = { url: `${process.env.BASE}/media/${defaultImg.url}` };
                adList.push({ ...ads[i], image });
        }
        
        res.json({
            name: user.name,
            email: user.email,
            state: state.name,
            ads: adList
        });
    },
    editUser: async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.json({ error: errors.mapped() });

        const data = matchedData(req);

        const user = req.user as UserType;

        let updates: UserUpdateType = {};

        if (data.name) updates.name = data.name;
        if (data.email) {
            const emailCheck = await UserService.findUser(data.email);
            if (emailCheck) return res.status(400).json({ error: 'Esse email já existe!' });
            updates.email = data.email;
        }
        if (data.state) {
            const stateCheck = await UserService.findUserState(data.state);
            if (!stateCheck) return res.status(400).json({ error: 'Esse estado não existe!' });
            updates.state = data.state;
        }
        if (data.password) updates.password = await bcrypt.hash(data.password, 10);

        const userId = user._id as ObjectId;
        await UserService.updateUser( userId.toString(), updates );

        res.json({ msg: 'Atualizado com sucesso!' });
    }
};