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
        console.log("in middleware: ",req.session.redirectUrl);
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
 }

 module.exports = {
    isLoggedIn,
    saveRedirectUrl
 }