const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
} = require("../controllers/clothingitems");
const { likeItem, dislikeItem } = require("../controllers/likes");

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);

router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
