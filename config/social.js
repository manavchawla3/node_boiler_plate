const { env } = require('@app/utils/helpers');

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | google credentials for social login
  |--------------------------------------------------------------------------
  */
  google: {
    clientID: env('GOOGLE_CLIENT_ID'),
    clientSecret: env('GOOGLE_CLIENT_SECRET'),
    callbackURL: env('GOOGLE_REDIRECT_URL'),
  },

  /*
  |--------------------------------------------------------------------------
  | github credentials for social login
  |--------------------------------------------------------------------------
  */
  github: {
    clientID: env('GITHUB_CLIENT_ID'),
    clientSecret: env('GITHUB_CLIENT_SECRET'),
    callbackURL: env('GITHUB_REDIRECT_URL'),
  },
};
