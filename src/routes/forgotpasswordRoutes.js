const express = require('express')
const router = express.Router()
const forgotpasswordController = require('../controllers/forgotpasswordController')


router.post("/forgot", forgotpasswordController.init)
router.post("/verify-otp", forgotpasswordController.verifyotp)
router.post("/update-password", forgotpasswordController.verifyotp)
// router.get('/*', forgotpasswordController.getError)
// router.post('/*', forgotpasswordController.notAllowed)

module.exports = router