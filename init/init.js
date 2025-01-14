const data = require("./data")
const mongoose = require("mongoose");
const Listing = require("../models/listing");

mongoose
  .connect("mongodb://127.0.0.1:27017/wandernest")
  .then(() => console.log("MongoDb is connected"))
  .catch((e) => console.log("Error in Mongodb", e));

  const init = async()=>{
   await Listing.deleteMany({});
   const allData = await Listing.insertMany(data)
   console.log(allData);
  }

  init()