import Ad from '../models/Ad';
import User from '../models/User';
import State from '../models/State';
import { UserUpdateType } from '../types/UserUpdateType';

export const findStates = async () => {
    return await State.find({}).sort({ name: 1 }).exec();
}

export const findUserState = async (state: string) => {
    return await State.findOne({name: state}).exec();
}

export const findAds = async (userId: string) => {
    return await Ad.find({ idUser: userId }).exec();
}

export const findUser = async (email: string) => {
    return await User.findOne({ email });
}

export const updateUser = async (userId: string, updates: UserUpdateType) => {
    return await User.findByIdAndUpdate( userId, updates );
}

export const createUser = async (name: string, email: string, passwordHash: string, state: string) => {
    const newUser = await User.create({
        name,
        email,
        password: passwordHash,
        state
    });
    return newUser;
}