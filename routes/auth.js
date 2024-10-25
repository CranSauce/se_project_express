const router = require("express").Router();
const { login, createUser } = require("../controllers/users");
const { createUserValidation, loginValidation } = require("../middlewares/validation");

router.post("/signup", createUserValidation, createUser);
router.post("/signin", loginValidation, login);

module.exports = router;
