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

async function getProduct(req, res) {
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: req.params.productId,
            }
        })
        if (product === null) {
            res.status(404).send("No product found");
            return;
        }
        product.stockValue = product.price * product.stock;
        res.json(product);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

module.exports = {
    getAllProducts,
    getProduct,
}