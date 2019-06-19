const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const randomstring = require("randomstring");

const {
  env
} = require('@config/app');
const config = require(`@config/database.js`)[env];

const SessionSecret = require('@app/utils/helpers').env('SESSION_SECRET', randomstring.generate(10));
const CookieMaxAge = require('@app/utils/helpers').env('COOKIE_MAX_AGE', 24 * 60 * 60 * 1000);

const options = {
  host: config.host,
  port: 3306,
  user: config.username,
  password: config.password,
  database: config.database,
};

/**
 * configure express session
 *
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
const configure = app => {
  app.use(
    session({
      name: 'ssid',
      secret: SessionSecret,
      store: new MySQLStore(options),
      resave: false,
      maxAge: CookieMaxAge,
      cookie: {
        domain: process.env.COOKIE_DOMAIN,
      },
      saveUninitialized: true,
    })
  );
};


module.exports = {
  configure,
};
