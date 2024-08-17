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
    if (await userModel.checkUserNameExists(request.user_name))
        return res.status(200).json(handleRespon(false, 'Tên người dùng đã tồn tại'));

    // Insert new user
    await userModel.createUser(request);
    res.status(200).json(handleRespon(true, ''));
}));

// get-users
useRouter.post('/get-users', conectionServices(async (req, res) => {
    // Request
    const pageIndex = parseInt(req.body.pageIndex, 10) || 1;
    const pageSize = parseInt(req.body.pageSize, 10) || 10;
    const user_name = req.body.user_name || null;

    try {
        // Create response
        const response = {
            data: {
                total: await userModel.getUserCount(),
                list: await userModel.getAllUsers({ pageIndex, pageSize, user_name })
            },
            success: true,
            code: 0,
            message: ''
        };

        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(handleRespon(false, 'Internal Server Error'));
    }
}));

module.exports = useRouter;
