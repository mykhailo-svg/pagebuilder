import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { config } from './config/config.js';
import path from 'path';
import { routes } from './routes/index.js';

dotenv.config();

const app = express();

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public/static" directory
app.use(express.static(path.join(path.resolve(path.dirname(''), 'public/static'))));

// Serve image files from the "public/images" directory
app.use('/images', express.static(path.join(path.resolve(path.dirname(''), 'public/images'))));
// enable cors
app.use(cors());
app.options('*', cors());

// parse json request body
app.use(express.json());

// api routes
app.use(routes);

app.listen(config.port, () => {
  console.log('Server Started');
});
