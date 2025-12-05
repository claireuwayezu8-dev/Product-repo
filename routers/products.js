const express = require("express");
const router = express.Router();
const {authMiddleware} = require("../middleware/auth")

const { addProduct, getProducts, searchProducts, deleteProduct, updateProduct, getProduct } = require("../controller/productController");


router.route("/").get(authMiddleware, getProducts).post(authMiddleware, addProduct);
router.route("/:id").patch(updateProduct).delete(deleteProduct).get(getProduct)

router.get("/search", authMiddleware, searchProducts);

module.exports = router;
