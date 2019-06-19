class ApplicationError extends Error {
  constructor(message = 'Somthing went wrong', status = 500) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message;
    this.code = 500;
    this.status = status;
  }
}

module.exports = ApplicationError;
