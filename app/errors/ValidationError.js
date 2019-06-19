const ApplicationError = require('./ApplicationError');

class ValidationError extends ApplicationError {

  constructor(
    errors = {},
    message = 'Request contain some non-validated data.'
  ) {
    super(errors);

    this.name = this.constructor.name;
    this.message = message;
    this.code = 422;
    this.status = 422;
    this.errors = errors;
  }
}

module.exports = ValidationError;
