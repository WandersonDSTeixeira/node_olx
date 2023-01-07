import { Schema, connection, model, Model, ObjectId } from "mongoose";

export type CategoryType = {
    _id: ObjectId;
    name: string;
    slug: string;
    img: string;
}

const schema = new Schema<CategoryType>({
    name: String,
    slug: String
})

const modelName = 'Category';

export default (connection && connection.models[modelName]) ?
    connection.models[modelName] as Model<CategoryType> :
    model<CategoryType>(modelName, schema);
