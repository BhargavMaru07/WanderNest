const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("", null),
  }).required(),
});

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});


const bookingSchema = Joi.object({
  booking: Joi.object({
    listingId: Joi.string().required(),

    checkIn: Joi.date()
      .iso()
      .required()
      .custom((value, helpers) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (value < today) {
          return helpers.message(
            "Check-in date must be today or in the future."
          );
        }
        return value;
      }),

    checkOut: Joi.date()
      .iso()
      .required()
      .custom((value, helpers) => {
        const checkIn = new Date(
          helpers?.state?.ancestors?.[0]?.booking?.checkIn
        );
        const checkOut = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkOut < today) {
          return helpers.message(
            "Check-out date must be today or in the future."
          );
        }

        if (checkIn && checkOut <= checkIn) {
          return helpers.message("Check-out date must be after check-in date.");
        }

        const diffInDays = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
        if (diffInDays > 30) {
          return helpers.message("Stay cannot be longer than 30 days.");
        }

        return value;
      }),

    guests: Joi.number().required().min(1).max(10).messages({
      "number.max": "Guest limit is 10.",
      "number.min": "At least 1 guest is required.",
    }),
  }).required(),
});

module.exports = { listingSchema, reviewSchema, bookingSchema };
