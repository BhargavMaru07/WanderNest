const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate")
const path = require("path");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname,"/public")))
app.engine("ejs",ejsMate)

mongoose
  .connect("mongodb://127.0.0.1:27017/wandernest")
  .then(() => console.log("MongoDb is connected"))
  .catch((e) => console.log("Error in Mongodb", e));

app.get("/", (req, res) => {
  res.send("Hello, This is root");
});

//all listings
app.get("/listings", async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

//new route
//always keep this route above the show route/("/listings/:id") bcs if write below show route then it is conserder "new" as a path parameter so it's not wroking
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

//show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let individualListings = await Listing.findById(id);
  res.render("listings/show", { individualListings });
});

//post route for new listings
// "req.body.listing" using this we directly get the object of all detail and we put in Listing()
app.post("/listings", async (req, res) => {
  let newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

//Edit route
app.get("/listings/edit/:id", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
});

//update route
app.put("/listings/update/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

//Delete route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});
app.listen(PORT, () => console.log(`App is listening on port : ${PORT}`));
