const handleRespon = require('../func/ultils');

// Conection Services 
const conectionServices = (asyncFunc) => {
    return async (req, res, next) => {
        try {
            await asyncFunc(req, res, next);
        } catch (err) {
            res.status(500).json(handleRespon(false, 'Server lỗi. Vui lòng đợi trong giây lát!!!'));
        }
    };
};

module.exports = conectionServices;