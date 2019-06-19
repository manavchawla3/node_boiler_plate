const asyncHandler = require('express-async-handler')

const UnauthorizedError = require('@app/errors/UnauthorizedError');

module.exports = asyncHandler((req, res, next) => {
  const {
    user
  } = req;

  if (!user) {
    throw new UnauthorizedError;
  }

  next();
});
