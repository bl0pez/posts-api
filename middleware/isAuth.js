const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {

    const authHeader = req.get('Authorization');

    if(!authHeader){
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(' ')[1];

    if(!token){
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }

    try {
        
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedToken.userId;
        next();

    } catch (error) {
        error.statusCode = 500;
        throw error;
    }

}

module.exports = isAuth;