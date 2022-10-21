const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Maryam Tabatabaei",
    email: "test@test.com",
    password: "testers",
  },
];

exports.getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};
exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid input passed.Please check your data", 422);
  }
  const { name, email, password } = req.body;
  const hasUser = DUMMY_USERS.find((user) => user.email === email);
  if (hasUser) {
    throw new HttpError("This user has already been signup.", 422);
  }
  const newUser = {
    id: uuid(),
    name,
    email,
    password,
  };
  DUMMY_USERS.push(newUser);
  res.status(201).json({ user: newUser });
};
exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find((user) => user.email === email);
  if (!identifiedUser || password !== identifiedUser.password) {
    throw new HttpError(
      "Could not identify user, credentials seem to be wrong.",
      401
    );
  }
  res.status(200).json({ message: "Logged in!" });
};
