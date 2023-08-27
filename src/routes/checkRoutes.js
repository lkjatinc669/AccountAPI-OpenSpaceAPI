const express = require('express')
const router = express.Router()
const checkController = require('../controllers/checkController')

router.post('/mail', checkController.checkMail)
router.post('/userid', checkController.checkUserID)
router.post('/username', checkController.checkUserName)
router.get('/*', checkController.getError)
router.post('/*', checkController.notAllowed)

module.exports = router