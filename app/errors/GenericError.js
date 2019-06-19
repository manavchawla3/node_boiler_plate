const ApplicationError = require('./ApplicationError');

class GenericError extends ApplicationError {
  constructor(message = 'Something went wrong. Please again later', status = 400) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
  }
}

module.exports = GenericError;
