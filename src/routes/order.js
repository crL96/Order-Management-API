const router = require("express").Router();
const controller = require("../controllers/orderController");

router.get("/", controller.getAllOrders);
router.post("/", controller.createOrder);

module.exports = router;