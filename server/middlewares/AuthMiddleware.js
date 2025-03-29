import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        
        if(!token) {
            return res.status(401).json({
                error: "You are not authenticated"
            });
        }

        jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
            if(err) {
                return res.status(403).json({
                    error: "Token is not valid"
                });
            }
            req.userId = payload.userId;
            next();
        });
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({
            error: "Authentication error"
        });
    }
}