const express = require('express')
const router = express.Router()
const verifyController = require('../controllers/verifyController')

router.get('/*', verifyController.getError)

router.post("/generate", verifyController.generate)
router.post("/verifyotp", verifyController.verifyotp)

module.exports = router