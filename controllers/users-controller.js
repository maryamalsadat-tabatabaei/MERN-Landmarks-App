const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");

// const DUMMY_USERS = [
//   {
//     id: "u1",
//     name: "Maryam Tabatabaei",
//     email: "test@test.com",
//     password: "testers",
//   },
// ];

exports.getUsers = async (req, res, next) => {
  // res.json({ users: DUMMY_USERS });

  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Fetching users failed. Please try later!");
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid input passed.Please check your data", 422);
  }
  const { name, email, password } = req.body;

  // const hasUser = DUMMY_USERS.find((user) => user.email === email);
  // if (hasUser) {
  //   throw new HttpError("This user has already been signup.", 422);
  // }
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  const newUser = new User({
    name,
    email,
    image: "https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg",
    password,
    places: [],
  });

  // DUMMY_USERS.push(newUser);
  // res.status(201).json({ user: newUser });
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // const identifiedUser = DUMMY_USERS.find((user) => user.email === email);
  // if (!identifiedUser || password !== identifiedUser.password) {
  //   throw new HttpError(
  //     "Could not identify user, credentials seem to be wrong.",
  //     401
  //   );
  // }
  // res.status(200).json({ message: "Logged in!" });

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }
  res.json({ message: "Logged in!" });
};
