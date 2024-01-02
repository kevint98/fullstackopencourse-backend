const logger = require("./logger");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).send({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: error.message });
  } else if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "token expired",
    });
  }

  next(error);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization) {
    if (authorization.startsWith("Bearer ")) {
      req.token = authorization.replace("Bearer ", "");
    } else {
      req.token = req.body.token || req.query.token;
    }

    if (!req.token) {
      return res.status(403).send("A token is required for authentication");
    }
  }

  next();
};

const userExtractor = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);

  if (decodedToken.id) {
    req.user = await User.findById(decodedToken.id);
  }

  next();
};

module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor,
};
