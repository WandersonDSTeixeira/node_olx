import { connect, ConnectOptions } from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export const mongoConnect = async () => {
    try {
        await connect(process.env.MONGO_URL as string);
        console.log("MongoDB conectado com sucesso");
    } catch (error) {
        console.log("Error conexão MongoDB:", error);
    }
}