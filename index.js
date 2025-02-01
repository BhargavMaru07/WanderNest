const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const {listingSchema,reviewSchema} = require("./schema");
const Review = require("./models/review");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);

mongoose
  .connect("mongodb://127.0.0.1:27017/wandernest")
  .then(() => console.log("MongoDb is connected"))
  .catch((e) => console.log("Error in Mongodb", e));

app.get("/", (req, res) => {
  res.send("Hello, This is root");
});

//all listings
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((e)=>e.message).join(",")
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

const validateReview = (req,res,next)=>{
  let {error} = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
}

//new route
//always keep this route above the show route/("/listings/:id") bcs if write below show route then it is conserder "new" as a path parameter so it's not wroking
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

//show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let individualListings = await Listing.findById(id).populate("reviews");
    res.render("listings/show", { individualListings });
  })
);

//post route for new listings
// "req.body.listing" using this we directly get the object of all detail and we put in Listing()
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res) => {
    // let result = listingSchema.validate(req.body);  for joi validation...
    // console.log(result);
    console.log(req.body);
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

//review POST route
app.post(
  "/listings/:id/review",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = await Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log(listing);
    res.redirect(`/listings/${listing._id}`);
  })
);

//DELETE REVIEW:
app.delete("/listings/:id/review/:reviewId",wrapAsync(async (req,res)=>{
  let {id,reviewId} = req.params;

  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
  await Review.findByIdAndDelete(reviewId)

  res.redirect(`/listings/${id}`)
}));

//Edit route
app.get(
  "/listings/edit/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
  })
);

//update route
app.put(
  "/listings/update/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(404, "Send valid data for listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

//Delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

//error handling middleware..
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Server Not Working" } = err;
  res.render("Error.ejs", { statusCode, message });
});
app.listen(PORT, () => console.log(`App is listening on port : ${PORT}`));
