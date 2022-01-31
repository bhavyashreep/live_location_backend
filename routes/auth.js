const router = require("express").Router();
const User = require("../model/User");
const jwt = require('jsonwebtoken');






router.get("/", async (req, res) => {  
  try {
    let user =  await User.findById(req.user.user_id)    
    return res.send({status:true,message:"user data", data:user})
  } catch (err) {
    res.status(400).send(err);
  } 
});


module.exports = router
