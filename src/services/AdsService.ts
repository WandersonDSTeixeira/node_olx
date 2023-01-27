import Ad from '../models/Ad';
import Category from '../models/Category';
import State from '../models/State';
import { AdType } from '../types/AdType';
import { FilterType } from '../types/FilterType';
import { AdUpdateType } from '../types/AdUpdateType';
import User from '../models/User';
import { SingleImageType } from '../types/SingleImageType';

export const createAd = async (newAd: AdType) => {
    return await Ad.create(newAd);
}

export const findAdsTotal = async (filters: FilterType) => {
    if (filters.status && !filters.title && !filters.category && !filters.state) {
        return await Ad.find({ status: filters.status })
    };
    if (filters.status && filters.title && !filters.category && !filters.state) {
        return await Ad.find({ status: filters.status, title: filters.title })
    };
    if (filters.status && filters.title && filters.category && !filters.state) {
        return await Ad.find({ status: filters.status, title: filters.title, category: filters.category })
    };
    if (filters.status && filters.title && !filters.category && filters.state) {
        return await Ad.find({ status: filters.status, title: filters.title, state: filters.state })
    };
    if (filters.status && filters.title && filters.category && filters.state) {
        return await Ad.find({ status: filters.status, title: filters.title, category: filters.category, state: filters.state })
    };
    if (filters.status && !filters.title && filters.category && !filters.state) {
        return await Ad.find({ status: filters.status, category: filters.category })
    };
    if (filters.status && !filters.title && filters.category && filters.state) {
        return await Ad.find({ status: filters.status, category: filters.category, state: filters.state })
    };
    if (filters.status && !filters.title && !filters.category && filters.state) {
        return await Ad.find({ status: filters.status, state: filters.state })
    };

    return [];
}

export const findFilteredAd = async (filters: FilterType, sort: string, offset: string, limit: string) => {
    if (filters.status && !filters.title && !filters.category && !filters.state) {
        return await Ad.find({ status: filters.status })
        .sort({ dateCreated: sort == 'desc' ? -1 : 1 })
        .skip(parseInt(offset as string))
        .limit(parseInt(limit as string))
        .exec();
    };
    if (filters.status && filters.title && !filters.category && !filters.state) {
        return await Ad.find({ status: filters.status, title: filters.title })
        .sort({ dateCreated: sort == 'desc' ? -1 : 1 })
        .skip(parseInt(offset as string))
        .limit(parseInt(limit as string))
        .exec();
    };
    if (filters.status && filters.title && filters.category && !filters.state) {
        return await Ad.find({ status: filters.status, title: filters.title, category: filters.category })
        .sort({ dateCreated: sort == 'desc' ? -1 : 1 })
        .skip(parseInt(offset as string))
        .limit(parseInt(limit as string))
        .exec();
    };
    if (filters.status && filters.title && !filters.category && filters.state) {
        return await Ad.find({ status: filters.status, title: filters.title, state: filters.state })
        .sort({ dateCreated: sort == 'desc' ? -1 : 1 })
        .skip(parseInt(offset as string))
        .limit(parseInt(limit as string))
        .exec();
    };
    if (filters.status && filters.title && filters.category && filters.state) {
        return await Ad.find({ status: filters.status, title: filters.title, category: filters.category, state: filters.state })
        .sort({ dateCreated: sort == 'desc' ? -1 : 1 })
        .skip(parseInt(offset as string))
        .limit(parseInt(limit as string))
        .exec();
    };
    if (filters.status && !filters.title && filters.category && !filters.state) {
        return await Ad.find({ status: filters.status, category: filters.category })
        .sort({ dateCreated: sort == 'desc' ? -1 : 1 })
        .skip(parseInt(offset as string))
        .limit(parseInt(limit as string))
        .exec();
    };
    if (filters.status && !filters.title && filters.category && filters.state) {
        return await Ad.find({ status: filters.status, category: filters.category, state: filters.state })
        .sort({ dateCreated: sort == 'desc' ? -1 : 1 })
        .skip(parseInt(offset as string))
        .limit(parseInt(limit as string))
        .exec();
    };
    if (filters.status && !filters.title && !filters.category && filters.state) {
        return await Ad.find({ status: filters.status, state: filters.state })
        .sort({ dateCreated: sort == 'desc' ? -1 : 1 })
        .skip(parseInt(offset as string))
        .limit(parseInt(limit as string))
        .exec();
    };
    
    return [];
}

export const findAd = async (id: string) => {
    return await Ad.findById( id ).exec();
}

export const updateAdViews = async (id: string, views: number) => {
    return await Ad.findByIdAndUpdate(id, { views }).exec();
}

export const findOtherAds = async (idUser: string) => {
    return await Ad.find({
        status: true,
        idUser,
    }).exec();
}

export const updateAd = async (id: string, updates: AdUpdateType) => {
    return await Ad.findOneAndUpdate({ _id: id }, updates ).exec();
}

export const deleteAdImages = async (adId: string) => {
    return await Ad.findByIdAndUpdate(
        adId,
        { $unset: { images: '' } }
     )
}

export const updateAdImages = async (adId: string, images: SingleImageType[]) => {
    return await Ad.findByIdAndUpdate(adId, { $set: { 'images': images } } ).exec();
}

export const deleteAd = async (id: string) => {
    return await Ad.findByIdAndDelete( id ).exec();
}

export const findCategory = async (cat: string) => {
    return await Category.findOne({ slug: cat }).exec();
}

export const findAllCategories = async () => {
    return await Category.find({}).exec();
}

export const findState = async (state: string) => {
    return await State.findOne({ name: state }).exec();
}

export const findAdUser = async (idUser: string) => {
    return await User.findOne({ idUser }).exec();
}