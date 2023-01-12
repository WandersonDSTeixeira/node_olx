import { ObjectId } from 'mongoose';

export type UserType = {
    _id: ObjectId;
    name: string;
    email: string;
    state: string;
    password: string;
};