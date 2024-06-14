
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
    const pool = await sql.connect(dbSettings);
    const result = await pool.request().query("SELECT 1");
    console.log(result);
}

getConnection();








// const sql = require('mssql');
// require('dotenv').config();
// const config = require('../config');
// const { options } = require('../app');
// const Connection = require('tedious').Connection;

// const dbconfig = {
//     port: config.app.port,
//     host: config.app.host,
//     database: config.app.database,
//     user: config.app.user,
//     password: config.app.password,
//     server: config.app.server,
//     options: {
//         encrypt: false, //Si usamos Azure, se pone en true
//         trustServerCertificate: true // True si es una conexión local
//     }
// }
//  const getConnection = async () => {
//     try{
//         const pool = await sql.connect(dbconfig)
//         console.log('Conectado a SQL Server');
//         return pool;
//     } catch(error) {
//         // poner error
//         console.log('Error con la conexión');
//         console.error(error);
//     }
// }