// npm modules
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// user modules
const contactsRouter = require("./routes/api/contactsRoute");
const usersRouter = require("./routes/api/usersRoute");

// expres aplication
const app = express();

// enviroment
const envPath =
  process.env.NODE_ENV === "production"
    ? "./enviroments/production.env"
    : "./enviroments/development.env";

dotenv.config({ path: envPath });

// mongoDB conection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

// midlewares
const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'))

// routes
app.use("/users", usersRouter);
app.use("/api/contacts", contactsRouter);

// not found error
app.all("*", (req, res) => {
  res.status(404).json({
    message: "Oops! Resource not found..",
  });
});

// server error
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;
