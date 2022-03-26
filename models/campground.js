const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
const ops = { toJSON: { virtuals: true } };

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const CampgroundSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    title: String,
    price: Number,
    images: [ImageSchema],
    description: String,
    location: String,
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  ops
);

CampgroundSchema.virtual("properties.popUpText").get(function () {
  return `
  <img src="${this.images[0].thumbnail}" alt="">
  <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
  <p>${this.description.substring(0, 20)}...</p>`;
});

CampgroundSchema.post("findOneAndDelete", async function (camp) {
  if (camp.reviews.length) {
    const res = await Review.deleteMany({ _id: { $in: camp.reviews } });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
