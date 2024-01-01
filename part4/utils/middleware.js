const logger = require("./logger");

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: error.message });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    });
  }

  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization) {
    if (authorization.startsWith("Bearer ")) {
      request.token = authorization.replace("Bearer ", "");
    } else {
      request.token = request.body.token || request.query.token;
    }

    if (!request.token) {
      return response
        .status(403)
        .send("A token is required for authentication");
    }
  }

  next();
};

module.exports = {
  errorHandler,
  tokenExtractor,
};
