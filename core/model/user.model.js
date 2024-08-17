const { poolPromise, sql } = require('../../connection/dbConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = {
    async checkUser(user_name) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('user_name', sql.VarChar, user_name)
            .query('SELECT COUNT(*) AS count FROM [dbo].[user] WHERE user_name = @user_name');
        return result.recordset[0].count > 0;
    },

    async createUser(request) {
        const { user_name, full_name, phone, address } = request;
        const pool = await poolPromise;

        await pool.request()
            .input('user_name', sql.VarChar, user_name)
            .input('full_name', sql.VarChar, full_name)
            .input('phone', sql.VarChar, phone)
            .input('address', sql.VarChar, address)
            .query('INSERT INTO [dbo].[user] (user_name, full_name, phone, address) VALUES (@user_name, @full_name, @phone, @address)');
    },

    async updateUser(request) {
        const { user_name, full_name, phone, address } = request;
        const pool = await poolPromise;

        await pool.request()
            .input('user_name', sql.VarChar, user_name)
            .input('full_name', sql.VarChar, full_name)
            .input('phone', sql.VarChar, phone)
            .input('address', sql.VarChar, address)
            .query(`
                UPDATE [dbo].[user]
                SET full_name = @full_name,
                    phone = @phone,
                    address = @address
                WHERE user_name = @user_name
            `);
    },

    async getAllData({ pageIndex, pageSize, user_name }) {
        const pool = await poolPromise;
        const offset = (pageIndex - 1) * pageSize;

        let query = `
            SELECT * FROM [dbo].[user]
            WHERE (@user_name IS NULL OR user_name LIKE '%' + @user_name + '%')
            ORDER BY id
            OFFSET @offset ROWS
            FETCH NEXT @limit ROWS ONLY
        `;

        const result = await pool.request()
            .input('offset', sql.Int, offset)
            .input('limit', sql.Int, pageSize)
            .input('user_name', sql.VarChar, user_name || null)
            .query(query);

        return result.recordset;
    },

    async getCount() {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT COUNT(*) AS count FROM [dbo].[user]');
        return result.recordset[0].count;
    },

    // Kiểm tra tên người dùng và mật khẩu
    async authenticateUser(user_name, password) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('user_name', sql.VarChar, user_name)
            .query('SELECT * FROM [dbo].[user] WHERE user_name = @user_name');

        if (result.recordset.length === 0) return null;

        const user = result.recordset[0];
        const isMatch = await bcrypt.compare(password, user.password); // So sánh mật khẩu

        if (!isMatch) return null;

        return user;
    },

    // Thêm phương thức để tạo JWT
    generateToken(user) {
        const payload = {
            user_id: user.id,
            user_name: user.user_name
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        return token;
    }
};

module.exports = userModel;
