const express = require('express');
const { signUp, login } = require('../controllers/users');
const userRouter=express.Router()

userRouter.route('/signup').post(signUp)
userRouter.route('/login').post(login)

module.exports=userRouter