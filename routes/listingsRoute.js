const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner,validateListing } = require("../middleware");
const listingController = require("../controller/listingController.js")


router.get(
  "/",
  wrapAsync(listingController.allListings)
);

//new route
//always keep this route above the show route/("/listings/:id") bcs if write below show route then it is conserder "new" as a path parameter so it's not wroking
router.get("/new", isLoggedIn, listingController.renderNewListingForm);

//show route
router.get(
  "/:id",
  wrapAsync(listingController.showIndividualListing)
);

//post route for new listings
// "req.body.listing" using this we directly get the object of all detail and we put in Listing()
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.newListing)
);

//Edit route
router.get(
  "/edit/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

//update route
router.put(
  "/update/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
);

//Delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
);

module.exports = router;
