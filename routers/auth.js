const router = require('express').Router();
const User = require('../model/User');

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


router.post('/register', async (req, res) => {

    const emailCheck = await User.findOne({ email: req.body.email })
    const errorMsg = {}
    errorMsg.error = []
    if (emailCheck) {
        errorMsg.error.push('Email alredy Exits')
    }
    const passwordCheck = req.body.password.length;
    if (passwordCheck < 6) {
        errorMsg.error.push('password length min 6 required!!!')
    }
    if (errorMsg.error.length > 0) {
        return res.send(errorMsg)
    }
    const salt = await bcrypt.genSalt(10);


    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, salt)
    });

    try {
        const savedUser = await user.save();
        res.status(201).send(savedUser);

    } catch (error) {
        errorMsg.dbError = error.message
        res.status(400).send(errorMsg)
    }

});

router.post('/login', async (req, res) => {
    if (req.body.email === null || req.body.password === null) return res.send({ error: "Email And Password Must Required!!!" })

    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.send({ error: "Email Or Password not match!!!" })

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.send({ error: "Email Or Password not match!!!" })


    const token = jwt.sign({ _id: user._id }, 'LanetDemoBlogProject')
    res.header('auth-token', token).send(token)
    // res.send(req.body)

});


module.exports = router;