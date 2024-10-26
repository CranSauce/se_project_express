const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const { BadRequestError, NotFoundError, ForbiddenError } = require("../utils/errors/errors");

const getItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find();
    return res.status(200).json(items);
  } catch (err) {
    return next(err);
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
      return next(new BadRequestError("Invalid item data"));
    }
    return next(err);
  }
};

const deleteItem = async (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.isValidObjectId(itemId)) {
    throw new BadRequestError("Invalid item ID");
  }

  try {
    const item = await ClothingItem.findById(itemId);
    if (!item) {
      throw new NotFoundError("Item not found");
    }

    const userId = req.user._id;
    if (!item.owner.equals(userId)) {
      throw new ForbiddenError("You are not authorized to delete this item.");
    }

    const deletedItem = await ClothingItem.findByIdAndDelete(itemId);
    return res.status(200).json({ message: "Item successfully deleted", item: deletedItem });
  } catch (err) {
   return next(err);
  }
};

const likeItem = async (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(itemId)) {
    throw new BadRequestError("Invalid item ID");
  }

  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    ).orFail(() => new NotFoundError("Item not found"));

    return res.status(200).json(item);
  } catch (err) {
  return next(err);
  }
};

const dislikeItem = async (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(itemId)) {
    throw new BadRequestError("Invalid item ID");
  }

  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    ).orFail(() => new NotFoundError("Item not found"));

    return res.status(200).json(item);
  } catch (err) {
    return next(err);
  }
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
