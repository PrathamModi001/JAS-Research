import express from 'express';
import bodyParser from 'body-parser';
import { userRouter } from './routers/userRouter.js';
import swaggerMiddleware from './swagger.js';
import cors from 'cors';
import dbConnect from './config/db-config.js';
import { researchPaperRouter } from './routers/researchPaperRouter.js';

export const app = express();

swaggerMiddleware(app);
dbConnect();
app.use(cors());
app.use(bodyParser.json());
app.use('/user', userRouter);
app.use('/research-paper', researchPaperRouter)
app.use('/', (req, res) => res.send('Server up and running'));
