import express from 'express';
import cors from 'cors';
import ejs from 'ejs';
import * as Controller from './controller';

const app = express();
// App middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: '*',
  })
);

app.set('views', __dirname + '/views');
app.engine('html', ejs.renderFile);
app.use(express.static(__dirname + 'public'));
app.set('view engine', 'ejs');

// Add router
app.use('/', Controller.PostController);

export default app;
