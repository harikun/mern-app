const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");]
const Place = require("../models/place");
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");

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

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  // let places
  let userWithPlaces;
  try {
     userWithPlaces =  await User.findById(userId).populate("places");
  } catch (error) {
    return next(new HttpError("Fetching places failed, please try again.", 500));
  }
  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    throw new HttpError(
      "Could not find a place for the provided user id.",
      404
    );
  }
  res.json({ places: userWithPlaces.places.map((p) => p.toObject({ getters: true })) });
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
let user;
  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(new HttpError("Creating place failed, please try again.", 500));
  }

  if (!user) {
    throw new HttpError("Could not find user for provided id.", 404);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  }catch(error){
    console.log(error);
    return next(new HttpError("Creating place failed, please try again.", 500));
  }
  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await  Place.findById(placeId);
  } catch (error) {
    return next(new HttpError("Something went wrong, could not update place.", 500));
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  }
  catch(error){
    console.log(error);
    return next(new HttpError("Something went wrong, could not update place.", 500));
  }


  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (error) {
    return next(new HttpError("Something went wrong, could not delete place.", 500));
  }

  if(!place){
    const error = new HttpError("Could not find place for this id.", 404);
    return next(error);
  }


  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  }
  catch(error){
    console.log(error);
    return next(new HttpError("Something went wrong, could not delete place.", 500));
  }

  res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
