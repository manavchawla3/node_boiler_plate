const ApplicationError = require('./ApplicationError');

class ForbiddenError extends ApplicationError {
  constructor(message = 'Forbidden', status = 403) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
  }
}

module.exports = ForbiddenError;
