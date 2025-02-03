const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema");
const Listing = require("../models/listing");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//new route
//always keep this route above the show route/("/listings/:id") bcs if write below show route then it is conserder "new" as a path parameter so it's not wroking
router.get("/new", (req, res) => {
  res.render("listings/new");
});

//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let individualListings = await Listing.findById(id).populate("reviews");
    if (!individualListings){
          req.flash("error", "Listing you request for does not exists");
          res.redirect("/listings")
    } 
    res.render("listings/show", { individualListings });
  })
);

//post route for new listings
// "req.body.listing" using this we directly get the object of all detail and we put in Listing()
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    // let result = listingSchema.validate(req.body);  for joi validation...
    // console.log(result);
    console.log(req.body);
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New Listing Created!!")
    res.redirect("/listings");
  })
);

//Edit route
router.get(
  "/edit/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
      if (!listing) {
        req.flash("error", "Listing you request for does not exists");
        res.redirect("/listings")
      }
    res.render("listings/edit", { listing });
  })
);

//update route
router.put(
  "/update/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(404, "Send valid data for listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!!");
    res.redirect(`/listings/${id}`);
  })
);

//Delete route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!!");
    res.redirect("/listings");
  })
);

module.exports = router;
