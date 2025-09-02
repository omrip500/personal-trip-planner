const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Authentication required' });

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        res.clearCookie('token');
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}

module.exports = authenticate;
