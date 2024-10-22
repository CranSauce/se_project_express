const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return next({ statusCode: BAD_REQUEST, message: "Name, avatar, email, and password are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ name: newUser.name, avatar: newUser.avatar, email: newUser.email });
  } catch (err) {
    if (err.name === "ValidationError") {
      err.statusCode = BAD_REQUEST;
      err.message = "Invalid user data";
    }
    if (err.code === 11000) {
      err.statusCode = CONFLICT;
      err.message = "Email already exists";
    }
    next(err); // Pass any error to the centralized error handler
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next({ statusCode: BAD_REQUEST, message: "Email and password are required." });
  }

  try {
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      token,
      user: { _id: user._id, name: user.name, avatar: user.avatar, email: user.email },
    });
  } catch (err) {
    if (err.name === "UnauthorizedError") {
      err.statusCode = UNAUTHORIZED;
      err.message = "Invalid email or password.";
    }
    next(err); // Pass any error to the centralized error handler
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next({ statusCode: NOT_FOUND, message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    next(err); // Pass any error to the centralized error handler
  }
};

const updateUser = async (req, res, next) => {
  const { name, avatar } = req.body;

  if (!name || !avatar) {
    return next({ statusCode: BAD_REQUEST, message: "Name and avatar are required." });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return next({ statusCode: NOT_FOUND, message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      err.statusCode = BAD_REQUEST;
      err.message = "Invalid user data";
    }
    next(err); // Pass any error to the centralized error handler
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
