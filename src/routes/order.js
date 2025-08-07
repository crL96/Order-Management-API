const router = require("express").Router();
const controller = require("../controllers/orderController");

router.post("/", controller.createOrder);

module.exports = router;