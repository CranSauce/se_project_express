const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find();
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res
      .status(SERVER_ERROR)
      .json({ message: "Failed to retrieve items", error: err.message });
  }
};

const createItem = async (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  if (!name || !weather || !imageUrl) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "All fields are required." });
  }

  try {
    const newItem = new ClothingItem({ name, weather, imageUrl, owner });
    await newItem.save();
    return res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid item data" });
    }
    return res.status(SERVER_ERROR).json({ message: "Failed to create item" });
  }
};

const deleteItem = async (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.isValidObjectId(itemId)) {
    return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
  }

  try {
    const item = await ClothingItem.findById(itemId);
    if (!item) {
      return res.status(NOT_FOUND).json({ message: "Item not found" });
    }

    const userId = req.user._id;
    if (!item.owner.equals(userId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this item." });
    }

    const deletedItem = await ClothingItem.findByIdAndDelete(itemId);
    return res
      .status(200)
      .json({ message: "Item successfully deleted", item: deletedItem });
  } catch (err) {
    console.error("Error occurred during deletion:", err);
    return res.status(SERVER_ERROR).json({ message: "Failed to delete item" });
  }
};

module.exports = { getItems, createItem, deleteItem };
