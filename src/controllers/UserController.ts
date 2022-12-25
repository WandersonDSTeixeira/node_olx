import { Request, Response } from "express";
import State from "../models/State";

export const user = {
    getStates: async (req: Request, res: Response) => {
        let states = await State.find({});
        res.json({ states });
    },
    info: (req: Request, res: Response) => {

    },
    edit: (req: Request, res: Response) => {

    }
};