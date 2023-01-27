import { ObjectId } from 'mongoose';

export type AdType = {
    _id?: ObjectId;
    idUser: string;
    state: string;
    category: string;
    categoryName: string;
    images: [{
        url: string;
        default: boolean;
    }];
    image?: { url: string };
    dateCreated: Date;
    title: string;
    price: number;
    priceNegotiable: boolean;
    description: string;
    views: number;
    status: boolean;
}