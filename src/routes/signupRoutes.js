const express = require('express')
const router = express.Router()
const signupController = require('../controllers/signupController')


router.post("/", signupController.main)

router.get('/*', signupController.getError)
router.post('/*', signupController.notAllowed)
module.exports = router