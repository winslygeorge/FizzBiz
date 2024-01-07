
const {getConnectionFromPool, checkConnectionHealth} = require('./dbconnect')
const oracledb = require('oracledb');
const { isEmptyObject } = require('jquery');

const config = require('./dbconfig')

const querygenerator = require('./queryGenerator');
const QueryGenerator = require('./queryGenerator');
const { DEFAULT } = require('oracledb');

class HandleQueryRequest{

 getDbConnecting = async()=>{

    return (await getConnectionFromPool())

    }
async  run(queryBody){
    const qg = new QueryGenerator();
    try{

        let dbcon = getConnectionFromPool()

    //     console.log(dbcon?.isHealthy)

    //    if(dbcon != null && !dbcon?.isHealthy){

    //       (await dbcon).close()

    //       dbcon = await dbcon

    //     }

        if(dbcon != null ){


           let query;
           if(queryBody["operation"].match("select") || queryBody["operation"].match("delete")){

            query = qg.queryGenerator(queryBody)
           }else if(queryBody["operation"].match("insert") ||queryBody["operation"].match("update")){

            query = qg.generatePostQuery(queryBody)
           }
           
           let results;
           console.log(query)
           if(query instanceof Array){

            results =  (await dbcon).execute(
                query[0],
                query[1],
                { autoCommit: true }
                ).then(function(success){

                    return {code : 200, result : success}
                }, function(err){
    
                    return {code : 101, result : err }
                })
    
                return {code :  (await results).code, result :  (await results).result}
        
           }else{


            console.log(query)
            results =  (await dbcon).execute(
            query,{}, { autoCommit: true }
            ).then(function(success){

                return {code : 200, result : success}
            }, function(err){

                return {code : 101, result : err }
            })

            return {code :  (await results).code, result :  (await results).result}
        
           }
    
        }

       
    
    }catch(e){
    
        console.error(e)
    
    }finally{
    
        // if(dbcon && dbcon.isHealthy){
    
        //     (await dbcon).close()
          
        //       }
      
    }
}

}


module.exports = HandleQueryRequest
