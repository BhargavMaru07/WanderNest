const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const app = express();
const PORT = 3000;

mongoose
  .connect("mongodb://127.0.0.1:27017/wandernest")
  .then(() => console.log("MongoDb is connected"))
  .catch((e) => console.log("Error in Mongodb", e));

const firstListing = new Listing({
  title: "first",
  description: "hello, this is first listing",
  price: 2000,
  location: "gec bhavnagar",
  country: "india",
});

app.get("/", (req, res) => {
  res.send("Hello, This is root");
});

app.listen(PORT, () => console.log(`App is listening on port : ${PORT}`));
