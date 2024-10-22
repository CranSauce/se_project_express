const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, FORBIDDEN } = require("../utils/errors");

const getItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find();
    return res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

const createItem = async (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  try {
    const newItem = new ClothingItem({ name, weather, imageUrl, owner });
    await newItem.save();
    return res.status(201).json(newItem);
  } catch (err) {
    if (err.name === "ValidationError") {
      err.statusCode = BAD_REQUEST;
      err.message = "Invalid item data";
    }
    next(err);
  }
};

const deleteItem = async (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.isValidObjectId(itemId)) {
    return next({ statusCode: BAD_REQUEST, message: "Invalid item ID" });
  }

  try {
    const item = await ClothingItem.findById(itemId);
    if (!item) {
      return next({ statusCode: NOT_FOUND, message: "Item not found" });
    }

    const userId = req.user._id;
    if (!item.owner.equals(userId)) {
      return next({ statusCode: FORBIDDEN, message: "You are not authorized to delete this item." });
    }

    const deletedItem = await ClothingItem.findByIdAndDelete(itemId);
    return res.status(200).json({ message: "Item successfully deleted", item: deletedItem });
  } catch (err) {
    next(err);
  }
};

const likeItem = async (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(itemId)) {
    return next({ statusCode: BAD_REQUEST, message: "Invalid item ID" });
  }

  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    ).orFail();

    return res.status(200).json(item);
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      err.statusCode = NOT_FOUND;
      err.message = "Item not found";
    }
    next(err);
  }
};

const dislikeItem = async (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(itemId)) {
    return next({ statusCode: BAD_REQUEST, message: "Invalid item ID" });
  }

  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    ).orFail();

    return res.status(200).json(item);
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      err.statusCode = NOT_FOUND;
      err.message = "Item not found";
    }
    next(err); 
  }
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
