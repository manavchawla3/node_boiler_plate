const { env } = require('@app/utils/helpers');

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Application Url
  |--------------------------------------------------------------------------
  */
  url: env('APP_URL', 'http://localhost:4000'),

  /*
  |--------------------------------------------------------------------------
  | Application Port
  |--------------------------------------------------------------------------
  |
  | This value is the port of your application. This value is used to the run
  | the application the specified port.
  |
  */
  port: env('APP_PORT', 4000),

  /*
  |--------------------------------------------------------------------------
  | Application Environment
  |--------------------------------------------------------------------------
  |
  | This value determines the "environment" your application is currently
  | running in. This may determine how you prefer to configure various
  | services your application utilizes. Set this in your ".env" file.
  |
  */
  env: env('NODE_ENV', 'development'),
};
