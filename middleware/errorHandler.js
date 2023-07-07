const { validationResult } = require('express-validator');

const errorHandler = (req, res, next) => {

    //Valida si hay errores
    const errors = validationResult(req);

    //Si no hay errores, continua con el siguiente middleware
    if(!errors.isEmpty()){
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    
    next();

}

module.exports = errorHandler;