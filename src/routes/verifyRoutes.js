const express = require('express')
const router = express.Router()
const verifyController = require('../controllers/verifyController')

router.get('/*', verifyController.getError)


router.post('/', verifyController.notAllowed)

router.post("/generate", verifyController.generate)
router.post("/verify-otp", verifyController.verifyotp)
router.get('/*', verifyController.notAllowed)

module.exports = router