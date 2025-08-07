const { PrismaClient } = require("../generated/prisma");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
    if (process.env.NODE_ENV !== "development") return;
    console.log("Running seed script");

    // Clean up previous entries before seeding
    await prisma.product.deleteMany();

    for (let i = 0; i < 20; i++) {
        await prisma.product.create({
            data: {
                name: faker.commerce.productName(),
                brand: faker.company.name(),
                price: Number(faker.commerce.price({ min: 5, max: 100 })),
                stock: faker.number.int(200),
            }
        })
    }
}

main()
    .catch((err) => {
        console.log(err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log("Seed script ran successfully");
    })