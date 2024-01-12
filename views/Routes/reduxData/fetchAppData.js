const oracledb = require('oracledb');
const dbconnect = require('../../../oracleDBManager/dbconnect');

// Define the Oracle DB connection details
const dbConfig = {
  user: 'your_username',
  password: 'your_password',
  connectString: 'your_connection_string', // e.g., localhost:1521/your_service_name
};

class QueryFunctionData {
  async queryBusinessData(businessId, category, dconnect) {
    try {
      // Get a connection from the database


      let connect = await dconnect

      console.log("APPID : ", businessId)
  
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
      category: category
    };

    // Execute the PL/SQL function
    const result = await connect.execute(plsql, bindVars);

    console.log(result)
    // Parse the JSON result
    const jsonResult = JSON.parse(result.outBinds.result);

    // Release the connection

    // Return the JSON data
    return jsonResult;
      
  
     
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}

module.exports = QueryFunctionData;
