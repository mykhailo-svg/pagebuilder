const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  port: process.env.PORT,
  mongoose: {
    url: process.env.MONGODB_URL,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  jwt: {
    secret: process.env.JWT_SECRET
  }
};
