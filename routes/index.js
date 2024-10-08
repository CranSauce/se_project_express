const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");
const auth = require("../middlewares/auth");

router.use("/users", auth, userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Route not found" });
});

module.exports = router;
