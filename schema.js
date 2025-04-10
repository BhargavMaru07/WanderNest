const Joi = require("joi")

const listingSchema = Joi.object({
    listing : Joi.object({
        title:Joi.string().required(),
        description: Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image : Joi.string().allow("",null)
    }).required()
})

const reviewSchema = Joi.object({
  review: Joi.object({
    rating:Joi.number().required().min(1).max(5),
    comment:Joi.string().required()
  }).required(),
});

const bookingSchema = Joi.object({
  booking: Joi.object({
    checkIn: Joi.date()
      .iso()
      .required()
      .custom((value, helpers) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // remove time
        if (value < today) {
          return helpers.message("Check-in date cannot be in the past.");
        }
        return value;
      }),

    checkOut: Joi.date()
      .iso()
      .required()
      .custom((value, helpers) => {
        const checkIn = helpers?.state?.ancestors?.[0]?.booking?.checkIn;
        if (checkIn && value <= checkIn) {
          return helpers.message("Check-out date must be after check-in date.");
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