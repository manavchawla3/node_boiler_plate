const _ = require('lodash');

const TransformerError = require('@app/errors/TransformerError');
const ApplicationError = require('@app/errors/ApplicationError');

class BaseTransformer {

  constructor(req, data, availableIncludes = []) {
    this.req = req;
    this.data = data;
    this.availableIncludes = availableIncludes;
  }

  /**
   * @return {[type]}
   */
  async computeTransform() {
    const transform = this.transform();
    const includes = await this.computeIncludes();

    return {
      ...transform,
      ...includes
    };
  }

  /**
   * computes include query parameter
   *
   * @return {[type]} [description]
   */
  async computeIncludes() {
    let data = {};
    const resources = _.get(this.req, 'query.includes', '').split(',').filter(Boolean);

    for (let index = 0; index < resources.length; index++) {
      const resource = resources[index];

      if (_.indexOf(this.availableIncludes, resource) == -1) {
        continue;
      }

      const includeMethod = _.camelCase(`include ${resource}`);

      // method does not exists
      if (_.isUndefined(this[includeMethod])) {
        let errorMsg = `${includeMethod} is not defined in the ${this.constructor.name}`;

        throw new ApplicationError(errorMsg, 400);
      }

      data[_.camelCase(resource)] = await this[includeMethod].call(this, this.data, this.req);
    }

    return data;
  }

  /**
   * transformer array of objects
   *
   * @param  {[type]} message         [description]
   * @param  {[type]} transformerType [description]
   * @param  {[type]} data            [description]
   * @return {[type]}                 [description]
   */
  async transformItems(transformerClassOrData, data) {
    let transformedArray = [];

    if (typeof data !== 'undefined' && data.constructor !== Array) {
      throw new TransformerError({
        message: 'Data needs to be an array'
      }, 500)
    }

    if (typeof transformerClassOrData === 'function') {
      data.forEach(async (item) => {
        const transformer = new transformerClassOrData(null, item);

        const computed = await transformer.computeTransform();
        transformedArray.push(computed);
      });
    } else {
      transformedArray = transformerClassOrData;
    }

    return transformedArray;
  }

  /**
   * transformer array of objects
   *
   * @param  {[type]} message         [description]
   * @param  {[type]} transformerType [description]
   * @param  {[type]} data            [description]
   * @return {[type]}                 [description]
   */
  async transformItem(transformerClassOrData, data) {
    let body = [];

    if (typeof data !== 'undefined' && data.constructor == Array) {
      throw new TransformerError('DATA_NEEDS_TO_BE_AN_OBJECT', 500)
    }

    if (typeof transformerClassOrData === 'function') {
      const transformer = new transformerClassOrData(null, data);

      body = await transformer.computeTransform(data);

    } else {
      body = transformerClassOrData;
    }

    return body;
  }
}

module.exports = BaseTransformer;
