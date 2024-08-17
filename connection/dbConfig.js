const sql = require('mssql');

const config =
{
    user: 'admin',
    password: 'admin114',
    server: 'DESKTOP-3SJQ2V2',
    database: 'node_db',
    port: 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true
    },
}

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Database connection failed:', err);
        process.exit(1);
    });

module.exports = { sql, poolPromise };
