const User = require("../models/user");
const mongoose = require("mongoose");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(SERVER_ERROR).json({ message: "Failed to retrieve users", error: err.message });
  }
};

const getUser = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(BAD_REQUEST).json({ message: "Invalid user ID format" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(SERVER_ERROR).json({ message: "Failed to retrieve user", error: err.message });
  }
};

const createUser = async (req, res) => {
  const { name, avatar } = req.body;

  // Validate required fields
  if (!name || !avatar) {
    return res.status(BAD_REQUEST).json({ message: "Name and avatar are required." });
  }

  try {
    const newUser = await User.create({ name, avatar });
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);

    // Handle validation error when the schema is not met
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST).json({ message: 'Invalid user data' });
    }

    res.status(SERVER_ERROR).json({ message: "Failed to create user", error: err.message });
  }
};


module.exports = { getUsers, getUser, createUser };
