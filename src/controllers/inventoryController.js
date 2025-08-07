const prisma = require("../config/prisma");

async function getAllProducts(req, res) {
    try {
        const products = await prisma.product.findMany();
        res.json(products);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

module.exports = {
    getAllProducts,
}