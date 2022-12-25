import { Schema, connection, model } from "mongoose";

type Ad = {
    idUser: string;
    state: string;
    category: string;
    images: [object];
    dateCreated: Date;
    title: string;
    price: number;
    priceNegotiable: boolean;
    description: string;
    views: number;
    status: string;
}

const schema = new Schema<Ad>({
    idUser: String,
    state: String,
    category: String,
    images: [Object],
    dateCreated: Date,
    title: String,
    price: Number,
    priceNegotiable: Boolean,
    description: String,
    views: Number,
    status: String
})

const modelName = 'Ad';

export default (connection && connection.models[modelName]) ?
    connection.models[modelName] :
    model<Ad>(modelName, schema);
