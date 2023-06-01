const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const HttpError = require("../models/http-error");
const User = require("../models/user");
require("dotenv").config;

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.getUsers = async (req, res, next) => {
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

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Could not create user.Please try again!", 422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path, //"http://localhost:8000/" + req.file.path,
    password: hashedPassword,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
        iat: new Date().getTime(),
      },
      process.env.JWT_SALT,
      {
        expiresIn: "1h",
      }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
  res.status(201).json({
    // user: createdUser.toObject({ getters: true })
    userId: createdUser.id,
    email: createdUser.email,
    token: token,
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError("Loggin failed, please try again later.", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Could not identify user, credentials seem to be wrong.",
      403
    );
    return next(error);
  }

  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not logged you in. Please check your credentials and try again.",
      500
    );
    return next(error);
  }
  if (!isValidPassword) {
    const error = new HttpError(
      "Could not logged you in. Please check your credentials and try again.",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        iat: new Date().getTime(),
      },
      process.env.JWT_SALT,
      {
        expiresIn: "1h",
      }
    );
  } catch (err) {
    const error = new HttpError(
      "Could not logged you in. Please check your credentials and try again.",
      500
    );
    return next(error);
  }

  res.json({
    // user: existingUser.toObject({ getters: true }),
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

exports.resetPassword = async (req, res, next) => {
  const { email } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError("Loggin failed, please try again later.", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Could not identify user, credentials seem to be wrong.",
      403
    );
    return next(error);
  }

  let resetToken;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      const error = new HttpError(
        "Reset password failed, please try again later.",
        500
      );
      return next(error);
    }
    resetToken = buffer.toString("hex");
  });

  existingUser.resetToken = resetToken;
  existingUser.resetTokenExpiration = Date.now() + 3600000;

  try {
    await existingUser.save();
  } catch (err) {
    const error = new HttpError(
      "Reset password failed, please try again.",
      500
    );
    return next(error);
  }
  transporter.sendMail({
    to: email,
    from: "node@node-complete.com",
    subject: "Password reset",
    html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/user/resetPassword/${resetToken}">link</a> to set a new password.</p>
          `,
  });

  res.json({
    message: "Email for reseting password sent. Please check your email.",
  });
};

exports.getNewPassword = async (req, res, next) => {
  const token = req.params.token;

  let existingUser;
  try {
    existingUser = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
  } catch (err) {
    const error = new HttpError(
      "Reset Password failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Could not identify user, credentials seem to be wrong.",
      403
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    token,
  });
};

exports.postNewPassword = async (req, res, next) => {
  const { newPassword, passwordToken, userId } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    });
  } catch (err) {
    const error = new HttpError(
      "Reset Password failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Could not identify user, credentials seem to be wrong.",
      403
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(newPassword, 12);
  } catch (err) {
    const error = new HttpError("Could not create user.Please try again!", 422);
    return next(error);
  }

  existingUser.password = hashedPassword;
  existingUser.resetToken = undefined;
  existingUser.resetTokenExpiration = undefined;
  try {
    await existingUser.save();
  } catch (err) {
    const error = new HttpError(
      "Reset password failed, please try again.",
      500
    );
    return next(error);
  }

  res.json({
    message: "Password Successfuly changed",
  });
};

exports.logout = async (req, res, next) => {
  req.logout(); //clear the req.session.passport and req.user
  res.redirect("/login");
  console.log(`-------> User Logged out`);
};
