const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { BadRequestError, NotFoundError, ConflictError, UnauthorizedError } = require("../utils/errors/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    throw new BadRequestError("Name, avatar, email, and password are required.");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      name: newUser.name,
      avatar: newUser.avatar,
      email: newUser.email,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new BadRequestError("Invalid user data"));
    }
    if (err.code === 11000) {
      next(new ConflictError("Email already exists"));
    }
   return next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required.");
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
      next(new UnauthorizedError("Invalid email or password."));
    }
    return next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return res.status(200).json(user);
  } catch (err) {
   return next(err);
  }
};

const updateUser = async (req, res, next) => {
  const { name, avatar } = req.body;

  if (!name || !avatar) {
    throw new BadRequestError("Name and avatar are required.");
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }

    return res.status(200).json(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new BadRequestError("Invalid user data"));
    }
    return next(err);
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
