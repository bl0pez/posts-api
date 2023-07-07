const { Router } = require('express');
const { body } = require('express-validator');
const { emailAlreadyExists } = require('../helpers/validateDB');
const { signup, login } = require('../controllers/userCtr');
const errorHandler = require('../middleware/errorHandler');
const router = Router();

router.post('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom(emailAlreadyExists)
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters long'),
    errorHandler
], signup)


router.post('/login',[
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters long'),
    errorHandler
],login);

module.exports = router;