const express = require('express')
const router = express.Router()
const forgotpasswordController = require('../controllers/forgotpasswordController')


router.post("/forgot", forgotpasswordController.forgot)
router.post("/verify-otp", forgotpasswordController.verify_otp)
router.post("/update-password", forgotpasswordController.forgot_password)
// router.get('/*', forgotpasswordController.getError)
// router.post('/*', forgotpasswordController.notAllowed)

module.exports = router