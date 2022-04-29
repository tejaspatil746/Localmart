const express = require('express');
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteUser } = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

// register --- admin, seller, user
router.route("/register").post(registerUser);

// login --- admin, seller, user
router.route("/login").post(loginUser);

// forget password --- admin, seller, user
router.route("/password/forgot").post(forgotPassword);

// reset Password --- admin, seller, user
router.route("/password/reset/:token").put(resetPassword);

// logout --- admin, seller, user
router.route("/logout").get(logout);

// get user details --- admin, seller, user
router.route("/me").get(isAuthenticatedUser, getUserDetails);

// update or edit Password --- admin, seller, user
router.route("/password/update").put(isAuthenticatedUser, updatePassword);

// update or edit profile --- admin, seller, user
router.route("/me/update").put(isAuthenticatedUser, updateProfile);

// get all users --- admin, seller
router.route("/unique/users").get(isAuthenticatedUser, authorizeRoles("admin", "seller"), getAllUser)

// update user roles and delete user --- admin
router.route("/unique/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
.put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
.delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);


module.exports = router;
