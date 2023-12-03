const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const config = require('./config/config.js');
const path = require('path');
const morgan = require('./config/morgan');
const routes = require('./routes/v1/index.js');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
app.use(morgan.successHandler);
app.use(morgan.errorHandler);
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public/static" directory
app.use(express.static(path.join(path.resolve(path.dirname(''), 'public/static'))));

// Serve image files from the "public/images" directory
app.use('/images', express.static(path.join(path.resolve(path.dirname(''), 'public/images'))));
// enable cors

const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true);
  }
};
corsOptions.credentials = true;
app.use(cors(corsOptions));

// parse json request body
app.use(express.json());

// api routes
app.use('/v1', routes);

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  console.log('Connected to MongoDB');
  server = app.listen(config.port, () => {
    console.log`Listening to port ${config.port}`;
  });
});
