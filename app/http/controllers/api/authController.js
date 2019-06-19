const { dashboardUrl } = require('@config/app');
const UserService = require('@app/services/UserService');
const ProjectService = require('@app/services/ProjectService');
const MailService = require('@app/services/public/MailService');
const UserTransformer = require('@app/transformers/UserTransformer');

const userService = new UserService();
const projectService = new ProjectService();
const mailService = new MailService();

module.exports = {
  /**
   * validate login credentials and
   * generate jwt token
   *
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  login: async (req, res, next) => {
    const user = await userService.login(req.body);

    req.login(user, () => {});

    return res.transformItem(UserTransformer, user);
  },

  /**
   * login user socially
   */
  loginSocially: async (req, res, next) => {
    res.redirect(dashboardUrl);
  },

  /**
   * validate and
   * generate jwt token
   *
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  register: async (req, res, next) => {
    const user = await userService.register(req.body);

    req.login(user, () => {});

    return res.transformItem(UserTransformer, user);
  },

  /**
   * get user from jwt token
   *
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  profile: async (req, res, next) => {
    let user = req.user;

    return res.transformItem(UserTransformer, user);
  },

  /**
   * get user from jwt token
   *
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  updateProfile: async (req, res, next) => {
    const inputs = req.body;
    const user = await userService.updateUserProfile(req.user, inputs);

    return res.transformItem(UserTransformer, user);
  },

  /**
   * sends reset password link
   */
  forgotPassword: async (req, res, next) => {
    await userService.sendResetPassordLinkEmail(req.body);

    return res.transformItem({
      message: 'Password link sent on your email',
    });
  },

  /**
   * checks reset password validity
   */
  checkResetPasswordLink: async (req, res, next) => {
    const user = await userService.checkResetPasswordLink(req.query.resetPasswordToken);

    return res.transformItem({
      email: user.email,
      message: 'Password Link OK',
    });
  },

  /**
   * reset password
   *
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  resetPassword: async (req, res, next) => {
    await userService.resetPassword(req.body);

    return res.transformItem({
      message: 'You can now login with your new password',
    });
  },

  /**
   * reset password
   *
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  updatePassword: async (req, res, next) => {
    await userService.updatePassword(req.user, req.body);

    return res.transformItem({
      message: 'Password updated successfully.',
    });
  },

  /**
   * @param  {[type]}
   * @param  {[type]}
   * @param  {Function}
   * @return {[type]}
   */
  verify: async (req, res, next) => {
    await userService.verifyEmail(req.query.verifyEmailToken);

    return res.transformItem({
      message: 'Email verified successfully',
    });
  },

  /**
   * resends verify email link to mail
   *
   * @param  {[type]}
   * @param  {[type]}
   * @param  {Function}
   * @return {[type]}
   */
  resendVerifyEmailLink: async (req, res, next) => {
    const user = req.user;

    await userService.resendVerifyEmailLink(user);

    return res.transformItem({
      message: 'Email verification link sent!',
    });
  },

  /**
   * logouts user
   *
   * @param  {[type]}
   * @param  {[type]}
   * @param  {Function}
   * @return {[type]}
   */
  logout: async (req, res, next) => {
    req.logout();

    return res.transformItem({
      message: 'Logged out successfully',
    });
  },
};
