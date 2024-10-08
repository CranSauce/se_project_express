const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = async function findUserByCredentials(
  email,
  password
) {
  const user = await this.findOne({ email }).select("+password");
  if (!user) {
    throw new UnauthorizedError("Incorrect email or password");
  }

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    throw new UnauthorizedError("Incorrect email or password");
  }

  return user;
};

module.exports = mongoose.model("user", userSchema);
