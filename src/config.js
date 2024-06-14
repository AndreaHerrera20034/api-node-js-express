//  importaciones import .... from ...
require('dotenv').config();


//exportaciones
module.exports = {
    app: {
        port: process.env.PORT || 4000,
        
    }
}