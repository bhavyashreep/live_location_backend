
const router = require("express").Router();
const User = require("../model/User");

router.get("/user/list", async (req, res) => {
    try {
        let users =  await User.find({})
        return res.send({status:true,message:"users list", data:users})
      } catch (err) {
        res.status(400).send(err);
      } 
});

module.exports = router
