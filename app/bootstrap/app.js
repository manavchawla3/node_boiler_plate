const cors = require('cors');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const morgan = require('morgan');

const config = require('@config');
const routes = require('./routes');
const errors = require('./errors');
const session = require('./session');
const passport = require('./passport');
const response = require('./response');
const providers = require('./providers');

const app = express();

/*
|--------------------------------------------------------------------------
| Load Providers
|--------------------------------------------------------------------------
*/
providers.load();

/*
|--------------------------------------------------------------------------
| Configure Session
|--------------------------------------------------------------------------
*/
session.configure(app);

/*
|--------------------------------------------------------------------------
| Configure Passport
|--------------------------------------------------------------------------
*/
passport.configure(app);

/*
|--------------------------------------------------------------------------
| Response Modifier
|
| adds functions like res.error, res.success etc
|--------------------------------------------------------------------------
|
*/
response.modify(app);

/*
|--------------------------------------------------------------------------
| basic middlewares
|--------------------------------------------------------------------------
| compression - to compress response ( gzip, deflate )
| morgan - to log http request, req ( only 4xx, 5xx)
| bodyParser - to parse request object to JSON
| cors - to enable cross origin resource sharing
*/
app.use(compression());
app.use(morgan('dev'));
app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: '50mb',
  })
);
app.use(
  bodyParser.json({
    limit: '50mb',
  })
);
app.use(cors());

/*
|--------------------------------------------------------------------------
| Setting the static folder
|--------------------------------------------------------------------------
|
| tell express to use the folder as static.
*/
app.use('/public', express.static(path.join(__dirname, '../public')));

/*
|--------------------------------------------------------------------------
| Boot Graphl server
|--------------------------------------------------------------------------
|
| /graphl
*/
// graphql.boot(app);

/*
|--------------------------------------------------------------------------
| Load Routes
|--------------------------------------------------------------------------
*/
routes.load(app);

/*
|--------------------------------------------------------------------------
| error handler
|--------------------------------------------------------------------------
|
| if a error is not catched, it will end up here.
*/
app.use(errors.handle);

/*
|--------------------------------------------------------------------------
| 404
|--------------------------------------------------------------------------
|
| express does treat 404 as error by default
*/
app.use(function (req, res, next) {
  res.error(
    {
      status: 404,
      message: 'Invalid URL',
    },
    404
  );
});

/*
|--------------------------------------------------------------------------
| request size
|--------------------------------------------------------------------------
|
| allow app to process request for longer request.
*/
app.use(
  express.json({
    limit: '50mb',
  })
);
app.use(
  express.urlencoded({
    extended: false,
    limit: '50mb',
  })
);

/*
|--------------------------------------------------------------------------
| Turn On The Lights
|--------------------------------------------------------------------------
|
| start the express server to listen on the port
*/
app.listen(config.app.port, () => console.log(`🔥 App listening on port ${config.app.port}! 🚀`));

module.exports = app;
