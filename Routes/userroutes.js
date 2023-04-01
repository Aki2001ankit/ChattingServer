const express = require("express");
const router = express.Router();

const { Registeruser, LoginUser, AllUsers } = require("../controllers/usercontroller")
const { Protect } = require("../middleware/authmiddleware")

router.route('/').post(Registeruser).get(Protect, AllUsers);
router.post('/login', LoginUser);

module.exports = router