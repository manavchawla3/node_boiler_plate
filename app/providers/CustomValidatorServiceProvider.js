var CustomValidator = require('../validators/CustomValidator');
/**
 * self calling function to register the custom validators into the package ValidatorJS
 * @return void
 */
(function() {
  CustomValidator.init('unique', 'validateUnique', true);
  CustomValidator.init('exist', 'validateIsExist', true);
})();
