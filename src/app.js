const express = require("express");
const cors = require("cors");
const inventoryRouter = require("./routes/inventory");

const app = express();

//App Middleware
app.use(cors());
app.use(express.json());

//Routes
app.get("/", (req, res) => {
    res.send("Server running");
});
app.use("/inventory", inventoryRouter);

const port = process.env.PORT | 3000;
app.listen(port, () => {
    console.log("Server running on port: " + port);
})