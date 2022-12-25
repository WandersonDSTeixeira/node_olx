import { Schema, connection, model } from "mongoose";

type Category = {
    name: string;
    slug: string;
}

const schema = new Schema<Category>({
    name: String,
    slug: String
})

const modelName = 'Category';

export default (connection && connection.models[modelName]) ?
    connection.models[modelName] :
    model<Category>(modelName, schema);
