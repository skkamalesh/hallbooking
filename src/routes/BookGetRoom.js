const express = require("express")
const router = express.Router()
const BookGetRoomController = require('../controller/BookGetRoom')

router.post('/book',BookGetRoomController.bookRoom)
router.get('/listRooms',BookGetRoomController.AllRoomsWithBookingData)
router.get('/listCustomers',BookGetRoomController.AllCustomersWithBookingData)
router.get('/eachCustomerData/:customerName',BookGetRoomController.SameCustomerBookedCount)

module.exports =  router 