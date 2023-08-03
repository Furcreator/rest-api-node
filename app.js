const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const contactsRouter = require("./routes/api/contactsRoute");

const app = express();

const envPath =
  process.env.NODE_ENV === "production"
    ? "./enviroments/production.env"
    : "./enviroments/development.env";

dotenv.config({ path: envPath });

mongoose
  .connect(process.env.MONGO_URL)
  .then((con) => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.all("*", (req, res) => {
  res.status(404).json({
    message: "Oops! Resource not found..",
  });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;
