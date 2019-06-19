const ApplicationError = require('./ApplicationError');

class TransformerError extends ApplicationError {
  constructor(message = 'Transformer Not Found', status = 400) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;

    this.message = message;
    this.status = status;
  }
}

module.exports = TransformerError;
