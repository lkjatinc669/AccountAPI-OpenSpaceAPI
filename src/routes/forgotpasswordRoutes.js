const express = require('express')
const router = express.Router()
const forgotpasswordController = require('../controllers/forgotpasswordController')

router.post('/', forgotpasswordController.main)
// router.get('/*', forgotpasswordController.getError)
// router.post('/*', forgotpasswordController.notAllowed)

module.exports = router