const express = require('express')
const router = express.Router()
const authHandler  = require('../controllers/login')

router.post('/', authHandler.loginHandler)

module.exports = router