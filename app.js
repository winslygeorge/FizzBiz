const express = require('express')

const config = require('./oracleDBManager/dbconfig')
const {getConnection, checkConnectionHealth} = require('./oracleDBManager/dbconnect')
const app = express()

const session = require('express-session')

const Store = require('express-oracle-session2')(session)


const postRoute = require('./views/Routes/post')
const getRoute = require('./views/Routes/get')
const loginRoute = require('./views/Routes/login')
const susRoute = require('./views/Routes/sus')

const bodyParser = require('body-parser');

app.use(express.json(bodyParser))

app.use( express.static('views'))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: false })); 

var options = {

    user: config.user,
    password: config.password,
    connectString: config.connectionString,
    externalAuth: true,
    checkExpirationInterval: 900000,// How frequently expired sessions will be cleared; milliseconds.
    expiration: 86400000,// The maximum age of a valid session; milliseconds.
    createDatabaseTable: true,// Whether or not to create the sessions database table, if one does not already exist.
    connectionLimit: 5
}

const isAuth = (req, res, next)=>{

    if(req.session.isAuth){

        next()
    }else{

        res.redirect('/login')
    }
}

setSessionStore()

app.listen(8087, (err)=>{

    if(err) throw err

    console.log('server connected')
})

//functions

async function setSessionStore(){

    let connect  =  await getConnection()
    var oracleStore  = new Store({options}, connect)

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
      });

    app.use(session({

        secret: "winslowgeorgos",
        resave : false,
        saveUninitialized: false,
        store: oracleStore
    }))



app.use('/', postRoute)
app.use('/', getRoute)

app.use('/', loginRoute)

app.use('/', require('./views/logout'))

    app.use('/', require('./views/Routes/AddService'))
    
    app.use('/', require('./views/Routes/serviceupdate'))
    app.use('/', require('./views/Routes/deletappscomp'))
    app.use('/', require('./views/Routes/compDiscSus'))
    app.use('/', require('./views/Routes/userDets'))
    app.use('/', require('./views/Routes/search'))

    app.use('/', require('./views/Routes/scheduler'))

    app.use('/', susRoute)

app.get('/home', isAuth, (req, res )=>{
   
        console.log(req.session)
        res.render('home/index', {name: "winslow", subjects:["math", "eng", "kiswahili"]})
    })


    setInterval(async ()=>{


        try {
            // const connection = await getConnectionFromPool();
            if (connect) {
              console.log('Oracle DB connection is alive and healthy');
              // Optionally, you can perform a simple query to further validate the connection
              const result = await connect.execute('SELECT 1 FROM DUAL');
              console.log('Query Result:', result.rows);
            }
          } catch (error) {
            console.error('Error checking connection health:', error);
          }

    }, 120000)

}