const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

exports.getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const userPlaces = DUMMY_PLACES.filter((u) => u.creator === userId);
  if (!userPlaces || userPlaces.length === 0) {
    throw new HttpError(
      "Could not find a place for the provided user id.",
      404
    );
  }
  res.status(200).json({ places: userPlaces });
};
exports.getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => p.id === placeId);
  if (!place) {
    throw new HttpError("Could not find a place for the provided id.", 404);
  }
  res.status(200).json({ place });
};
exports.createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    new HttpError("Invalid inputs passed, please check your data.", 422);
  }
  const { title, description, address, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }
  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    creator,
    address,
  };
  DUMMY_PLACES.push(createdPlace); //unshift(createdPlace)
  res.status(201).json({ createdPlace });
};
exports.updatePlaceById = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    new HttpError("Invalid inputs passed, please check your data.", 422);
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlaceId = DUMMY_PLACES.find((p) => p.id === placeId);
  if (!updatedPlaceId) {
    throw new HttpError("Could not find a place for the provided id.", 404);
  }
  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  updatedPlace.title = title;
  updatedPlace.description = description;
  DUMMY_PLACES[updatedPlaceId] = updatedPlace;
  res.status(200).json({ place: updatedPlace });
};
exports.deletePlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    throw new HttpError("Could not find a place for that id.", 404);
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "Deleted place." });
};
