const _ = require('lodash');

const {
  env
} = require('@app/utils/helpers');
const BaseTransformer = require('@app/transformers/BaseTransformer');
const TransformerError = require('@app/errors/TransformerError');

module.exports = {
  modify: (app) => {
    app.use((req, res, next) => {

      /**
       * success response
       *
       * @param  {[type]} transformerType [description]
       * @param  {[type]} data            [description]
       * @return {[type]}                 [description]
       */
      res.success = (data = {}, meta = null, statusCode = 200) => {

        if (_.isUndefined(data)) {
          res.status(statusCode);
          return res.send();
        }

        if (_.isError(data)) {

          // If the error doesn't have a custom .toJSON, use its stack instead
          // otherwise res.json() would turn it into an empty dictionary.
          // If this is production, don't send a response body at all
          if (!_.isFunction(data.toJSON)) {
            if (env('NODE_ENV') === 'production') {
              return res.sendStatus(statusCode);
            } else {
              res.status(statusCode);
              return res.send(data.stack);
            }
          }
        }

        // Set status code and send response data.
        res.status(statusCode);

        const response = {
          code: statusCode,
          data: data
        };

        if (meta) {
          response.meta = meta;
        }

        return res.json(response);
      }

      /**
       * error response
       *
       * @param  {[type]} transformerType [description]
       * @param  {[type]} data            [description]
       * @return {[type]}                 [description]
       */
      res.error = (data = {}, statusCode = 400) => {
        let response = {
          code: data.status,
          message: null
        }

        if (_.isObject(data)) {

          if (data.hasOwnProperty('message')) {
            response.message = data.message;
          }

          if (data.hasOwnProperty('errors')) {
            response.errors = data.errors;
          }

        }

        res.status(statusCode);
        return res.json(response);
      }

      /**
       * transform object
       *
       * @param  {[type]} transformerType [description]
       * @param  {[type]} data            [description]
       * @return {[type]}                 [description]
       */
      res.transformItem = async (transformerClassOrData, data) => {
        let body = [];

        if (typeof data !== 'undefined' && data.constructor == Array) {
          throw new TransformerError('DATA_NEEDS_TO_BE_AN_OBJECT', 500)
        }

        if (typeof transformerClassOrData === 'function') {
          const transformer = new transformerClassOrData(req, data);

          body = await transformer.computeTransform(data);

        } else {
          body = transformerClassOrData;
        }

        return res.success(body);
      };

      /**
       * transformer array of objects
       *
       * @param  {[type]} message         [description]
       * @param  {[type]} transformerType [description]
       * @param  {[type]} data            [description]
       * @return {[type]}                 [description]
       */
      res.transformItems = async (transformerClassOrData, data) => {
        let body = [];

        if (typeof data !== 'undefined' && data.constructor !== Array) {
          throw new TransformerError({
            message: 'Data needs to be an array'
          }, 500)
        }

        if (typeof transformerClassOrData === 'function') {
          for(let index = 0; index < data.length; index++) {
            const transformer = new transformerClassOrData(req, data[index]);

            const computed = await transformer.computeTransform();

            body.push(computed);
          }
        } else {
          body = transformerClassOrData;
        }

        return res.success(body);
      };

      /**
       * transform pagination
       *
       * @param  {[type]} message         [description]
       * @param  {[type]} transformerType [description]
       * @param  {[type]} data            [description]
       * @return {[type]}                 [description]
       */
      res.transformPaginate = async (transformerClassOrData, data) => {
        let body = [];

        if (typeof data !== 'undefined' && data.rows.constructor !== Array) {
          throw new TransformerError({
            message: 'Data needs to be an array'
          }, 500)
        }

        if (typeof transformerClassOrData === 'function') {
          for(let index = 0; index < data.rows.length; index++) {
            const transformer = new transformerClassOrData(req, data.rows[index]);

            const computed = await transformer.computeTransform();

            body.push(computed);
          }
        } else {
          body = transformerClassOrData;
        }

        return res.success(body, data.meta);
      };

      next();
    });
  }
}
