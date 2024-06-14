
const sql = require('mssql');
//const config = require('../config');

const dbSettings = {
    server: 'localhost',
    database: 'blog',
    user: 'sa',
    password: 'andrea11037',
    options: {
        encrypt: true,
        trustServerCertificate: true
    },
};

async function getConnection()  {
    try {
        const pool = await sql.connect(dbSettings);
        const result = await pool.request().query("SELECT 1");
        console.log(result);
    } catch (err) {
        console.error('Database connection failed:', err);
    }
}

getConnection();

module.exports = dbSettings;


// const sql = require('mssql');
// //const config = require('../config');

// const dbSettings = {
//     server: 'localhost',
//     database: 'blog',
//     user: 'sa',
//     password: 'andrea11037',
//     options: {
//         encrypt: true,
//         trustServerCertificate: true
//     },
// };

// async function getConnection()  {
//     const pool = await sql.connect(dbSettings);
//     const result = await pool.request().query("SELECT 1");
//     console.log(result);
// }

// getConnection();