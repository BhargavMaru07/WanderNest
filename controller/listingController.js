const Listing = require("../models/listing");
const geocodeAddress = require("../utils/geoLocation");

module.exports.allListings = async (req, res) => {
  let allListings = await Listing.find({});
   res.locals.page = "listings";
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
  if (!individualListings) {
    req.flash("error", "Listing you request for does not exists");
    res.redirect("/listings");
  }
  res.render("listings/show", { individualListings });
};

//post route for new listings
// "req.body.listing" using this we directly get the object of all detail and we put in Listing()
module.exports.newListing = async (req, res) => {
  // let result = listingSchema.validate(req.body);  for joi validation...
  // console.log(result);
  // console.log("new listing body",req.body);
  
  let newListing = new Listing(req.body.listing);

  //adding owner id from req object bcs passport store user in req object.
  newListing.owner = req.user._id;

  //adding coordinates in db
  let coors = await geocodeAddress(req.body.listing.location)
  newListing.coordinates = [coors.lat,coors.lon];

  // newListing.coordinates = await geocodeAddress()

  //adding url and filename in image field..
  // console.log(req.file)
  if (req.file) {
    newListing.image = { url:req.file.path, filename:req.file.filename};
  } else {
    // Use default image if no file was uploaded
    newListing.image = {
      url: "https://images.unsplash.com/photo-1735597693189-9ba81b5bbc83?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      filename: "default-image",
    };
  }
  
  let savedListing = await newListing.save();
  console.log(savedListing);
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

  // for image preview in edit form .... cloudinary feature in which we just change url after /upload add some fields for size,low pixels,blue,etc..in this we set width ...
  //this portion only work for cloudinary upload picture not for unsplash picture...
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250")
  res.render("listings/edit", { listing,originalImageUrl });
};

module.exports.updateListing = async (req, res, next) => {
  try {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listing");
    }

    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(
      id,
      { ...req.body.listing },
      { new: true }
    );

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    // Get new coordinates
    try {
      let coors = await geocodeAddress(req.body.listing.location);
      listing.coordinates = [coors.lat, coors.lon];
    } catch (error) {
      console.error("Geocoding failed:", error);
      req.flash("error", "Failed to update coordinates");
    }

    // If an image is uploaded, update it
    if (req.file) {
      listing.image = { url: req.file.path, filename: req.file.filename };
    }

    await listing.save(); // Ensure all changes are saved

    req.flash("success", "Listing Updated!!");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    next(error); // Pass error to error-handling middleware
  }
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!!");
  res.redirect("/listings");
};
