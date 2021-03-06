const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user')
const moment = require('moment');
const jwt = require('jsonwebtoken');




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
          const createdToken = createToken(result.id, result.role);
          await User.updateToken(result.id, createdToken);
          res.json({
            success: "Login done!",
            token: createdToken
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
    res.json({
      err: err.message
    })
  };
});


//Loggin with spotify new user



//JWT// Creacion del token para el usuario

function createToken(pUserID, pRoleUser) {
  const payload = {
    userID: pUserID,
    createDATE: moment().unix(),
    expireDATE: moment().add(15, 'minutes').unix(),
    role: pRoleUser
  }
  return jwt.sign(payload, process.env.SECRET_KEY)
};

//Subir imagen de perfil

router.post('/updatePhoto', async (req, res) => {
  try {
    const result = await User.updatePhoto(req.body.id, req.body.url);
    if (result['affectedRows'] === 1) {
      res.json({
        success: 'Foto agregada'
      })
    } else {
      res.json({
        error: 'No agregada'
      })
    }
  } catch (err) {
    res.json({
      error: err
    })
  }
});

router.get('/getUser/:idUser', async (req, res) => {
  try {
    const result = await User.getUser(req.params.idUser);
    res.json(result[0]);
  } catch (err) {
    res.json({
      error: err
    })
  }
});

router.post('/updateUser/:idUser', async (req, res) => {
  try {
    const result = await User.updateUser(req.body, req.params.idUser);
    if (result['affectedRows'] === 1) {
      res.json({
        success: 'Información agregada'
      })
    } else {
      res.json({
        error: 'No agregada'
      })
    }
  } catch (err) {
    res.json({
      error: err.message
    })
  }
})
module.exports = router;