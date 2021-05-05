const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const router = require('./routes');

dotenv.config();

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
};

app.use(express.json());

(async () => {
    try {
      await mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      });
      console.log(`DB connection successful!`);

      let port = process.env.PORT || 3000;
      app.listen(port, () => console.log(`App running on port ${port}!`));
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  })();

  app.use('/api', router);
