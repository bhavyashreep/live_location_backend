const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");

//Import Model
const User = require("./model/User");

// Import Routes
const authRoute = require("./routes/auth");
const locationRoute = require("./routes/location");
const adminRoute = require("./routes/admin");

dotenv.config();

// connect DB
mongoose.connect(process.env.DB_CONNECT, () => console.log("db connected"));

// Routes Middleware
app.use(cors());
app.use(express.json());

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user;
    next();
  });
}

app.post("/api/user/register", async (req, res) => {
  const user = new User({
    name: req.body.name,
    mobile: req.body.mobile,
    password: req.body.password,
  });
  try {
    const savedUser = await user.save();
    console.log("saved user", savedUser);
    res.send({
      status: true,
      message: "User Registered",
      data: savedUser,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});
app.post("/api/user/login", async (req, res) => {
  console.log("api called");
  try {
    let user = await User.findOne({
      mobile: req.body.mobile,
      password: req.body.password,
    });
    if (user) {
      var token = jwt.sign(

        { user_id: user._id.toString() },
        process.env.TOKEN_SECRET
      );
      return res.send({ status: true, message: req.body.mobile, token: token });
    }

    return res.send({ status: false, message: "Invalid Mobile or Passoword" });
  } catch (err) {
    console.log("error", err);
    res.status(400).send(err);
  }
});
app.get("/api/user/",authenticateToken, async (req, res) => {
  console.log("getuser api called");
  try {
    console.log(req, req.user, req.user.user_id);
    let user = await User.findById(req.user.user_id);
    return res.send({ status: true, message: "user data", data: user });
  } catch (err) {
    res.status(400).send(err);
  }
});
app.get("api/admin/user/list", async (req, res) => {
  try {
    let users = await User.find({});
    return res.send({ status: true, message: "users list", data: users });
  } catch (err) {
    res.status(400).send(err);
  }
});
app.post("/api/update", authenticateToken,async (req, res) => {
  try {
    let user = await User.findById(req.user.user_id);
    user.lat = req.body.lat;
    user.lng = req.body.lng;
    user.save();
    res.send({ status: true, message: "Updated" });
  } catch (err) {
    res.status(400).send(err);
  }
});

// app.use('/api/user', authenticateToken, authRoute)
// app.use("/api/user/location", authenticateToken, locationRoute);

// app.use("/api/admin", adminRoute);

app.listen(process.env.PORT || 5000,()=>{
    console.log("express running")
});
