const Listing = require("../models/listing");

module.exports.allListings = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewListingForm = (req, res) => {
  res.render("listings/new");
};

module.exports.showIndividualListing = async (req, res) => {
  let { id } = req.params;
  let individualListings = await Listing.findById(id)
    .populate({
      // nested populate
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  console.log(individualListings);
  if (!individualListings) {
    req.flash("error", "Listing you request for does not exists");
    res.redirect("/listings");
  }
  res.render("listings/show", { individualListings });
};

module.exports.newListing = async (req, res) => {
  // let result = listingSchema.validate(req.body);  for joi validation...
  // console.log(result);
  console.log(req.body);
  let newListing = new Listing(req.body.listing);
  //adding owner id from req object bcs passport store user in req object.
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing Created!!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you request for does not exists");
    res.redirect("/listings");
  }
  res.render("listings/edit", { listing });
};

module.exports.updateListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(404, "Send valid data for listing");
  }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated!!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!!");
  res.redirect("/listings");
};
