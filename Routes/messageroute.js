const express = require("express");
const { Protect } = require("../middleware/authmiddleware");
const { SendMessage, GetAllMessage, PostNotification, GetNotification } = require("../controllers/messaagecontrollers");
const router = express.Router();

router.route('/').post(Protect, SendMessage);
router.route('/:chatId').get(Protect, GetAllMessage);
router.route('/notification').post(Protect, PostNotification)
router.route('/notification').get(Protect, GetNotification)
module.exports = router;