
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = {
            id: decoded.id
        };

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Session expired. Please login again."
        });
    }
}

module.exports = {authMiddleware};
