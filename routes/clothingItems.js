const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  likeItem,
  dislikeItem,
  getItems,
  createItem,
  deleteItem,
} = require("../controllers/clothingitems");


router.get("/", getItems);
router.post("/", auth, createItem);
router.delete("/:itemId", deleteItem);

router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
