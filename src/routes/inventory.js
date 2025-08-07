const router = require("express").Router();
const controller = require("../controllers/inventoryController");

router.get("/all", controller.getAllProducts);
router.get("/product/:productId", controller.getProduct);

module.exports = router;