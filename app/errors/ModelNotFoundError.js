const ApplicationError = require('./ApplicationError');

class ModelNotFoundError extends ApplicationError {
  constructor(message = 'Not Found', status = 404) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
  }
}

module.exports = ModelNotFoundError;
