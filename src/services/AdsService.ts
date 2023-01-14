import Ad from '../models/Ad';
import Category from '../models/Category';
import State from '../models/State';
import { AdType } from '../types/AdType';
import { FilterType } from '../types/FilterType';
import { AdUpdateType } from '../types/AdUpdateType';
import User from '../models/User';

export const createAd = async (newAd: AdType) => {
    return await Ad.create(newAd);
}

export const findAdsTotal = async (filters: FilterType) => {
    return await Ad.find({ filters }).exec();
}

export const findFilteredAd = async (filters: FilterType, sort: string, offset: string, limit: string) => {
    return await Ad.find( filters )
            .sort({ dateCreated: sort == 'desc' ? -1 : 1 })
            .skip(parseInt(offset as string))
            .limit(parseInt(limit as string))
            .exec();
}

export const findAd = async (id: string) => {
    return await Ad.findById( id ).exec();
}

export const updateAdViews = async (id: string, views: number) => {
    return await Ad.findByIdAndUpdate(id, { views } ).exec();
}

export const findOtherAds = async (idUser: string) => {
    return await Ad.find({
        status: true,
        idUser,
    }).exec();
}

export const updateAd = async (id: string, updates: AdUpdateType) => {
    return await Ad.findByIdAndUpdate( id, { updates }).exec();
}

export const updateAdImages = async (adId: string, images: [{url: string, default: boolean}]) => {
    return await Ad.findByIdAndUpdate( adId, { images }).exec();
}

export const deleteAd = async (id: string) => {
    return await Ad.findByIdAndDelete( id ).exec();
}

export const findCategory = async (cat: string) => {
    return await Category.findById( cat ).exec();
}

export const findAllCategories = async () => {
    return await Category.find({}).exec();
}

export const findState = async (state: string) => {
    return await State.findById( state ).exec();
}

export const findAdUser = async (idUser: string) => {
    return await User.findOne({ idUser }).exec();
}