const { query } = require('express')
const mysql = require('mysql')

const db = require('./dbcon')

class DBcon{

     dbgetRequest(res, queryString) {
            db.query(queryString, (err, results, fields)=>{

                if(!err){
    
                    res.send({resultCode : 200, results : results})
                }else{
    
                    res.send({resultCode : 404, results : err})
                }
            }) 
    }

    dbPostRequest(q){
            db.query(q, (err, results)=>{

                if(!err){
    
                    console.log({resultCode : 200, results : results})
                }else{
    
                    console.log({resultCode : 404, results : err})
                }
            })       
    }

    queryGenerator(reqQuery){


        var fields = reqQuery.fields

       var wfields = []

       var wvalues = []

       var whereclause =  ""
        

        var tablename = reqQuery.tablename

        var operation = reqQuery.operation

        var wfield =  reqQuery.wfield

        var wvalue =  reqQuery.wvalue

        if(operation.match("select")){


            if(wfield == undefined && wvalue == undefined ){

                var x = 0
                var queryFormated = "??";
     
                
     
                while(x < fields.length-1){
     
                queryFormated  = queryFormated  + " , ??"
                 x= x + 1
                }
     
                fields.push(tablename)

               
                return  mysql.format("select "+ queryFormated + " from ??", fields )

            }else{

                var x = 0
                var queryFormated = "??";
     
                wfields = reqQuery.wfield
                wvalues = reqQuery.wvalue

                
     
                while(x < fields.length-1){
     
                queryFormated  = queryFormated  + " , ??"
                 x= x + 1
                }
     
                fields.push(tablename)

                fields.push(wfields[0])

                fields.push(wvalues[0])

                whereclause =  " where ?? = ?"

                var k =  1;
                while(k < wfields.length){

                    whereclause  = whereclause  + " and ?? = ? "

                    fields.push(wfields[k])
                    fields.push(wvalues[k])

                    k = k + 1
                }
     
                return  mysql.format("select "+ queryFormated + " from ??" + whereclause  , fields )
        }

        }else if(operation.match("delete")){


            var field  = []


            field.push(tablename)

            field.push(wfield)

            field.push(wvalue)
 
            return  mysql.format("delete from ?? where ?? = ? ", field )

        }else if(operation.match("update")){





        }else if(operation.match("insert")){

      
           

    }

  
    return ""



    }
    handleInsertBody(reqbody){

        var keys = [];
        var Ovalue =  [];
        
            for (const key in reqbody) {
            if (reqbody.hasOwnProperty(key)) {

                if(!key.match("operation") && !key.match("tablename")){
                const element = reqbody[key];
                keys.push(key)
                Ovalue.push(element);
                }
            }
        }


        
        var newObject  = keys.concat(Ovalue);

        var noFields = "??"
        var noValues = "?"
        var x  = 0
        while(x < Ovalue.length- 1){


            noFields = noFields + " , ??"

            noValues =  noValues + " , ?"

            x  = x + 1
        }

        if(reqbody["operation"].match("update")){




            var upv = [];

            upv.push(reqbody["tablename"]);

        for (const key in reqbody) {
            if (reqbody.hasOwnProperty(key)) {

                if(!key.match("operation") && !key.match("tablename") && !key.match("where") && !key.match("val")){
                const element = reqbody[key];
                upv.push(key)
                upv.push(element);
                }
            }
        }

        

        var noFields = " ?? = ? "
        var noValues = "?"
        var x  = 0
        while(x < Ovalue.length- 3){


            noFields = noFields + ", ?? = ? "

            

            x  = x + 1
        }

        upv.push(reqbody["where"])
        upv.push(reqbody["val"])
            return mysql.format("UPDATE ?? SET "+ noFields+ " WHERE ?? = ?", upv);

        }else if(reqbody["operation"].match("insert")){

            return mysql.format("insert into ?? ("+noFields+") values ("+noValues+")", newObject)
        }
       return null;
    }


}

module.exports = DBcon
