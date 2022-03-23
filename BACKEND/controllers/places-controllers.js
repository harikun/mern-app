const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");]
const Place = require("../models/place");

const { v4: uuidv4 } = require("uuid");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001, USA",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Emp. State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001, USA",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u2",
  },
];

const getPlaceById =  async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {

    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError("Something went wrong, could not find a place.", 500));
  }

  if (!place || place.length === 0) {
    throw new HttpError("Could not find  places for the provided id.", 404);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

// function getPlaceById() {...}
// const getPlaceById = () => {...}

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places
  try {

     places =  await Place.find({ creator: userId });
  } catch (error) {
    return next(new HttpError("Fetching places failed, please try again.", 500));
  }
  if (!places) {
    throw new HttpError(
      "Could not find a place for the provided user id.",
      404
    );
  }
  res.json({ places: places.map((p) => p.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    next(new HttpError("Invalid inputs passed, please check your data.", 422));
  }

  const { title, description, address, creator } = req.body;
  let coordinates;
  try {
    coordinates = getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    id: uuidv4(),
    title,
    description,
    imageUrl: 'https:upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
    address,
    // location: coordinates,
    creator,
  });
  try {

    await createdPlace.save();
  }catch(error){
    console.log(error);
    return next(new HttpError("Creating place failed, please try again.", 500));
  }
  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;


  updatedPlace.title = title;
  updatedPlace.description = description;



  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    throw new HttpError("Could not find a place for the provided id.", 404);
  }

  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
