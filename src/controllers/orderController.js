const prisma = require("../config/prisma");

async function createOrder(req, res) {
    try {
        if (
            !req.body ||
            !req.body.customerName ||
            !req.body.customerAddress ||
            !req.body.customerEmail ||
            !req.body.products
        ) {
            res.status(400).send(
                "Bad request: Include customerName, customerAddress, customerEmail and array of objects for products with productId and quantity"
            );
            return;
        }

        // Get product data
        const productIds = req.body.products.map((item) => {
            return item.productId;
        });
        const productsInfo = await prisma.product.findMany({
            where: {
                id: {
                    in: productIds,
                },
            },
        });
        // If lengths dont match, atleast one id is invalid
        if (productIds.length !== productsInfo.length) {
            res.status(400).send(
                "Bad request: Atleast one product id is invalid"
            );
            return;
        }
        // Combine arrays and only include relevant product info
        const products = productsInfo.map((product) => {
            const quantity = req.body.products.find(
                (item) => product.id === item.productId
            ).quantity;
            if (quantity === undefined) {
                res.status(400).send("Bad request: Missing product quantity");
                return;
            }
            return {
                productId: product.id,
                name: product.name,
                brand: product.brand,
                price: product.price,
                quantity: Number(quantity),
                productTotal: product.price * Number(quantity),
            };
        });

        const orderTotal = products.reduce((accumulator, product) => {
            return (accumulator += product.productTotal);
        }, 0);

        const order = await prisma.order.create({
            data: {
                total: orderTotal,
                products: products,
                customer: {
                    create: {
                        email: req.body.customerEmail,
                        name: req.body.customerName,
                        address: req.body.customerAddress,
                    },
                },
            },
            include: {
                customer: true,
            },
        });
        res.json({
            success: true,
            order: order,
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

module.exports = {
    createOrder,
};
