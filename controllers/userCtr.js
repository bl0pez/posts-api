const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


const signup = async (req, res, next) => {
    const { email, name, password } = req.body;

    try {
        
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            email,
            password: hashedPassword,
            name
        });


        res.status(201).json({
            message: 'User created',
            user
        });

    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        
        const user = await User.findOne({ email: email });

        //Validar si el usuario existe
        if(!user){
            const error = new Error('A user with this email could not be found');
            error.statusCode = 401;
        }

        //Validar si el password es correcto
        const isEqual = await bcrypt.compare(password, user.password);

        if(!isEqual){
            const error = new Error('Wrong password');
            error.statusCode = 401;
        }

        //Generar token
        const token = jwt.sign({
            email: user.email,
            userId: user._id.toString()
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(200).json({
            token: token,
            userId: user._id.toString()
        })


    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}

module.exports = {
    signup,
    login
}