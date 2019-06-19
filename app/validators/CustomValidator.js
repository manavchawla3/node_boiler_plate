const ValidatorJS = require("validatorjs");
const _ = require('lodash');
const db = require('../models');

class CustomValidator {

  /**
   * add custom validator vlidatorjs
   *
   * @param  {[type]}  ruleName   [description]
   * @param  {[type]}  methodName [description]
   * @param  {Boolean} async      [description]
   * @return {[type]}             [description]
   */
  static init(ruleName, methodName, async = false) {
    if (async) {
      ValidatorJS.registerAsync(
        ruleName,
        CustomValidator[methodName],
        CustomValidator.messages[ruleName] || null
      );
    } else {
      ValidatorJS.register(
        ruleName,
        CustomValidator[methodName],
        CustomValidator.messages[ruleName] || null
      );
    }
  }

  /**
   * Unique Validation Rule
   *
   * @param  string value
   * @param  string attribute
   * @param  string requirement
   * @param  Object passes
   * @return void
   */
  static async validateUnique(value, requirement, attribute, passes) {
    const [model, column, ...except] = requirement.split(",");
    const modelClass = db[model];
    except.join(",");

    const key = _.isEmpty(column) ? attribute : column;
    // console.log(value);
    const doc = await modelClass.findOne({
      where: {
        [`${key}`]: value
      }
    });

    if (_.isEmpty(doc)) return passes();

    if (!_.isEmpty(except) && (doc[except[0]] == except[1])) {
      return passes();
    }

    return passes(false);
  }

  /**
   * DoesExist Validation Rule
   *
   * @param  {[type]} value       [description]
   * @param  {[type]} requirement [description]
   * @param  {[type]} attribute   [description]
   * @param  {[type]} passes      [description]
   * @return {[type]}             [description]
   */
  static validateIsExist(value, requirement, attribute, passes) {
    const [model, column] = requirement.split(",");
    const key = _.isEmpty(column) ? attribute : column;

    db[model]
      .findOne({
        where: {
          [`${key}`]: value
        }
      })
      .then(obj => {
        return _.isEmpty(obj) ? passes(false) : passes();
      })
      .catch(err => passes(false));
  }
}

CustomValidator.messages = {
  unique: "The :attribute has already been taken.",
  exist: "The :attribute does not exist.",
};

module.exports = CustomValidator;
