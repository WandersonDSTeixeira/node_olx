import { Schema, connection, model, Model, ObjectId } from "mongoose";

export type AdType = {
    _id: ObjectId;
    idUser: string;
    state: string;
    category: string;
    images: [{
        url: string;
        default: boolean;
    }];
    dateCreated: Date;
    title: string;
    price: number;
    priceNegotiable: boolean;
    description: string;
    views: number;
    status: boolean;
    default: boolean;
}

const schema = new Schema<AdType>({
    idUser: String,
    state: String,
    category: String,
    images: [{
        url: { type: String },
        default: { type: Boolean }
    }],
    dateCreated: Date,
    title: String,
    price: Number,
    priceNegotiable: Boolean,
    description: String,
    views: Number,
    status: String,
    default: Boolean
})

const modelName = 'Ad';

export default (connection && connection.models[modelName]) ?
    connection.models[modelName] as Model<AdType> :
    model<AdType>(modelName, schema);
