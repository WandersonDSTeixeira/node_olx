import { Schema, connection, model, Model, ObjectId } from 'mongoose';
import { StateType } from '../types/StateType';

const schema = new Schema<StateType>({
    name: String
})

const modelName = 'State';

export default (connection && connection.models[modelName]) ?
    connection.models[modelName] as Model<StateType> :
    model<StateType>(modelName, schema);
