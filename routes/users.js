const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user')
const moment = require('moment');
const jwt = require('jsonwebtoken');
const spotifyToken = require('../models/spotify.acces');


/* GET users listing. */
router.post('/register', async (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password, 10);

  const result = await User.createUser(req.body);

  if (result['affectedRows'] === 1) {
    res.json({
      success: 'Usuario registrado'
    })
  } else {
    res.json({
      error: 'Campos incorrectos'
    })
  }
});

// POST User login // http://localhost:3000/users/login
router.post('/login', async (req, res) => {

  try {
    if (!req.headers['user_token']) {
      const result = await User.getByEmail(req.body.email);
      if (result) {
        const verifyPass = bcrypt.compareSync(req.body.password, result.password);
        if (verifyPass) {
          console.log(result);
          res.json({
            success: "Login done!",
            token: createToken(result.id)
          });
        } else {
          res.json({
            error: 'The user is not register or pass-email is not correct2'
          });
        }
      } else {
        console.log(result);

        res.json({
          error: 'The user is not register or pass/email is not correct1'
        })
      }
    } else {
      res.send(true);
    }
  } catch (err) {
    res.json({ err: err.message })
  };
});

// Spotify Requests
router.get('/login/spotify', (req, res) => {
  const scopes = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + my_client_id +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(redirect_uri));
});



//JWT// Creacion del token para el usuario

function createToken(pUserID) {
  const payload = {
    userID: pUserID,
    createDATE: moment().unix(),
    expireDATE: moment().add(15, 'minutes').unix()
  }
  return jwt.sign(payload, process.env.SECRET_KEY)
}
module.exports = router;

