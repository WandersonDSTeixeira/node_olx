import { Schema, connection, model } from "mongoose";

type User = {
    name: string;
    email: string;
    state: string;
    password: string;
    token: string;
}

const schema = new Schema<User>({
    name: String,
    email: String,
    state: String,
    password: String,
    token: String
})

const modelName = 'User';

export default (connection && connection.models[modelName]) ?
    connection.models[modelName] :
    model<User>(modelName, schema);
