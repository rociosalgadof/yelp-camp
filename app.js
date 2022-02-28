const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
mongoose
  .connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Conection OPEN in MONGO!");
  })
  .catch((err) => {
    console.log("OH NO ERROR in MONGO!!!");
    console.log(err);
  });

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "/views"));

app.listen(3000, () => {
    console.log("Listening from port 3000!");
  });

app.get("/makecampground", async(req, res)=>{
    const camp = new Campground ({title: "My Backyard", description: "Beautiful camp, all you need is right here!"})
    await camp.save();
    res.send(camp)
})