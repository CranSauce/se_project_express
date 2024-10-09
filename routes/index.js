const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const authRouter = require("./auth");
const { NOT_FOUND } = require("../utils/errors");


router.use("/signup", authRouter);
router.use("/signin", authRouter);
router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Route not found" });
});

module.exports = router;
