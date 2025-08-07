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

async function addProduct(req, res) {
    try {
        if (
            !req.body ||
            !req.body.name ||
            !req.body.brand ||
            !req.body.price ||
            !req.body.stock
        ) {
            res.status(400).send(
                "Bad request: Include name, brand, price and stock in body"
            );
            return;
        }

        const product = await prisma.product.create({
            data: {
                name: req.body.name,
                brand: req.body.brand,
                price: Number(req.body.price),
                stock: Number(req.body.stock),
            },
        });
        res.json({
            success: true,
            product: product,
        });
    } catch (err) {
        if (
            err.message.endsWith(
                "Unique constraint failed on the fields: (`name`,`brand`)"
            )
        ) {
            res.status(400).send(
                "Product name and brand combo already in use, needs to be unique"
            );
            return;
        }
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

async function editProduct(req, res) {
    try {
        const product = await prisma.product.update({
            where: {
                id: req.params.productId,
            },
            data: {
                name: req.body.name,
                brand: req.body.brand,
                price: req.body.price ? Number(req.body.price) : undefined,
                stock: req.body.stock ? Number(req.body.stock) : undefined,
            }
        })
        res.json(product);
    } catch (err) {
        if (
            err.message.endsWith(
                "Unique constraint failed on the fields: (`name`,`brand`)"
            )
        ) {
            res.status(400).send(
                "Product name and brand combo already in use, needs to be unique"
            );
            return;
        }
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

module.exports = {
    getAllProducts,
    getProduct,
    addProduct,
    editProduct,
};
