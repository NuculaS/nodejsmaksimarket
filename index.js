import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';

import { router as mainRouter } from './src/routes/index.js';

dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

const app = express();
app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use('/public', express.static('public'));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({}));

app.use('/', mainRouter);

const start = async () => {
    try {
        await mongoose.connect(MONGO_URL);

        const server = app.listen(PORT, () => {
            const { address, port } = server.address();
            if (process.env.ENVIRONMENT) {
                console.log(`Сервер запущен на http://localhost:${port}`);
            } else {
                console.log(`Сервер запущен на http://${address}:${port}`);
            }
        });
    } catch (e) {
        console.error(e);
    }
};

start();
