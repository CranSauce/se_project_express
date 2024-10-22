const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const { errors } = require('celebrate');
const mainRouter = require("./routes/index");
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');



const app = express();
app.use(express.json());

app.use(cors());

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch(console.error);


app.use(requestLogger);
app.use("/", mainRouter);

app.listen(PORT, '0.0.0.0', () => {});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);