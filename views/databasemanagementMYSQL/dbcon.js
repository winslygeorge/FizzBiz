const mysqli = require('mysql')

const con = mysqli.createPool({
    connectonLimit : 50,
    host : "georgoswinserver.mysql.database.azure.com",
    port : 3306,
    user : "georgoswins@georgoswinserver",
    password : "Winwings2.",
    database : "digitaldb",
    debug : false
})

module.exports = con