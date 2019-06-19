const _ = require('lodash');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GitHubStrategy = require('passport-github').Strategy;

const social = require('@config/social');
const User = require('@app/models').User;
const UserService = require('@app/services/UserService');
const SocialLoginError = require('@app/errors/SocialLoginError');

const userService = new UserService();

/**
 * passport strategies dict
 *
 * @type {Object}
 */
const socialStrategies = {
  google: GoogleStrategy,
  github: GitHubStrategy,
};

/**
 * configure social login for passport
 *
 * @return {[type]} [description]
 */
const configureSocial = () => {
  Object.keys(socialStrategies).forEach(key => {
    const strategy = socialStrategies[key];

    passport.use(
      new strategy(social[key], async (accessToken, refreshToken, profile, done) => {
        const user = await getSocialUser(key, profile);

        done(null, user);
      })
    );
  });
};

/**
 * configures passport
 * and social logins
 *
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
const configure = app => {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    const user = await User.findByPk(id);

    return done(null, user);
  });

  app.use(passport.initialize());
  app.use(passport.session());

  // configureSocial();
};

/**
 * get social user
 *
 * @param {*} key
 */
const getSocialUser = async (key, profile) => {
  if (doesEmailExist(profile) === false) throw SocialLoginError;

  const defaults = transformSocialUser(key, profile);
  const user = await userService.findOrCreateByEmail(profile._json.email, defaults);

  return user;
};

/**
 * does email exist in profile
 *
 * @param {*} profile
 */
const doesEmailExist = profile => {
  return profile._json.email ? true : false;
};

/**
 * transform social user
 *
 * @param {*} key
 * @param {*} profile
 */
const transformSocialUser = (key, profile) => {
  if (key === 'google') {
    return {
      first_name: profile._json.given_name,
      last_name: profile._json.family_name,
      email: profile._json.email,
    };
  }

  if (key === 'github') {
    return {
      first_name: profile._json.name,
      last_name: '',
      email: profile._json.email,
    };
  }
};

module.exports = {
  configure,
};
