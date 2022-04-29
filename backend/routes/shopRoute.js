const express =require("express");
const { getAllShops, createShop, updateShop, deleteShop,getAdminShops, getShopDetails, createShopReview, getShopReviews, deleteReview } = require("../controllers/shopController");
const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/shops").get(getAllShops);

// create new shop seller
router.route("/unique/shop/new").post(isAuthenticatedUser,authorizeRoles("seller"), createShop);

// create new shop seller
router.route("/unique/shop/:id")
.put(isAuthenticatedUser, authorizeRoles("seller"),updateShop)


router
  .route("/unique/shops")
  .get(isAuthenticatedUser, authorizeRoles("admin", "seller"), getAdminShops);

// delete shop seller/admin
router.route("/unique/shop/:id")
.delete(isAuthenticatedUser,authorizeRoles("seller", "admin"), deleteShop);

// get all shops user --- user, admin, seller
router.route("/shop/:id").get(getShopDetails);

// create reviews --- user, admin
router.route("/shop/review").put(isAuthenticatedUser,authorizeRoles("user", "admin"), createShopReview);

// delete reviews admin
router.route("/shop/reviews").get(getShopReviews).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview);


module.exports =    router

