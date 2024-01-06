const  dbcon = require('oracledb')
const config = require('./dbconfig')
//const dbcon = db()
let con

dbcon.outFormat = dbcon.OUT_FORMAT_OBJECT;
async function getConnection(){

    try{

        con   = await dbcon.getConnection(config)
      
          console.log('connection was successful')

          return con;
      }catch(e){
      
          console.error(e);
      }
         
return null;
}

const   getConnectionFromPool =  async ()=> {
  if (!con) {
   con = await dbcon.createPool(config);

   console.log('oracle db sever connected')
   
  }
  return con.getConnection()
 }

module.exports =getConnectionFromPool()