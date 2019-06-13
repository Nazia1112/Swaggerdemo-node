var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');
var expressValidator = require('express-validator');
var mongoose = require('mongoose');
const config = require('./config/config');
var passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
var swaggerJSDoc = require('swagger-jsdoc');  //SWAGGER USE
const swaggerUi = require('swagger-ui-express');  //SWAGGER USE
var auth = require('basic-auth')  //SWAGGER USE

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var providerRouter = require('./routes/provider-users');

  //SWAGGER USE
function checkRouteAuth(req,res, next){
  var credentials = auth(req)
  // Check credentials
  // The "check" function will typically be against your user store
  if (!credentials || !checkCredentials(credentials.name, credentials.pass)) {
      res.statusCode = 401
      res.setHeader('WWW-Authenticate', 'Basic realm="example"')
      res.end('Access denied')
  } else {
      next()
  }
}
  //SWAGGER USE
// Basic function to validate credentials for example
function checkCredentials (name, pass) {
  var valid = true
  if(name == 'vpass' && pass=='7x#wGz'){
    valid = true
  }else{
    valid = false
  }
  return valid
}

mongoose.connect(config.Mongourl, {
  useNewUrlParser: true
}).then((db) => {
  console.log("connected to db " + db);
},
  err => console.log(err));

var app = express();
app.use(cors());

  //SWAGGER USE
// swagger definition
var swaggerDefinition = {
  info: {
    title: 'Node Swagger API',
    version: '1.0.0',
    description: 'Demonstrating how to describe a RESTful API with Swagger',
  },
  host: 'localhost:3000',
  basePath: '/'
};

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./routes/*.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(flash());
app.use(passport.initialize());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/provider',providerRouter);

  //SWAGGER USE
app.use('/documentation', checkRouteAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// serve swagger
// app.get('/swagger.json', function(req, res) {
//   res.setHeader('Content-Type', 'application/json');
//   res.send(swaggerSpec);
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
