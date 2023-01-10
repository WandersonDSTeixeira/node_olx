import { Schema, connection, model, Model, ObjectId } from "mongoose";
import { UserType } from "../types/UserType";

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
