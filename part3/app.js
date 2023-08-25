const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");

const personsRouter = require("./controllers/persons");
const personsInfoRouter = require("./controllers/info");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const morgan = require("morgan");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

logger.info("connecting to MongoDB...");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

morgan.token("body", (request) => {
  return JSON.stringify(request.body);
});

app.use(cors());
app.use(express.json());
app.use(express.static("build"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use("/info", personsInfoRouter);
app.use("/api/persons", personsRouter);

app.use(middleware.errorHandler);

module.exports = app;
