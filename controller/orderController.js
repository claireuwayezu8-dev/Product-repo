const db = require("../config/db");

exports.placeOrder = async (req, res) => {
    const { items } = req.body;
    let total = 0;

    for (let item of items) {
        total += item.price * item.quantity;
    }

    const [order] = await db.query(
        "INSERT INTO orders (customer_id, total_amount) VALUES (?, ?)",
        [req.user.id, total]
    );

    for (let item of items) {
        await db.query(
            "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?,?,?,?)",
            [order.insertId, item.product_id, item.quantity, item.price]
        );
    }

    res.json({ message: "Order placed successfully" });
};

exports.getOrders = async (req, res) => {
    const [rows] = await db.query("SELECT * FROM orders WHERE customer_id = ?", [req.user.id]);
    res.json(rows);
};
