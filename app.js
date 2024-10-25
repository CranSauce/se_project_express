require('dotenv').config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const { errors } = require('celebrate');
const mainRouter = require("./routes/index");
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const apiLimiter = require("./utils/rateLimiter");
const helmet = require("helmet");



const app = express();

app.use(helmet);

app.use(apiLimiter);

app.use(express.json());

app.use(cors());

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch(console.error);


app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use("/", mainRouter);

app.listen(PORT, '0.0.0.0', () => {});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);