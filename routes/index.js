const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const authRouter = require("./auth");
const { NotFoundError } = require('../utils/errors/errors');


router.use("/", authRouter);
router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res, next) => {
  throw new NotFoundError("Route not found");
});

module.exports = router;
