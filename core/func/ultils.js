// Handle response
const handleRespon = (success, message = '', data = [], code = 0) => {
    return { data, success, code, message };
};

module.exports = handleRespon;
