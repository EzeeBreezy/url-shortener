const { Router } = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const router = Router()


// /api/auth/register
router.post(
    '/register', 
    [
        check('login', 'Incorrect login filling').isLength({min: 4}),
        check('password', 'Incorrect password filling').isLength({min: 4})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect registration credentials'
                })
            }
            const { login, password } = req.body
            const candidate = await User.findOne({ login })
            if (candidate) {
                return res.status(409).json({message: "User already exists"})
            }
            const hashedPassword = await bcrypt.hash(password, config.get('hashSalt'))
            const user = new User({ login, password: hashedPassword })
            await user.save()
            res.status(201).json({message: "User created succesfully"})
        } catch (e) {
        res.status(500).json({message: "Something went wrong"}) 
        }
})

// /api/auth/login
router.post(
    '/login',
    [
        check('login', 'Incorrect login filling').isLength({min: 4}),
        check('password', 'Incorrect password filling').isLength({min: 4})        
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect login credentials'
                })
            }
            const { login, password } = req.body
            const user = await User.findOne({ login })
            if (!user) {
                return res.status(404).json({message: "User not found"})
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(401).json({message: "User not found"})
            }
            const token = jwt.sign(
                { userId: user.id, userName: user.login },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )
            res.json({ token, userId: user.id })
        } catch (e) {
           res.status(500).json({message: "Something went wrong"}) 
        }
})


module.exports = router