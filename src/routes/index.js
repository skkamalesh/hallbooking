
const express = require("express")
const router = express.Router()

const CreateRoomRoutes = require("./CreateRoom")
const BookGetRoomRoutes = require('./BookGetRoom')

router.use('/create',CreateRoomRoutes)
router.use('/',BookGetRoomRoutes)

module.exports=router