const router = require('express').Router();
const User = require('../models/user');

router.get('/:token', async (req, res) => {
    console.log(req);
    const tokens = await User.checkValidatorToken();
    if (tokens.forEach(token => {
            req.params.token === token;
        })) {
        res.send(true);
    } else {
        res.send(false);
    }
})

module.exports = router;