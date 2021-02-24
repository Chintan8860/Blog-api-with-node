const router = require('express').Router();
const verify = require('./verifyLogin')

router.get('/post', verify, (req, res) => {
    res.send(req.user)

});

module.exports = router;