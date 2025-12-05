const express = require("express");
const app = express();

require("dotenv").config();

const userRoutes =require("./routers/users")
const orderRoutes =require("./routers/orders")
const productRoutes = require("./routers/products")

app.use(express.json());
app.use(require("cors")());

app.get("/", function(req, res) {
    res.status(200).json({status: true, message: "Welcome to claire's api"})
})

app.use("/api/auth", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
);
