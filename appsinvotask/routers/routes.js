const express= require("express");
const router= new express.Router();
const controller= require("../controller/controller");
const Authmiddelware= require("../middleware/Authmidelwareforuser");

router.post("/adduser", controller.usersignupfunc); // add user
router.put("/changestatus/:id", Authmiddelware,  controller.changeuserstatus); // change user status
router.post("/signinuser", controller.signinuser); // sign IN user
router.post("/getdistance", Authmiddelware, controller.getDistance); // Get Distance
router.post("/getuserdetailsusingweeks",  controller.getuserbyweeks); // Get User By Weeks

module.exports= router;