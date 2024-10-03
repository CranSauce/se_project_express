const ClothingItem = require("../models/clothingItem");
const mongoose = require("mongoose");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find();
    res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.status(SERVER_ERROR).json({ message: "Failed to retrieve items", error: err.message });
  }
};

const createItem = async (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  // Validate required fields
  if (!name || !weather || !imageUrl) {
    return res.status(BAD_REQUEST).json({ message: "All fields are required." });
  }

  try {
    const newItem = new ClothingItem({ name, weather, imageUrl, owner });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);

    // Handle validation error when the schema is not met
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST).json({ message: 'Invalid item data' });
    }

    res.status(SERVER_ERROR).json({ message: "Failed to create item", error: err.message });
  }
};


const deleteItem = async (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.isValidObjectId(itemId)) {
    return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
  }

  try {
    const deletedItem = await ClothingItem.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(NOT_FOUND).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item successfully deleted", item: deletedItem });
  } catch (err) {
    console.error("Error occurred during deletion:", err);
    res.status(SERVER_ERROR).json({ message: "Failed to delete item", error: err.message });
  }
};

module.exports = { getItems, createItem, deleteItem };
