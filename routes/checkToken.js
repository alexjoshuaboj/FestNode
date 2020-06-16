const router = require('express').Router();
const User = require('../models/user');


router.get('/:token', async (req, res) => {

    const resultQuery = await User.checkValidatorToken();
    const tokens = JSON.parse(JSON.stringify(resultQuery));
    const pruebatokens = [];
    tokens.map(object => {
        pruebatokens.push(object['token']);
    });
    console.log(pruebatokens.includes(req.params.token));
    if (pruebatokens.includes(req.params.token)) {
        res.send(true);
    } else {
        res.send(false);
    }
})

module.exports = router;