const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const _ = require('lodash');

const basename = path.basename(module.filename);

const { env } = require('@config/app');
const { default_limit } = require('@config/pagination');
const config = require('@config/database.js')[env];
const { computePaginationMeta } = require('@app/utils/helpers');

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

/**
 * [description]
 * @return {[type]} [description]
 */
const loadModels = () => {
  // importing models
  fs
    .readdirSync(path.join(__dirname))
    .filter((file) => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach((file) => {
      const model = sequelize['import'](path.join(__dirname,file));
      db[model.name] = model;
    });

  // calling associate methond
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }

    // adding paginate function to all models
    db[modelName].paginate = async function(req, criteria = {}) {
      const page = _.get(req, 'page', 1);
      const limit = _.get(req,'limit',default_limit);
      const offset = (page * limit) - limit;
      
      const { rows, count } = await db[modelName].findAndCountAll({
        ...criteria,
        offset,
        limit
      });

      const meta = computePaginationMeta({
        page: page,
        count,
        limit
      });

      return { rows, meta };
    }

  });
}

// const initializeModels = () => {
//   db.User = require('./user')(sequelize, Sequelize);
// }

/**
 * [description]
 * @return {[type]} [description]
 */
const connect = () => {
  loadModels();

  sequelize
    .authenticate()
    .then(() => {
      console.log('📚 Connection has been established successfully. 📘');
    })
    .catch((err) => {
      console.log('😞 Unable to connect to the database:', err);
    });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  // initializeModels();
}

connect();

module.exports = db;
