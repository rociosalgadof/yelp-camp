const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const ejsMate = require("ejs-mate");
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

app.engine("ejs", ejsMate);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "/views"));

app.listen(3000, () => {
    console.log("Listening from port 3000!");
  });

app.get("/campgrounds", async(req, res)=>{
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds})
})

app.get("/campgrounds/edit/:id", async(req, res)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id);
    res.render("campgrounds/edit", {camp} )
})

app.get("/campgrounds/new", async (req, res)=>{
    res.render("campgrounds/new")
})

app.get("/campgrounds/:id", async (req, res)=>{
    const {id} = req.params;
    const foundCamp = await Campground.findById(id)
    res.render("campgrounds/show", {foundCamp} )
})

app.post("/campgrounds", async (req, res)=>{
    const {title, location} = req.body;
    const camp = new Campground({title, location})
    await camp.save();
    res.redirect("/campgrounds");

})

app.patch("/campgrounds/:id", async (req, res)=>{
    const {id} = req.params;
    const newCamp = req.body;
    console.log(newCamp)
    let foundCamp = await Campground.findByIdAndUpdate(id, newCamp, {runValidators:true, new:true});
    res.redirect(`/campgrounds/${id}`);
})

app.delete("/campgrounds/:id", async (req, res)=>{
    const {id} = req.params;
    const deletedCamp = await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
})
