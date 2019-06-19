const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');

const { env } = require('@app/utils/helpers');
const { rounds } = require('@config/hashing');
const { User  } = require('@app/models');
const UserValidator = require('@app/validators/UserValidator');
const UnauthorizedError = require('@app/errors/UnauthorizedError');

const Op = Sequelize.Op;

class UserService {
  constructor() {
    this.userValidator = new UserValidator();
  }

  /**
   * logins user
   *
   * @param  {[type]} inputs [description]
   * @return {[type]}        [description]
   */
  async login(inputs) {
    await this.userValidator.validate(inputs, 'login');

    const user = await User.findOne({
      where: {
        email: inputs.email,
      },
    });

    if (!user) throw new UnauthorizedError('Invalid Credentials');

    const isPasswordOK = await bcrypt.compare(inputs.password, user.password);

    if (isPasswordOK === false) throw new UnauthorizedError('Invalid Credentials');

    return user;
  }

  /**
   * registers user
   *
   * @param  {[type]} inputs [description]
   * @return {[type]}        [description]
   */
  async register(inputs) {
    await this.userValidator.validate(inputs, 'register');

    const user = await User.create({
      first_name: inputs.first_name,
      last_name: inputs.last_name,
      email: inputs.email,
      password: await bcrypt.hash(inputs.password, rounds),
      status: 1,
      verifyEmailToken: crypto.randomBytes(20).toString('hex'),
      verifyEmailExpires: Date.now() + 60 * 60 * 1000,
    });


    return user;
  }

  /**
   * returns user by id
   *
   * @param  {[type]} userID [description]
   * @return {[type]}        [description]
   */
  async profile(req) {
    const user = await User.findOne({
      where: {
        id: req.id,
      },
    });

    return user;
  }

  /**
   * update profile
   *
   * @param  {[type]} user   [description]
   * @param  {[type]} inputs [description]
   * @return {[type]}        [description]
   */
  async updateUserProfile(user, inputs) {
    await this.userValidator.validate(inputs, 'update-profile');

    await user.update({
      first_name: inputs.first_name,
      last_name: inputs.last_name,
    });

    return user;
  }

  /**
   * validates inputs and create users
   *
   * @param  {[type]}
   * @return {[type]}
   */
  async create(inputs) {
    await this.userValidator.validate(inputs, 'create');

    const user = await User.create({
      first_name: inputs.first_name,
      last_name: inputs.last_name,
      email: inputs.email,
      password: await bcrypt.hash(inputs.password, rounds),
    });

    return user;
  }

  /**
   * returns user by id
   *
   * @param  {[type]}
   * @return {[type]}
   */
  async get(userID, throwError = true) {
    const user = await User.findOne({
      where: {
        id: userID,
      },
    });

    if (!user && throwError) throw new ModelNotFoundError();

    return user;
  }

  /**
   * updates user by id
   *
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  async update(userID, inputs) {
    const user = await User.findOne({
      where: {
        id: userID,
      },
    });

    if (!user) throw new ModelNotFoundError();

    await this.userValidator.validate(inputs, 'update', {
      except: user,
    });

    await user.update({
      first_name: inputs.first_name,
      last_name: inputs.last_name,
      email: inputs.email,
      password: await bcrypt.hash(inputs.password, rounds),
    });

    return user;
  }

  /**
   * delete user by id
   *
   * @param  {[type]}
   * @return {[type]}
   */
  async destroy(userID) {
    const user = await User.findByPk(userID);

    if (!user) throw new ModelNotFoundError();
  }

  /**
   * validates emails
   * and send reset password email
   *
   * @param {*} inputs
   */
  async sendResetPassordLinkEmail(inputs) {
    await this.userValidator.validate(inputs, 'forgot-password');

    const user = await User.findOne({
      where: {
        email: inputs.email,
      },
    });

    const token = crypto.randomBytes(20).toString('hex');

    await user.update({
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 60 * 60 * 1000,
    });

  }

  /**
   * checks if password is valid or not expired
   *
   * @param {*} token
   */
  async checkResetPasswordLink(token) {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          [Op.gt]: Date.now(),
        },
      },
    });

    // token is expired or invalid
    if (!user) throw new UnauthorizedError('Link Expired');

    return user;
  }

  /**
   * resends email link
   *
   * @param  {[type]}
   * @return {[type]}
   */
  async resendVerifyEmailLink(user) {
    const token = crypto.randomBytes(20).toString('hex');

    if (user.status === 2) {
      throw new UnauthorizedError('Account already verified');
    }

    await user.update({
      verifyEmailToken: token,
      verifyEmailExpires: Date.now() + 60 * 60 * 1000,
    });


  }

  /**
   * verifies email
   *
   * @param  {[type]}
   * @return {[type]}
   */
  async verifyEmail(token) {
    const user = await User.findOne({
      where: {
        verifyEmailToken: token,
        verifyEmailExpires: {
          [Op.gt]: Date.now(),
        },
      },
    });

    // token is expired or invalid
    if (!user) throw new UnauthorizedError('Link Expired');

    await user.update({
      verifyEmailToken: null,
      verifyEmailExpires: null,
      status: 2,
    });

    return user;
  }

  /**
   * resets password
   *
   * @param {*} inputs
   */
  async resetPassword(inputs) {
    await this.userValidator.validate(inputs, 'reset-password');

    const user = await User.findOne({
      where: {
        email: inputs.email,
        resetPasswordToken: inputs.resetPasswordToken,
      },
    });

    user.update({
      password: await bcrypt.hash(inputs.password, rounds),
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
  }

  /**
   * resets password
   *
   * @param {*} inputs
   */
  async updatePassword(user, inputs) {
    await this.userValidator.validate(inputs, 'update-password');

    user.update({
      password: await bcrypt.hash(inputs.password, rounds),
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
  }

  /**
   * find or create user by email
   *
   * @param  {[type]} email    [description]
   * @param  {[type]} defaults [description]
   * @return {[type]}          [description]
   */
  async findOrCreateByEmail(email, defaults) {
    const user = await User.findOrCreate({
      where: {
        email,
      },
      defaults: defaults,
    });

    return user[0];
  }
}

module.exports = UserService;
