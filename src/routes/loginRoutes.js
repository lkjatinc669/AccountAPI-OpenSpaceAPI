const express = require('express')
const router = express.Router()
const loginController = require('../controllers/loginController')

router.post('/', loginController.main)
router.get('/*', loginController.getError)
router.post('/*', loginController.notAllowed)

module.exports = router