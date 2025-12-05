const jwt = require("jsonwebtoken");
const db = require("../config/db");

exports.authMiddleware = async function(req, res, next) {
  try {
    let token;
    console.log("Hello my sweet")

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ").at(-1);
    }

    if (!token) {
      return res.status(401).json({ message: "Login to get access" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded)

    const [rows] = await db.query(
      "SELECT user_id AS id, email, passwordChangedAt FROM users WHERE user_id = ? LIMIT 1",
      [decoded.id]
    );

    if (!rows.length) {
      return res.status(401).json({ message: "Your account doesn't exist. Signup again" });
    }

    const user = rows[0];

    if (user.passwordChangedAt) {
      const passwordChangedTimestamp = Math.floor(
        new Date(user.passwordChangedAt).getTime() / 1000
      );

      if (passwordChangedTimestamp > decoded.iat) {
        return res.status(401).json({
          message: "Password was changed recently. Please log in again.",
        });
      }
    }

    // Attach user
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      status: false,
      message: err.message ?? err,
    });
  }
};

exports.restrictTo = function(...allowedRoles) {
    return function(req, res, next) {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "You do not have permission to access this resource"
            });
        }

        next();
    };
};
