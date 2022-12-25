import { Schema, connection, model } from "mongoose";

type State = {
    name: string;
}

const schema = new Schema<State>({
    name: String
})

const modelName = 'State';

export default (connection && connection.models[modelName]) ?
    connection.models[modelName] :
    model<State>(modelName, schema);
