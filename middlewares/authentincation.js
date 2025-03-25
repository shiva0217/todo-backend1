const jwt = require("jsonwebtoken");
const config = require("../config/staging.json"); // Ensure this is correct

const authMiddleware= (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  // console.log("Token received:", token); // Debugging line

  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    // console.log("Decoded Token:", decoded); // Debugging line
    req.user = decoded;
    next();
  } catch (err) {
    console.error("[ERROR] Authentication failed:", err.message);
    res.status(403).json({ error: "Invalid token" });
  }
};


module.exports = authMiddleware;

// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//   const token = req.header("Authorization")?.split(" ")[1]; // Extract token after "Bearer"

//   if (!token) return res.status(401).json({ error: "Access denied, no token provided" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Attach user payload
//     next();
//   } catch (err) {
//     res.status(403).json({ error: "Invalid or expired token" });
//   }
// };

// module.exports = authMiddleware;
