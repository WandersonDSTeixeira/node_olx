import { ObjectId } from 'mongoose';

export type GetAdsType = {
    _id: ObjectId;
    title: string;
    price: number;
    priceNegotiable: boolean;
    image: {
        url: string;
    };
}