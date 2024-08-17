const { check, validationResult } = require('express-validator');
const handleRespon = require('../ultils');

const userModel = {
    validateUserData: [
        check('user_name').notEmpty().withMessage('User name is required'),
        check('full_name').notEmpty().withMessage('Full name is required'),
        check('phone').notEmpty().withMessage('Phone number is required'),
        check('address').notEmpty().withMessage('Address is required')
    ],
    validateResult: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(200).json(handleRespon(false, errors.array().map(err => err.msg).join(', ')));

        next();
    }
};

module.exports = userModel;
