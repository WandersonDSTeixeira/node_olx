import Ad from '../models/Ad';
import Category from '../models/Category';
import User from '../models/User';
import State from '../models/State';
import { AdType } from '../types/AdType';
import { UserUpdateType } from '../types/UserUpdateType';

export const findStates = async () => {
    return await State.find({}).sort({ name: 1 }).exec();
}

export const findUserState = async (state: string) => {
    return await State.findById( state ).exec();
}

export const findAds = async (userId: string) => {
    return await Ad.findOne<AdType[]>({ idUser: userId }).exec();
}

export const findCategory = async (category: string) => {
    return await Category.findById( category );
}

export const findUser = async (email: string) => {
    return await User.findOne({ email });
}

export const updateUser = async (userId: string, updates: UserUpdateType) => {
    return await User.findByIdAndUpdate({ _id: userId, $set: updates });
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