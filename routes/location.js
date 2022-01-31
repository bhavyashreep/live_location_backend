const router = require("express").Router();
const User = require("../model/User");

router.post("/update", async (req, res) => {
    try {
        let user =  await User.findById(req.user.user_id)
        user.lat = req.body.lat;
        user.lng = req.body.lng;
        user.save()
        res.send({status:true,message:"Updated"})
      } catch (err) {
        res.status(400).send(err);
      } 
});

module.exports = router
