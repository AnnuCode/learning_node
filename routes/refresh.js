const express = require('express')
const router = express.Router()
const refreshTokenHandler = require('../controllers/refreshController')

router.get('/', refreshTokenHandler.handleRefreshToken)

module.exports = router