import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import fileupload from 'express-fileupload';
import { mongoConnect } from './database/mongo';
import router from './routes';

dotenv.config();

mongoConnect();

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(fileupload());
server.use(express.static(__dirname + '/public'));

server.use('/', router);

server.listen(process.env.PORT, () => {
    console.log(`Rodando em ${process.env.BASE}`);
})