const express = require('express');
const useRouter = require('./user.router');
const indexRouter = express.Router();

// Khai báo router
indexRouter.use('/', useRouter)

module.exports = indexRouter