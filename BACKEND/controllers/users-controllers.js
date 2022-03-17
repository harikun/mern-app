const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

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

const signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const { name, email, password } = req.body;
  const existingUser = DUMMY_USERS.find((u) => u.email === email);
  if (existingUser) {
    throw new HttpError("Could not create user. Email already exists.", 422);
  }
  const user = {
    id: uuidv4(),
    name,
    email,
    password,
  };
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
