import { Schema, connection, model, Model } from 'mongoose';
import { AdType } from '../types/AdType';

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
    status: String
})

const modelName = 'Ad';

export default (connection && connection.models[modelName]) ?
    connection.models[modelName] as Model<AdType> :
    model<AdType>(modelName, schema);
