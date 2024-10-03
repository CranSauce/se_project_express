const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '66fda730ec00f267b8c5e5c0'
  };
  next();
});

const { PORT = 3001 } = process.env;

mongoose
.connect('mongodb://127.0.0.1:27017/wtwr_db')
.then(() => {

})
.catch(console.error);

app.use("/", mainRouter);

app.listen(PORT, () => {

});