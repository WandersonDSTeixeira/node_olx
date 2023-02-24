import { connect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@olx.l8rlmj2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

export const mongoConnect = async () => {
    try {
        await connect(uri);
        console.log('MongoDB conectado com sucesso');
    } catch (error) {
        console.log('Error conexão MongoDB:', error);
    }
}