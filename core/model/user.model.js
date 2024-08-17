const { poolPromise, sql } = require('../../connection/dbConfig');

const userModel = {
    async checkUserNameExists(user_name) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('user_name', sql.VarChar, user_name)
            .query('SELECT COUNT(*) AS count FROM [dbo].[user] WHERE user_name = @user_name');
        return result.recordset[0].count > 0;
    },

    async createUser(userData) {
        const { user_name, full_name, phone, address } = userData;
        const pool = await poolPromise;
        await pool.request()
            .input('user_name', sql.VarChar, user_name)
            .input('full_name', sql.VarChar, full_name)
            .input('phone', sql.VarChar, phone)
            .input('address', sql.VarChar, address)
            .query('INSERT INTO [dbo].[user] (user_name, full_name, phone, address) VALUES (@user_name, @full_name, @phone, @address)');
    },

    async getAllUsers({ pageIndex, pageSize, user_name }) {
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

    async getUserCount() {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT COUNT(*) AS count FROM [dbo].[user]');
        return result.recordset[0].count;
    }
};

module.exports = userModel;
