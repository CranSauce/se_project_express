const router = require("express").Router();
const {
  login,
  createUser,
  getCurrentUser,
  updateUser,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

router.post("/signin", login);
router.post("/signup", createUser);
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUser);

module.exports = router;
