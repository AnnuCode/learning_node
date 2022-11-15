const express = require('express')
const router = express.Router()
const registerHandler = require('../controllers/registerController')

router.post('/', registerHandler.handleNewUser)  //registerHandler is an object?  and handleNewUser is a method

module.exports = router
