import { connect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = `mongodb+srv://WandyT:${process.env.MONGO_PASSWORD}@olx.l8rlmj2.mongodb.net/?retryWrites=true&w=majority`;

export const mongoConnect = async () => {
    try {
        await connect(uri, {dbName: 'olx'});
        console.log('MongoDB conectado com sucesso');
    } catch (error) {
        console.log('Error conexão MongoDB:', error);
    }
}