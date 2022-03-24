const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const User = require("../models/user");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Max",
    email: "test@tes.com",
    password: "test",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password,
    imageurl:
      "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200",
    places,
  });

  DUMMY_USERS.push(user);
  res.status(201).json({ user });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const user = DUMMY_USERS.find((u) => u.email === email);
  if (!user || user.password !== password) {
    throw new HttpError(
      "Could not find user with the provided credentials.",
      401
    );
  }
  res.json({ user });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
