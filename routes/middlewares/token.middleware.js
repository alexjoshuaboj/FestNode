const jwt = require('jsonwebtoken');
const moment = require('moment');
const User = require('../../models/user');

//Comprueba si el token que recibimos en la cabecera del usuario cumple con los filtros 

const checkToken = (req, res, next) => {
    //header// si contiene el token

    if (!req.headers['user_token']) {
        return res.json({ error: 'You need a user token' })
    }
    //comprobacion si el token es el correcto 

    const user_token = req.headers['user_token'];
    console.log(user_token);

    let payload = {};

    try {
        payload = jwt.verify(user_token, process.env.SECRET_KEY);

        console.log(payload);

    } catch (error) {
        return res.json({ error: 'Your token is a poop, you have login or register again' })
    }

    //Comprobacion si el token esta CADUCADO//Mensaje de logarse otra vez 

    const currentDate = moment().unix()
    if (currentDate > payload.expireDATE) {
        return res.json({ error: 'Token has expired!!' })
    }

    //Inclusion de los datos desencriptados dentro de la peticion

    req.payload = payload;

    next();
}

const isAdmin = async (req, res, next) => {
    const user = await User.getByID(req.payload.userID)
    if (!user || user.role !== 'ADMIN') {
        return res.json({ error: 'You are not admin, please check your credentials' })
    };
    next();
}

module.exports = {
    checkToken,
    isAdmin
}