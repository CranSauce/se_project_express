const router = require("express").Router();
const {
  getCurrentUser,
  updateUser,
} = require("../controllers/users");
const auth = require("../middlewares/auth");
const { updateUserValidation } = require("../middlewares/validation");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUserValidation, updateUser);

module.exports = router;
