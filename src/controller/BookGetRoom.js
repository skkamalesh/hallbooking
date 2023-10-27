const Rooms = require("./CreateRoom")
const moment = require('moment');

const BookedList = []


const bookRoom = (req, res) => {
    const { CustomerName, Date, StartTime, EndTime, RoomID } = req.body;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$/;

    const isRoomAlreadyBooked = BookedList.some((booking) => {
        return (
            booking.RoomID === RoomID &&
            booking.Date === Date &&
            moment(booking.StartTime, 'h:mm A').isBefore(moment(EndTime, 'h:mm A')) &&
            moment(booking.EndTime, 'h:mm A').isAfter(moment(StartTime, 'h:mm A'))
        )
    })

    if (CustomerName && Date && StartTime && EndTime && RoomID && Object.keys(req.body).length === 5) {
        if (!Date.match(dateRegex)) {
            res.send({ message: "Enter date in the format of yyyy-mm-dd" })
            return
        }
        if (!(StartTime.match(timeRegex) && EndTime.match(timeRegex))) {
            res.send({ message: "Enter the StartTime and Endtime in the format of (hh:mm AM/PM)" })
            return
        }
        if (moment(EndTime, 'h:mm A').isBefore(moment(StartTime, 'h:mm A'))) {
            res.send({ message: "The Endtime should be grater than start time" })
            return
        }
        if (!isRoomAlreadyBooked) {
            const BookingData = {
                bookingId: generateUniqueBookingID(),
                CustomerName: CustomerName,
                Date: Date,
                StartTime: StartTime,
                EndTime: EndTime,
                RoomID: RoomID
            }
            const isRoomCreated = Rooms.Rooms.some((room) => room.id === RoomID)
            if (isRoomCreated) {
                BookedList.push(BookingData);
                res.status(201).send({ message: "Booked successfully" });
            } else {
                res.status(400).send({ message: "There is no room in the specified ID" });
            }
        } else {
            res.status(400).send({ message: "Hall is already booked for the same date and time period." });
        }
    }
    else {
        res.status(400).send({ message: "Invalid request body. Please provide a JSON object with keys as  CustomerName, Date, StartTime, EndTime, RoomID" });
    }
    function generateUniqueBookingID() {
        return `B${BookedList.length + 1}`
    }
}


const AllRoomsWithBookingData = (req, res) => {
    const roomsWithStatus = BookedList.map((booking) => {
        const room = Rooms.Rooms.find((room) => booking.RoomID === room.id);

        const currentTime = new Date();
        const bookingTime = new Date(booking.Date + ' ' + moment(booking.EndTime, 'hh:mm A').format('HH:mm'));

        let bookingStatus;

        if (bookingTime < currentTime) {
            bookingStatus = "Expired";
        } else {
            bookingStatus = "Booked";
        }
        return {
            RoomName: room.RoomName,
            BookedStatus: bookingStatus,
            CustomerName: booking.CustomerName,
            Date: booking.Date,
            StartTime: booking.StartTime,
            EndTime: booking.EndTime,
        };

    });

    res.status(200).send({
        message: "List of all rooms with booking Status",
        Count: roomsWithStatus.length,
        AllRoomsWithBookedData: roomsWithStatus.sort((a, b) => {
            const room1 = a.RoomName.toUpperCase();
            const room2 = b.RoomName.toUpperCase();
            if (room1 < room2) {
              return -1;
            } else if (room1 > room2) {
              return 1;
            } else {
              return 0;
            }
          })
    });
}

const AllCustomersWithBookingData = (req, res) => {
    const customerBookedData = BookedList.map((booking) => {
        const roombooked = Rooms.Rooms.find((roombooked) => roombooked.id === booking.RoomID)
        return {
            CustomerName: booking.CustomerName,
            RoomName: roombooked.RoomName,
            Date: booking.Date,
            StartTime: booking.StartTime,
            EndTime: booking.EndTime
        }
    })

    res.status(200).send({
        message: "List of all customers with their booking status",
        Count: customerBookedData.length,
        AllCustomersWithBookedData: customerBookedData
    })
}


const SameCustomerBookedCount = (req, res) => {
    const customerReq = req.params.customerName;
    const specificCustomer = BookedList.filter((eachCustomer) => eachCustomer.CustomerName === customerReq);
    const EachCustomerData = specificCustomer.map((e) => {
        const roombooked = Rooms.Rooms.find((roombooked) => roombooked.id === e.RoomID);

        function formattedBookingDate() {
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return `${year}-${month}-${day}`;
        }

        const currentTime = new Date();
        const bookingTime = new Date(e.Date + ' ' + moment(e.EndTime, 'hh:mm A').format('HH:mm'));


        let bookingStatus;

        if (bookingTime < currentTime) {
            bookingStatus = "Expired";
        } else {
            bookingStatus = "Booked";
        }

        return {
            CustomerName: e.CustomerName,
            RoomName: roombooked.RoomName,
            Date: e.Date,
            StartTime: e.StartTime,
            EndTime: e.EndTime,
            BookingID: e.bookingId,
            BookingDate: formattedBookingDate(),
            BookingStatus: bookingStatus
        };

    });
    res.send({
        message: `${customerReq} booked rooms, ${specificCustomer.length} times and the data is listed below`,
        SpecificCustomerData: EachCustomerData
    });
}


module.exports = {
    bookRoom,
    AllRoomsWithBookingData,
    AllCustomersWithBookingData,
    SameCustomerBookedCount
}