const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
mongoose
  .connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conection OPEN in MONGO!");
  })
  .catch((err) => {
    console.log("OH NO ERROR in MONGO!!!");
    console.log(err);
  });

function getSample(array) {
  return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const randomCity = getSample(cities);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "62334d9c753f54b13deaa037",
      location: `${randomCity.city}, ${randomCity.state}`,
      title: `${getSample(descriptors)} ${getSample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [randomCity.longitude, randomCity.latitude],
      },
      images: [
        {
          url: "https://res.cloudinary.com/df74sm4un/image/upload/v1648051933/yelpCamp/lwxlx2owzo3ujtkl9kcn.avif",
          filename: "yelpCamp/lwxlx2owzo3ujtkl9kcn",
        },
        {
          url: "https://res.cloudinary.com/df74sm4un/image/upload/v1648051933/yelpCamp/pwr1tzkxl4x5bjky6mh6.avif",
          filename: "yelpCamp/pwr1tzkxl4x5bjky6mh6",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quod eum error laborum mollitia exercitationem non ullam earum. Blanditiis aperiam, deserunt quibusdam iste cupiditate natus temporibus dolores aut similique dignissimos.",
      price,
    });

    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
