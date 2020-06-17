const router = require('express').Router();

router.get('/', async (req, res) => {
    const result = await req.body;
    console.log(result
    );

});


module.exports = router;