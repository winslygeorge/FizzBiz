module.exports = {


    user: process.env.username|| "ADMIN",

    password : process.env.Password || "Winwings2...",

    connectionString: process.env.conString|| "fizzbiznetdb_high",

    poolMax: 10, // maximum size of the pool
       poolMin: 0, // let the pool shrink completely
       poolIncrement: 1, // only grow the pool by one connection at a time
       poolTimeout: 0  // never terminate idle connections
}