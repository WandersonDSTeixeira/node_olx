import { Schema, connection, model, Model, ObjectId } from "mongoose";

export type StateType = {
    _id: ObjectId;
    name: string;
}

const schema = new Schema<StateType>({
    name: String
})

const modelName = 'State';

export default (connection && connection.models[modelName]) ?
    connection.models[modelName] as Model<StateType> :
    model<StateType>(modelName, schema);
