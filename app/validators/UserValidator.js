const Validator = require('./Validator');

class UserValidator extends Validator {

  /**
   * Validation rules.
   *
   * @param  string type
   * @param  array data
   * @return Object
   */
  getRules(type, data = {}) {
    let rules = {};

    switch (type) {
      case 'register':
        rules = {
          first_name: 'required|string|max:255',
          last_name: 'required|string|max:255',
          email: 'unique:User,email|email',
          password: 'required|min:6|max:255',
        };

        break;

      case 'login':
        rules = {
          email: 'required|email',
          password: 'required|min:6|max:255',
        };

        break;

      case 'update-profile':
        rules = {
          first_name: 'required|string|max:2555',
          last_name: 'required|string|max:2555',
        };

        break;

      case 'forgot-password':
        rules = {
          email: 'required|email|exist:User,email'
        };

        break;

       case 'reset-password':
        rules = {
          email: 'required|email|exist:User,email',
          password: 'required|min:6|max:255'
        };

        break;

       case 'update-password':
        rules = {
          password: 'required|min:6|max:255'
        };

        break;
    }

    return rules;
  }


}

module.exports = UserValidator;
