const express = require("express");
const router = express.Router();
const CreateRoomController = require("../controller/CreateRoom");
router.post("/", CreateRoomController.createRoom);
module.exports = router;
