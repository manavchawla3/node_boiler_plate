const apiRoutes = require('@routes/api');
const publicRoutes = require('@routes/public-api')
/**
 * defines routes for application
 */
const load = (app) => {
  app.use('/api/v1/', apiRoutes);
  app.use('/public/v1/', publicRoutes);
};

module.exports = {
  load
};
