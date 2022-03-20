const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  creator: {
    type: String,
    required: true,
  },
  // location: {
  //     // lat: {
  //     //     type: Number,
  //     //     required: true
  //     // },
  //     // lng: {
  //     //     type: Number,
  //     //     required: true
  //     // },
  //     type: {
  //         type: [Number],
  //         index: '2dsphere'
  //     }
  // },
});
