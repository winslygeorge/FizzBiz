const { DEFAULT } = require("oracledb")

class QueryGenerator{

 queryGenerator(reqQuery){

    var fields = reqQuery.fields

   var wfields = []

   var wvalues = []

     var whereclause = ""
      var searchclause =  ""
    

    var tablename = reqQuery.tablename

    var operation = reqQuery.operation

    var wfield =  reqQuery.wfield

     var wvalue = reqQuery.wvalue
     
     var orderBy = reqQuery?.orderBy
     var orderByDirection = reqQuery?.orderByDirection

     var searchFields = reqQuery?.searchFields ?? null
     var searchVal  = reqQuery?.searchValue ?? null

     if (operation.match("select")) {
        
        
         
         if (searchFields && searchVal) {
             
            searchclause =  ` where UPPER(${searchFields[0]}) LIKE UPPER(:${searchFields[0]})`

            var k =  1;
            while(k < searchFields.length){

                searchclause  = searchclause  + ` OR UPPER(${searchFields[k]}) LIKE UPPER(:${searchFields[k]})`
                k = k + 1
            }
         }

          console.log(searchFields, searchVal, searchclause)

        if(wfield == undefined && wvalue == undefined ){

            if (fields.length == 0) {

                if(searchclause === ''){

                    if (orderBy) {
                    
                    
                    
                        return `SELECT * FROM ${tablename} ORDER BY ${orderBy} ${orderByDirection}`


    } else {
        
                        return `SELECT * FROM ${tablename}`

    }


                }else{

                    if (orderBy) {
                    
                    
                    
                        return [`SELECT * FROM ${tablename} ${searchclause} ORDER BY ${orderBy} ${orderByDirection}`, searchVal]


    } else {
        
                        return [`SELECT * FROM ${tablename} ${searchclause}`, searchVal]

    }
                }
                
               

            }

            var x = 0
            var queryFormated = fields[0];
 
            
 
            while(x < fields.length-1){
 
            queryFormated  = queryFormated  + ","+ fields[x]
             x= x + 1
            }
 
            if (orderBy) {
                
                return  [`SELECT ${queryFormated} from ${tablename} ORDER BY ${orderBy} ${orderByDirection}`, searchVal]
            }else{

                return  [`SELECT ${queryFormated} from ${tablename} `, searchVal]
            }
                   
            

        }else{

            var x = 1
            var queryFormated = fields[0];
 
            wfields = reqQuery.wfield
            wvalues = reqQuery.wvalue

            
 
            while(x < fields.length){
 
            queryFormated  = queryFormated  + " , "+fields[x]
             x= x + 1
            }

            
            whereclause =  ` where ${wfields[0]} = :${wfield[0]}`

            var k =  1;
            while(k < wfields.length){

                whereclause  = whereclause  + ` and ${wfields[k]} = :${wfields[k]}`
                k = k + 1
            }
 
            if (fields.length == 0) {
                
                if (orderBy) {
                   
                                    return [`SELECT * FROM ${tablename} ${whereclause} ORDER BY ${orderBy} ${orderByDirection}`, wvalues]


                } else {
                    
                                    return [`SELECT * FROM ${tablename} ${whereclause}`, wvalues]

                }

            }
            
            if (orderBy) {
                
            return  [`SELECT ${queryFormated} FROM ${tablename} ${whereclause} ORDER BY ${orderBy} ${orderByDirection}`, wvalues]

            } else {
                
                            return  [`SELECT ${queryFormated} FROM ${tablename} ${whereclause}`, wvalues]

            }

    }

    }else if(operation.match("delete")){

        return  [`DELETE FROM ${tablename} where ${wfield} = :id`, [wvalue]]

    }else if(operation.match("update")){

    }else if(operation.match("insert")){

}
return ""
}

generatePostQuery(reqbody){

    var keys = [];
    var Ovalue =  [];
    
        for (const key in reqbody) {
        if (reqbody.hasOwnProperty(key)) {

            if(!key.match("operation") && !key.match("tablename") && !key.match("where") && !key.match("val")){
            const element = reqbody[key];
            keys.push(key)
            Ovalue.push(element);
            }
        }
    }

    var noFields = `:${keys[0]}`
  //  var noValues = `{${keys[0]} : \{val:'${Ovalue[0]}'}`

  var noValues = {}
    var x  = 0
    while(x < Ovalue.length){

if(x != 0){

    noFields = noFields + ` , :${keys[x]}`

}


    noValues[keys[x]] = {val : Ovalue[x]}

     

        x  = x + 1
    }

    if(reqbody["operation"].match("update")){

var setWhere = ''
var setData = ''
var data = []
var counterUpdate = 0
        for (const key in reqbody) {
            if (reqbody.hasOwnProperty(key)) {
    
                const element = reqbody[key];
                if(!key.match("operation") && !key.match("tablename") && !key.match("where") && !key.match("val")){
                
            if(counterUpdate == 0){

                setData = setData + ' '+ key + ' = :'+ key 
            }else{

                setData = setData + ' , ' + key + ' = :'+ key 
            }
                
                data.push(element)

                counterUpdate++;
                }else if(key.match("where")){
    
    
                    setWhere = ' where ' + element + ' = :id'

                    data.push(reqbody['val'])
                }
            }
        }

        return [`UPDATE ${reqbody["tablename"]} SET ${setData} WHERE ${reqbody["where"]} = :val`, data]

    }else if(reqbody["operation"].match("insert")){

        return [`INSERT INTO ${reqbody["tablename"]}  VALUES (${noFields})` , noValues] 
    }
   return null;
}
}
module.exports = QueryGenerator