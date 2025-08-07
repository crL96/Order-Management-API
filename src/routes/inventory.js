const router = require("express").Router();
const controller = require("../controllers/inventoryController");

router.get("/", controller.getAllProducts);
router.get("/product/:productId", controller.getProduct);
router.put("/product/:productId", controller.editProduct);
router.delete("/product/:productId", controller.deleteProduct);
router.post("/product", controller.addProduct);
router.get("/search/:searchterm", controller.searchProduct);

module.exports = router;