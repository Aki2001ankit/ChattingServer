const express = require("express")
const router = express.Router()
const { AccessChat, FetchChat, CreateGroupChat, RenameGroup, ChangeGroupDP, RemoveFromGroup, AddInGroup } = require("../controllers/chatcontrollers")
const { Protect } = require("../middleware/authmiddleware")

router.route('/').post(Protect, AccessChat);
router.route('/').get(Protect, FetchChat);
router.route('/creategroup').post(Protect, CreateGroupChat);
router.route('/renamegroup').put(Protect, RenameGroup)
router.route('/changegroupdp').put(Protect, ChangeGroupDP)
router.route('/removefromgroup').put(Protect, RemoveFromGroup)
router.route('/addingroup').put(Protect, AddInGroup)


module.exports = router