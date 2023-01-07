import { Request, Response } from "express";
import { validationResult } from "express-validator/src/validation-result";
import { matchedData } from "express-validator/src/matched-data";
import User from "../models/User";
import State from "../models/State";
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import { generateToken } from "../middlewares/passport";

export const authController =  {
    signup: async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.json({ error: errors.mapped() });

        const data = matchedData(req);
    
        const user = await User.findOne({ email: data.email });
        if (user) return res.status(400).json({ error: 'Esse email já existe!' });
        
        if (!mongoose.Types.ObjectId.isValid(data.state)) return res.status(400).json({ error: 'Código de estado inválido!' });
        
        const stateItem = await State.findById(data.state);
        if (!stateItem) return res.status(400).json({ error: 'Esse estado não existe!' });

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(data.password as string, salt);

        const newUser = new User({
            name: data.name,
            email: data.email,
            password: passwordHash,
            state: data.state
        });

        await newUser.save();

        const token = generateToken({ id: newUser._id });
        const id = newUser._id;
                
        res.status(201).json({ id, token });
    },
    signin: async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.json({ error: errors.mapped() });

        const data = matchedData(req);

        const user = await User.findOne({ email: data.email });
        if (!user) return res.status(400).json({ error: 'Email e/ou senha errados!' });

        const match = await bcrypt.compare(data.password, user.password);
        if (!match) return res.status(400).json({ error: 'Email e/ou senha errados!' });
        
        const token = generateToken({ id: user._id });

        res.json({token, email: data.email})
    }
};