const oracledb = require('oracledb');
const dbconnect = require('../../../oracleDBManager/dbconnect');
//const connection = require('./../../../oracleDBManager/dbconnect')
const config = require('./../../../oracleDBManager/dbconfig')
const fs = require('fs'); 

// Define the Oracle DB connection details
const dbConfig = {
  user: 'your_username',
  password: 'your_password',
  connectString: 'your_connection_string', // e.g., localhost:1521/your_service_name
};

class   QueryFunctionData{


  

  async queryBusinessData(businessId,category) {
    try {
      // Create a connection pool to the Oracle database
      await oracledb.createPool(config);
  
      // Get a connection from the pool
      const connection = await oracledb.getConnection();
  
      // Define the PL/SQL function call
      const plsql = `
        BEGIN
          :result := ADMIN.get_business_data_json(:businessid, :category);
        END;
      `;
  
      // Create a bind variable for the result
      const bindVars = {
        result: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 32767 },
        businessid: businessId,
        category : category
      };

      console.log('binders : ', bindVars)
  
      // Execute the PL/SQL function
      const result = await connection.execute(plsql, bindVars);
  
      // Parse the JSON result
      const jsonResult = JSON.parse(result.outBinds.result);
  
      // Release the connection
      await connection.close();
  
      // Return the JSON data
      return jsonResult;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    } finally {
      // Close the connection pool
      await oracledb.getPool().close();
    }
  }

}
 


  module.exports = QueryFunctionData