import mongoose from "mongoose";
import { Request, Response } from "express";
import State, { StateType } from "../models/State";
import User, { UserType } from "../models/User";
import Category, { CategoryType } from "../models/Category";
import Ad from "../models/Ad";
import { validationResult } from "express-validator/src/validation-result";
import { matchedData } from "express-validator/src/matched-data";
import bcrypt from "bcrypt";

export const userController = {
    getStates: async (req: Request, res: Response) => {
        let states = await State.find({});
        res.json({ states });
    },
    infoUser: async (req: Request, res: Response) => {
        const user = req.user as UserType;
        const state = await State.findById(user.state) as StateType;
        const ads = await Ad.find({ idUser: user._id.toString() });

        let adList = [];
        for (let i in ads) {
            const catName = await Category.findById(ads[i].category) as CategoryType;
            adList.push({ ...ads[i], category: catName.slug });
        }

        res.json({
            name: user.name,
            email: user.email,
            state: state.name,
            ads: adList,
        });
    },
    editUser: async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.json({ error: errors.mapped() });

        const data = matchedData(req);

        const user = req.user as UserType;

        type Updates = {
            name?: string;
            email?: string;
            state?: string;
            password?: string;
        };

        let updates: Updates = {};

        if (data.name) updates.name = data.name;
        if (data.email) {
            const emailCheck = await User.findOne({ email: data.email });
            if (emailCheck) return res.status(400).json({ error: "Esse email já existe!" });
            updates.email = data.email;
        }
        if (data.state) {
            if (!mongoose.Types.ObjectId.isValid(data.state)) return res.status(400).json({ error: "Código de estado inválido!" });
            
            const stateCheck = State.findById(data.state);
            if (!stateCheck) return res.status(400).json({ error: "Esse estado não existe!" });
            updates.state = data.state;
        }
        if (data.password) updates.password = await bcrypt.hash(data.password, 10);

        await User.findOneAndUpdate({ _id: user._id }, { $set: updates });

        res.json({ msg: "Atualizado com sucesso!" });
    }
};