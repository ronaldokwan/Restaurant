if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const router = require("./routers");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(router);

// app.listen -> bin/www
module.exports = app;
