const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingController");
const { isLoggedIn } = require("../middleware");

router.post("/", isLoggedIn, bookingController.createBooking);

module.exports = router;
