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

 const checkConnectionHealth = async () => {
    try {
      const connection = await getConnectionFromPool();
      if (connection) {
        console.log('Oracle DB connection is alive and healthy');
        // Optionally, you can perform a simple query to further validate the connection
        const result = await connection.execute('SELECT 1 FROM DUAL');
        console.log('Query Result:', result.rows);
        await connection.close(); // Close the connection after checking
      }
    } catch (error) {
      console.error('Error checking connection health:', error);
    }
  };

module.exports ={getConnectionFromPool, checkConnectionHealth}