const express = require('express')
const path = require('path')
const router = express.Router()

router.get('^/$|/index(.html)?', (req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'views', 'subdir', 'index.html'))
})
router.get('/test(.html)?', (req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'views', 'subdir', 'test.html'))
})

module.exports = router 

//router file prepared, now we have to provide a route in the server file. 