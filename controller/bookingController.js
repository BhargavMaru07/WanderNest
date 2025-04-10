const booking = require("../models/booking");

module.exports.createBooking = async (req, res) => {
  const { listingId, checkIn, checkOut, guests } = req.body;

  const newBooking = new booking({
    user: req.user._id,
    listing: listingId,
    checkIn,
    checkOut,
    guests,
  });

  await newBooking.save();

  req.flash("success", "Your booking was successful!");
  res.redirect(`/listings/${listingId}`);
};
