const mongoose = require('mongoose');
const ClothingItem = require('../models/clothingItem');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/errors');


const likeItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(itemId)) {
    return res.status(BAD_REQUEST).json({ message: 'Invalid item ID' });
  }

  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    ).orFail();

    return res.status(200).json(item);
  } catch (err) {
    console.error(err);
    if (err.name === 'DocumentNotFoundError') {
      return res.status(NOT_FOUND).json({ message: 'Item not found' });
    }
    return res.status(SERVER_ERROR).json({ message: 'Failed to like item'});
  }
};

const dislikeItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(itemId)) {
    return res.status(BAD_REQUEST).json({ message: 'Invalid item ID' });
  }

  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    ).orFail();

    return res.status(200).json(item);
  } catch (err) {
    console.error(err);
    if (err.name === 'DocumentNotFoundError') {
      return res.status(NOT_FOUND).json({ message: 'Item not found' });
    }
    return res.status(SERVER_ERROR).json({ message: 'Failed to unlike item'});
  }
};

module.exports = { likeItem, dislikeItem };
