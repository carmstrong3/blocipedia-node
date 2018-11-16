const express = require("express");
const router = express.Router();
const validation = require("./validation");

const userController = require("../controllers/userController");

router.get("/users/signup", userController.signUpForm);
router.post("/users/signup", validation.validateUsers, userController.create);
router.get("/users/sign_in", userController.signInForm);
router.post("/users/sign_in", validation.validateUsers, userController.signIn);
router.get("/users/sign_out", userController.signOut);
router.get("/users/upgrade", userController.checkOutView);
router.post("/users/checkout", userController.checkOut);
router.get("/users/:id", userController.show);
router.post("/users/downgrade", userController.downgrade);

module.exports = router;





