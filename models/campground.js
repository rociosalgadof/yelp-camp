const mongoose = require("mongoose");
const { modelName } = require("../../mongooseAndExpress/models/product");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema ({
    title: String,
    price: String,
    description: String,
    location: String
});

module.exports= mongoose.model("Campground", CampgroundSchema);