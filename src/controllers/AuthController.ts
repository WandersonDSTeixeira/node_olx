import { Request, Response } from 'express';
import { validationResult } from 'express-validator/src/validation-result';
import { matchedData } from 'express-validator/src/matched-data';
import bcrypt from 'bcrypt';
import { generateToken } from '../middlewares/passport';
import * as UserService from '../services/UserService';
import * as AdsService from '../services/AdsService';

export const authController =  {
    signup: async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.json({ error: errors.mapped() });

        const data = matchedData(req);
        
        const user = await UserService.findUser(data.email);
        if (user) return res.status(400).json({ error: 'Esse email já existe!' });
        
        const stateItem = await AdsService.findState(data.state);
        if (!stateItem) return res.status(400).json({ error: 'Esse estado não existe!' });

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(data.password as string, salt);

        const newUser = await UserService.createUser(data.name, data.email, passwordHash, data.state);
    
        const token = generateToken({ id: newUser._id });
        const id = newUser._id;
                
        res.status(201).json({ id, token });
    },
    signin: async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.json({ error: errors.mapped() });

        const data = matchedData(req);

        const user = await UserService.findUser(data.email);
        if (!user) return res.status(400).json({ error: 'Email e/ou senha errados!' });

        const match = await bcrypt.compare(data.password, user.password);
        if (!match) return res.status(400).json({ error: 'Email e/ou senha errados!' });
        
        const token = generateToken({ id: user._id });

        res.json({token, email: data.email})
    }
};