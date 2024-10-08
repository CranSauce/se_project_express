const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "Name, avatar, email, and password are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    return res.status(201).json(newUser);
  } catch (err) {
    console.error(err);

    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid user data" });
    }
    if (err.code === 11000) {
      return res.status(CONFLICT).json({ message: "Email already exists" });
    }
    return res.status(SERVER_ERROR).json({ message: "Failed to create user" });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({ token });
  } catch (err) {
    if (err.name === "UnauthorizedError") {
      return res
        .status(UNAUTHORIZED)
        .json({ message: "Invalid email or password." });
    }
    console.error(err);
    return res.status(SERVER_ERROR).json({ message: "Failed to log in." });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res
      .status(SERVER_ERROR)
      .json({ message: "Failed to retrieve user data" });
  }
};

const updateUser = async (req, res) => {
  const { name, avatar } = req.body;

  if (!name || !avatar) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "Name and avatar are required." });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid user data" });
    }

    console.error(err);
    return res.status(SERVER_ERROR).json({ message: "Failed to update user" });
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
