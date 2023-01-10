import { ObjectId } from "mongoose";

export type AdsType = {
    _id: ObjectId;
    title: string;
    price: number;
    priceNegotiable: boolean;
    image: {
        url: string;
    };
}