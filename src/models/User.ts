import { Schema, connection, model, Model, ObjectId } from "mongoose";

export type UserType = {
    _id: ObjectId;
    name: string;
    email: string;
    state: string;
    password: string;
};

const schema = new Schema<UserType>({
    name: String,
    email: String,
    state: String,
    password: String
});

const modelName = "User";

export default connection && connection.models[modelName]
    ? (connection.models[modelName] as Model<UserType>)
    : model<UserType>(modelName, schema);
