const createError = require('http-errors');
const express = require('express'),
  session = require('express-session'),
  passport = require('passport'),
  swig = require('swig'),
  spotifyStrategy = require('./routes/index').StrategySpotify,
  //Facebook require's
  FacebookStrategy = require('./routes/index').StrategyFaceBook;
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');




const {
  checkToken
} = require('./routes/middlewares/token.middleware');
const usersRouter = require('./routes/users');
const festivalesRouter = require('./routes/festivales');
const checkTokenRouter = require('./routes/checkToken');
const raizRouter = require('./routes/raiz');





require('dotenv').config();


var app = express();
require('./db').connect();


// view engine setup/configure express
app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//Passport use for spotify oauth
/**
 * Configuración de sesión de pasaporte.
Para admitir sesiones de inicio de sesión persistentes, Passport debe poder
serializar a los usuarios y deserializarlos de la sesión. Típicamente,
Esto será tan simple como almacenar el ID de usuario cuando se serializa y encontrar el usuario por ID cuando se deserializa. Sin embargo, dado que este ejemplo no tiene una base de datos de registros de usuarios, el perfil completo de Spotify se serializa y deserializa.
 */
passport.serializeUser((user, done) => {
  done(null, user);
  console.log(user);

});

passport.deserializeUser((obj, done) => {
  done(null, obj);
  console.log(obj);

});

/**
 * // Usa SpotifyStrategy en Passport.
Las estrategias en Passport requieren una función `verificar`, que acepta credenciales (en este caso, un acceso accessToken, refreshToken, expires_in y spotify profile) e invoca una devolución de llamada con un objeto de usuario
 */
passport.use(
  new spotifyStrategy({
    clientID: process.env.SPOTIFY_CLIENT,
    clientSecret: process.env.SPOTIFY_SECRET,
    callbackURL: 'http://localhost:3000/callback'
  },
    function (accessToken, refreshToken, expires_in, profile, done) {
      process.nextTick(() => {
        /**
         * asociar la cuenta de spotify con un registro de usuario en su base de datos, y devolver ese usuario en su lugar.
         */
        return done(null, profile)
      })
    }
  )
);

/**
 * Funcion verify para el uso de Passport-Facebook, creando una nueva instancia de la Strateg.js;
 * 
 */
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: "http://localhost:3000/callback"
},
  function (accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));


/**
 * middleware passport.session (), para soportar sesiones de inicio de sesión persistentes (recomendado).
 */
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', raizRouter);
app.use('/users', usersRouter);
app.use('/users/login', checkToken, usersRouter);
app.use('/fests', festivalesRouter);
app.use('/checkToken', checkToken, checkTokenRouter);

//! routes for Spotify oAuth;
app.get('/account', ensureAuthenticated, function (req, res) {
  res.json({ user: req.user });
});

app.get(
  '/auth/spotify',
  passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private'],
    showDialog: true
  }),
  function (req, res) {
    console.log(req, res)
  }
);

app.get(
  '/callback',
  passport.authenticate('spotify', {
    failureRedirect: '/login'
  }),
  function (req, res) {
    /*     res.json({
          code: req.query.code
        }); */
    res.redirect('http://localhost:4200/choose-fest');

  }
);

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('http://localhost:4200/login');
});
//!

//! routes for Facebook oAuth;
app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/login'
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:4200/choose-fest');
  });



//!
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//!middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('http://localhost:4200/choose-fest');
}

module.exports = app;