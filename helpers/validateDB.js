const User = require('../models/user');

/**
 * Metodo para validar si el email ya existe en la base de datos
 * @param {*} email 
 */
const emailAlreadyExists = async (email) => {

    console.log(email);

    const user = await User.findOne({ email: email });

    if (user) {
        throw new Error('Email already exists');
    }

}

module.exports = {
    emailAlreadyExists,
}