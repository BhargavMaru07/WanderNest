const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { listingSchema } = require("./schema");
const { reviewSchema } = require("./schema");

const isLoggedIn = (req, res, next) => {
   //req.isAuthenticated() this is passport method . passport store user related info in req object. 

   //req objetc has info of from which path(path khali last je route ma hoi te ape like apde new listing add karivi hoi to add new listing par click karta last /new hoi to te ape) and originalUrl(ama akho path from /listings/new)
//    console.log(req.path,"-----",req.originalUrl);


//req.originalUrl no use apde koi pan koi route par req kare and te login nathi to aene login page apsu then login thase so te "/listing" javana badle je path pela hato direct tya j redirect thavo joiye so ane req.originalUrl ne apde session ni andar store kari lesu . but ama aek problem che k jyare pan user login thay aetle te session ne clear/update kari nakhe to apde je session ma redirectUrl set kariye te after login undefine thy jase so apde haji aek middleware banavu padse je login thy aeni pela call thy and locals variablr ni andar redirected path save kari le  after then we use this locals variable in login function to redirect at url.
   if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
     req.flash("error", "Please LogIn");
     return res.redirect("/login");
   }
   next();
 };


 const saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
 }


 const isOwner = async(req,res,next)=>{
   const {id} = req.params;
   const listing = await Listing.findById(id);
   if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","You are not Authorized");
      return res.redirect(`/listings/${id}`)
   }
   next()
 }

 const isReviewAuthor = async(req,res,next)=>{
   const { id, reviewId } = req.params;
   const review = await Review.findById(reviewId);
   if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error","You are not Author of this review");
      return res.redirect(`/listings/${id}`)
   }
   next();
 }


 const validateListing = (req, res, next) => {
   let { error } = listingSchema.validate(req.body);

   if (error) {
     let errMsg = error.details.map((e) => e.message).join(",");
     throw new ExpressError(400, errMsg);
   } else {
     next();
   }
 };



 const validateReview = (req, res, next) => {
   let { error } = reviewSchema.validate(req.body);

   if (error) {
     let errMsg = error.details.map((e) => e.message).join(",");
     throw new ExpressError(400, errMsg);
   } else {
     next();
   }
 };

 module.exports = {
   isLoggedIn,
   saveRedirectUrl,
   isOwner,
   isReviewAuthor,
   validateListing,
   validateReview,
 };