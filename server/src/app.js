import express from 'express';
import * as Controller from './controller';

const app = express();

// App middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add router
app.use('/mirror', Controller.PostController);

export default app;
