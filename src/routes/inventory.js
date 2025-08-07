const router = require("express").Router();
const controller = require("../controllers/inventoryController");

router.get("/all", controller.getAllProducts);

module.exports = router;