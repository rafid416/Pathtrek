require('dotenv').config();
var express = require('express');
var createError = require('http-errors');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var moment = require("moment");
var passport = require('passport');
var LocalStrtegy = require('passport-local');
var methodOverride = require('method-override');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var User = require('./routes/user')
var indexRouter = require('./routes/index');
var destinationsRouter = require('./routes/destinations');


var aboutRouter = require('./routes/about');
var adddestinationRouter = require('./routes/adddestination');
var profileRouter = require('./routes/profile');
var loginRouter = require('./routes/login');
var signupRouter = require('./routes/signup');
var destinationaddedRouter = require('./routes/destinationadded');
var logoutRouter = require('./routes/logout');
var uploadRouter = require('./routes/upload');
var filesRouter = require('./routes/files');
var imagesRouter = require('./routes/images');
var usernameupdateRouter = require('./routes/usernameupdate');
var imageupdateRouter = require('./routes/imageupdate');
var userimagesRouter = require('./routes/userimages');

mongoose.connect("mongodb+srv://pathtrek:pathtrek@mycluster-smjf2.mongodb.net/Destinations?retryWrites=true&w=majority")


var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(flash());

app.use(session({ secret: 'keyboard cat',
resave: false,
saveUninitialized: false
}))

app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrtegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});


app.use('/', indexRouter);
app.use('/destinations', destinationsRouter);
app.use('/about', aboutRouter);
app.use('/adddestination', adddestinationRouter);
app.use('/profile', profileRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/destinationadded', destinationaddedRouter);
app.use('/logout', logoutRouter);
app.use('/upload', uploadRouter);
app.use('/files', filesRouter);
app.use('/images', imagesRouter);
app.use('/usernameupdate', usernameupdateRouter);
app.use('/imageupdate', imageupdateRouter);
app.use('/userimages', userimagesRouter);


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
