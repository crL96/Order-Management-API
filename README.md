# Order Management API

## Getting Started

You can either run locally or try out the API by making your requests to https://order-management-api-mj7v.onrender.com

(API is hosted using a free tier which shuts down after inactivity, give it some time to boot up)

[Go to API endpoint documentation](#api-endpoints)

#### Run locally

1. Make sure you have Node.js installed on your system: https://nodejs.org/en

2. Clone the repository

3. Navigate to the directory: 
```terminal
cd Order-Management-API
```

4. Run build command to install packages and init prisma client:
```terminal
npm run init-install
```

5. Setup a PostgreSQL database and add it's credentials to the .env in the next step.

6. Create a .env file in the root directory, look at the .env.sample for clarification.

7. Run init db command to sync your postgres db with prisma schema: 
```terminal
npm run init-db
```

8. Run the server:
```terminal
npm run start
```

9. If you wish to populate the database with some dummy products for dev purposes, run the following command:
```
npx prisma db seed
```

## API Endpoints
Request and response bodies are handled with JSON objects

#### Check if server is running
```terminal
GET /
Example: GET http://localhost:3000/

Expected response: "Server running"
```

#### Inventory

##### Get list of inventory
```terminal
GET /inventory
Example: GET http://localhost:3000/inventory
```

##### Add new product
```terminal
POST /inventory/product
Example: POST http://localhost:3000/inventory/product

Request body JSON:
{
    "name": "Pen",
    "brand": "Bic",
    "price": 2.5,
    "stock": 100
}
```

##### Get product data by product id
```terminal
GET /inventory/product/:productId
Example: GET http://localhost:3000/inventory/product/1234
```

##### Delete product by product id
```terminal
DELETE /inventory/product/:productId
Example: DELETE http://localhost:3000/inventory/product/1234
```

##### Edit product by product id
```terminal
PUT /inventory/product/:productId
Example: PUT http://localhost:3000/inventory/product/1234

Possible to edit one or many values, include the ones you wish to edit

Request body JSON:
{
    "name": "Pencil",
    "brand": "Generic",
    "price": 3,
    "stock": 10
}

or

{
    "price": 3
}
```

##### Search inventory
```terminal
GET /inventory/search/:searchterm
Example: GET http://localhost:3000/inventory/search/pen
```

### Orders

##### Get list of all orders
```terminal
GET /order
Example: GET http://localhost:3000/order
```

##### Create a new order
```terminal
POST /order
Example: POST http://localhost:3000/order

Request body JSON:
{
    "customerName": "John Smith",
    "customerAddress": "221B Baker Street",
    "customerEmail": "johnsmith@gmail.com",
    "products": [
        {
            "productId": "1234",
            "quantity": 2
        },
        {
           "productId": "5678",
            "quantity": 5 
        }
    ]
}
```

##### Get order by id
```terminal
GET /order/:orderId
Example: GET http://localhost:3000/order/1234
```

##### Edit a order by id
```terminal
PUT /order/:orderId
Example: PUT http://localhost:3000/order/1234

Possible to edit shipped status and/or quantity of one product.

Request body JSON:
{
    "shipped": true,
    "product": 
        {
            "id": "1234",
            "quantity": 1
        }
}

Include the id of the product you wish to edit and the updated quantity, only one product per request.

```

##### Delete order by id
```terminal
DELETE /order/:orderId
Example: DELETE http://localhost:3000/order/1234
```
