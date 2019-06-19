const ApplicationError = require('./ApplicationError');

class ForbiddenAccessError extends ApplicationError {
  constructor(message = 'Forbidden Access', status = 403) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
  }
}

module.exports = ForbiddenAccessError;
