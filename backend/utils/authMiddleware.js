const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }
    // console.log(authHeader);  
    const token = authHeader.split(' ')[1];  
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }
    const decoded = jwt.verify(token, 'harshitvirtous');
    if (!decoded) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = { role: decoded.role, username: decoded.username }; 
    next();
};

module.exports = authMiddleware;