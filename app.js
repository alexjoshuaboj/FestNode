const createError = require('http-errors');
const express = require('express'),
  session = require('express-session'),
  passport = require('passport'),
  spotifyStrategy = require('./routes/index').StrategySpotify;
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

require('dotenv').config();


var app = express();
require('./db').connect();

//import user register spotify function
const spotifyRegister = require('./models/user').registerWithSpotify;
const checkTokenSpotify = require('./models/user').checkTokenSpotify;

const {
  checkToken
} = require('./routes/middlewares/token.middleware');
const usersRouter = require('./routes/users');
const festivalesRouter = require('./routes/festivales');
const checkTokenRouter = require('./routes/checkToken');
const raizRouter = require('./routes/raiz');








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

});

passport.deserializeUser((obj, done) => {
  done(null, obj);
  /*  console.log(obj); */

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
    console.log(req, res);

  }
);


app.get(
  '/callback',
  passport.authenticate('spotify', {
    failureRedirect: '/login'
  }),
  function (req, res) {
    spotifyRegister({
      name: req.user._json.id,
      email: req.user._json.email,
      password: req.query.code,
      username: req.user._json.id,
      token: req.query.code
    });
    res.redirect(`http://localhost:4200/choose-fest?code=${req.query.code}?name=${req.user._json.id}`);
    /*     res.json({
          token: req.query.code
        }) */
    sendNewUser(req.user._json.id, req.query.code);
  }
);


//middleware para enviar los datos del usuario nuevo que se ha registrado con spotify a la parte del front 

function sendNewUser(pUserName, pUserToken) {
  app.get('/sendUser', (req, res) => {
    res.send({
      username: pUserName,
      token: pUserToken
    })
  })
}

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('http://localhost:4200/login');
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