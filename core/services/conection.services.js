const handleRespon = require('../func/ultils');

const conectionServices = (asyncFunc) => {
    return async (req, res, next) => {
        try {
            await asyncFunc(req, res, next);
        } catch (err) {
            res.status(500).json(handleRespon(false, 'Internal Server Error'));
        }
    };
};

module.exports = conectionServices;