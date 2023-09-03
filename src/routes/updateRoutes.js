const express = require('express')
const router = express.Router()
const updateController = require('../controllers/updateController')


router.post("/username", updateController.update_username)
router.post("/profile-pic", updateController.update_profilepic)

router.get('/*', updateController.getError)
router.post('/*', updateController.notAllowed)
module.exports = router