import dotenv from 'dotenv';
import express, { ErrorRequestHandler, Request, Response } from "express";
import cors from "cors";
import { mongoConnect } from "./database/mongo";
import router from "./routes/routes";
import passport from "passport";

dotenv.config();

mongoConnect();

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.static(__dirname + "/public"));
server.use(express.urlencoded({ extended: true }));

server.use(passport.initialize());

server.use(router);

server.use((req: Request, res: Response) => {
    res.status(404).json({ error: "Endpoint não encontrado!" });
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    (err.status) ? res.status(err.status) : res.status(400);
    (err.message) ? res.json(err.message) : res.json({ error: "Ocorreu algum erro!" });
    console.log(err);
};

server.use(errorHandler);

server.listen(process.env.PORT, () => {
    console.log(`Rodando em ${process.env.BASE}`);
});