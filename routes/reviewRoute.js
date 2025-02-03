const express = require("express");
const Review = require("../models/review");
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const {reviewSchema } = require("../schema");
//we need to add this option {mergeParams:true} . ama perent route ma je "id" ave te review ni andar pan avse . jo aa option no hoi to to "id" undefine avse and error throw thase..
//parent route means index.js ma apde reviewRoute ne call karva mate je pela path apyo che te "/listings/:id/review"
//and child route measn aa file ma je path che te "/" for POST and "/:reviewId" FOR DELETE..
const router = express.Router({mergeParams:true});

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


//review POST route
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = await Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log(listing);
    req.flash("success", "New Review Created!!");
    res.redirect(`/listings/${listing._id}`);
  })
);

//DELETE REVIEW:
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Delete!!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;