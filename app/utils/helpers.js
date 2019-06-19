const _ = require('lodash');
const dotenv = require('dotenv');

/*
|--------------------------------------------------------------------------
| Load ENV
|--------------------------------------------------------------------------
*/
dotenv.load();

module.exports = {
  /**
   * loads a specific key from .env
   * if not found, return the defaulValue
   */
  env: function (key, defaultValue) {
    const value = process.env[key];

    if (value) {
      return value;
    }

    return defaultValue;
  },

  /**
   * returns jwt token from req if any
   *
   * @param  {[type]} req [description]
   * @return {[type]}     [description]
   */
  getTokenFromReq: req => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }

    return null;
  },

  /**
   * set pagination data from query string of parameter
   *
   * @param  {[type]}
   */
  makePaginationDataFromRequest: req => {
    let paginateData = {};

    if (req.query.page) {
      paginateData['page'] = req.query.page;

      if (req.query.limit) {
        paginateData['limit'] = parseInt(req.query.limit);
      }
    }
    return paginateData;
  },

  /**
   * computes paginated meta
   *
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  computePaginationMeta: ({ page, limit, count }) => {
    return {
      currentPage: page,
      limit,
      total: count,
    };
  },

  /**
   * convert Date object into yyyy-dd-mm fromat
   *
   * @para {Date}
   * @return {string}
   */
  convertDateToStringFormat(date) {
    let formattedDate;

    let currentDate = date.getDate();
    let currentMonth = date.getMonth() + 1;
    let currentYear = date.getFullYear();

    if (currentDate < 10) {
      currentDate = '0' + currentDate;
    }

    if (currentMonth < 10) {
      currentMonth = '0' + currentMonth;
    }

    formattedDate = `${currentYear}-${currentMonth}-${currentDate}`;

    return formattedDate;
  },
};
