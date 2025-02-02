const express = require("express");
const mongoose = require("mongoose");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const ExpressError = require("./utils/ExpressError");
const listingsRoute = require("./routes/listingsRoute.js")
const reviewRoute = require("./routes/reviewRoute.js")
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

  app.use("/listings", listingsRoute);
  app.use("/listings/:id/review",reviewRoute);


app.get("/", (req, res) => {
  res.send("Hello, This is root");
});


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

//error handling middleware..
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Server Not Working" } = err;
  res.render("Error.ejs", { statusCode, message });
});

app.listen(PORT, () => console.log(`App is listening on port : ${PORT}`));
