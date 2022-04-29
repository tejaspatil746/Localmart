const express =require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, getAdminProducts} = require("../controllers/productController");
const { deleteReview } = require("../controllers/shopController");
const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// getting all products route
router.route("/products").get(getAllProducts);

// creating new product route
router.route("/unique/products/new").post(isAuthenticatedUser, authorizeRoles("seller"), createProduct);

// updating and delete product route ---- admin, seller
router.route("/unique/products/:id")
.put(isAuthenticatedUser, authorizeRoles("seller"), updateProduct)
.delete(isAuthenticatedUser, authorizeRoles("admin" , "seller"), deleteProduct)


// get products admin 
router.route("/unique/products").get(isAuthenticatedUser, authorizeRoles("admin", "seller"), getAdminProducts);


// get products details --- admin, seller, user
router.route("/products/:id").get(getProductDetails);

// create reviews --- customer, admin
router.route("/product/review").put(isAuthenticatedUser,authorizeRoles("user", "admin"), createProductReview);

// get reviews --- admin, seller, user
router.route("/product/reviews").get(getProductReviews)

// delete products admin, seller
router.route("/products/reviews").delete(isAuthenticatedUser, authorizeRoles("admin", "customer"), deleteReview);
    
module.exports = router;