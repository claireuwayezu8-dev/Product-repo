const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async function(req, res) {

    try {

        const { name, email, password } = req.body;
        
        const hashed = await bcrypt.hash(password, 10);
        
        const user = await db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashed]
    );
    
    res.status(201).json({ status: true,  message: "User registered successfully", data: {user} });
}catch(err) {
    res.status(500).json({status: false, message: err.message ?? err})
}
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(400).json({ message: "Wrong email or password" });
  
    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong email or password" });

    const token = jwt.sign(
        { id: user.user_id, email: user.email },
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN}
    );

    res.json({ message: "Login successful", token });
};
