const express = require("express");
const mongoose = require("mongoose");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const Session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash")
const ExpressError = require("./utils/ExpressError");
const listingsRoute = require("./routes/listingsRoute.js");
const reviewRoute = require("./routes/reviewRoute.js");
const userRoute = require("./routes/userRoute.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const app = express();
const PORT = 3000;

app.use(
  Session({
    secret: "Bhargav@#3",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly:true
    },
  })
);
app.use(flash());

//PASSPORT...
app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware for connect-flash
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next()
})

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


//For listings routes
app.use("/listings", listingsRoute);
// For Review routes
app.use("/listings/:id/review", reviewRoute);
//For User routes
app.use("/",userRoute)

//Root route
app.get("/", (req, res) => {
  res.send("Hello, This is root");
});

//Page not found
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

//error handling middleware..
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Server Not Working" } = err;
  res.render("Error.ejs", { statusCode, message });
});

app.listen(PORT, () => console.log(`App is listening on port : ${PORT}`));
