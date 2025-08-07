const router = require("express").Router();
const controller = require("../controllers/orderController");

router.get("/", controller.getAllOrders);
router.post("/", controller.createOrder);
router.get("/:orderId", controller.getOrder);
router.put("/:orderId", controller.editOrder);

module.exports = router;