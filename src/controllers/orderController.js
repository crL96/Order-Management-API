const prisma = require("../config/prisma");

async function getAllOrders(req, res) {
    try {
        const orders = await prisma.order.findMany({
            include: {
                customer: true,
            },
            omit: {
                customerId: true,
            }
        });
        res.json(orders);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

async function getOrder(req, res) {
    try {
        const order = await prisma.order.findUnique({
            where: {
                id: req.params.orderId,
            },
            include: {
                customer: true,
            },
            omit: {
                customerId: true,
            }
        });
        if (order === null) {
            res.status(404).send("No order found");
            return;
        }
        res.json(order);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal server error");
    }
}

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
            omit: {
                customerId: true,
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

async function editOrder(req, res) {
    try {
        // Update quantity of product
        let products = undefined;
        let orderTotal = undefined;
        if (req.body.product) {
            const order = await prisma.order.findUnique({
                where: {
                    id: req.params.orderId,
                },
            });
            for (let i = 0; i < order.products.length; i++) {
                if (order.products[i].productId === req.body.product.id) {
                    // Remove entirely if quantity is 0
                    if (req.body.product.quantity === 0) {
                        order.products.splice(i, 1);
                        break;
                    }
                    order.products[i].quantity = req.body.product.quantity;
                    order.products[i].productTotal =
                        order.products[i].quantity * order.products[i].price;
                    break;
                }
            }
            products = order.products;
            orderTotal = products.reduce((accumulator, product) => {
                return (accumulator += product.productTotal);
            }, 0);
        }

        const order = await prisma.order.update({
            where: {
                id: req.params.orderId,
            },
            data: {
                shipped: req.body.shipped,
                products: products,
                total: orderTotal,
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
    getAllOrders,
    getOrder,
    editOrder,
};
