const router = require("express").Router();
const auth = require("../middlewares/auth");
const { createItemValidation, idValidation } = require("../middlewares/validation");
const {
  likeItem,
  dislikeItem,
  getItems,
  createItem,
  deleteItem,
} = require("../controllers/clothingitems");


router.get("/", getItems);
router.post("/", auth, createItemValidation, createItem);
router.delete("/:itemId", auth, idValidation, deleteItem);

router.put("/:itemId/likes", auth, idValidation, likeItem);
router.delete("/:itemId/likes", auth, idValidation, dislikeItem);

module.exports = router;
