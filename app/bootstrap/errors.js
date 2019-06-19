const { url } = require('@config/app');

const GenericError = require('@app/errors/GenericError');
const ValidationError = require('@app/errors/ValidationError');
const UnauthorizedError = require('@app/errors/UnauthorizedError');
const TokenExpiredError = require('@app/errors/TokenExpiredError');
const ModelNotFoundError = require('@app/errors/ModelNotFoundError');
const ForbiddenAccessError = require('@app/errors/ForbiddenAccessError');
const ForbiddenError = require('@app/errors/ForbiddenError');
const SocialLoginError = require('@app/errors/SocialLoginError');


const handle = (err, req, res, next) => {
  switch (err.constructor) {
    case UnauthorizedError:
      return res.error(err, 401);

    case ValidationError:
      return res.error(err, 422);

    case TokenExpiredError:
      return res.error(err, 403);

    case ForbiddenAccessError:
      return res.error(err, 403);

    case ForbiddenError:
      return res.error(err, 403);

    case ModelNotFoundError:
      return res.error(err, 404);

    case GenericError:
      return res.error(err, 400);

    case SocialLoginError:
      return res.redirect(`${url}/login?error=Email Required`);

    default:
      console.log(err);
      return res.error(err, 500);
  }
};

module.exports = {
  handle,
};
