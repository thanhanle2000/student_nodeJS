const express = require('express');
const useRouter = express.Router();
const { validateUserData, validateResult } = require('../func/valid/user.valid');
const handleRespon = require('../func/ultils');
const conectionServices = require('../services/conection.services');
const userModel = require('../model/user.model');

// create-user
useRouter.post('/create-user', validateUserData, validateResult, conectionServices(async (req, res) => {
    // Request
    const request = {
        user_name: req.body.user_name,
        full_name: req.body.full_name,
        phone: req.body.phone,
        address: req.body.address
    };

    // Check if user_name already exists
    if (await userModel.checkUser(request.user_name))
        return res.status(200).json(handleRespon(false, 'Tên người dùng đã tồn tại'));

    // Insert new user
    await userModel.createUser(request);
    res.status(200).json(handleRespon(true, 'Tạo mới thành công'));
}));

// update-user
useRouter.post('/update-user', validateUserData, validateResult, conectionServices(async (req, res) => {
    // Request
    const request = {
        user_name: req.body.user_name,
        full_name: req.body.full_name,
        phone: req.body.phone,
        address: req.body.address
    };

    // Insert new user
    await userModel.updateUser(request);
    res.status(200).json(handleRespon(true, 'Cập nhật thành công'));
}));

// get-users
useRouter.post('/get-users', conectionServices(async (req, res) => {
    // Request
    const pageIndex = parseInt(req.body.pageIndex, 10) || 1;
    const pageSize = parseInt(req.body.pageSize, 10) || 10;
    const user_name = req.body.user_name || null;

    // Create response
    const response = {
        data: {
            total: await userModel.getCount(),
            list: await userModel.getAllData({ pageIndex, pageSize, user_name })
        },
        success: true,
        code: 0,
        message: ''
    };

    res.status(200).json(response);
}));

// Middleware để kiểm tra kết quả xác thực
const validateLogin = [
    check('user_name').notEmpty().withMessage('User name is required'),
    check('password').notEmpty().withMessage('Password is required')
];

// Route đăng nhập
useRouter.post('/login', validateLogin, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(handleRespon(false, errors.array().map(err => err.msg).join(', ')));
    }

    const { user_name, password } = req.body;

    userModel.authenticateUser(user_name, password)
        .then(user => {
            if (!user) {
                return res.status(401).json(handleRespon(false, 'Invalid credentials'));
            }

            const token = userModel.generateToken(user);
            res.status(200).json({
                success: true,
                token: token
            });
        })
        .catch(err => {
            console.error('Error during authentication:', err);
            res.status(500).json(handleRespon(false, 'Internal Server Error'));
        });
});

module.exports = useRouter;
