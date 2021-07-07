const path=require('path')
const express=require('express')
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const morgan=require('morgan')
const exphbs=require('express-handlebars')
const methodOverride=require('method-override')
const passport=require('passport')
const session=require('express-session')
const MongoStore=require('connect-mongo')
const connectDB=require('./config/db')

//load config
dotenv.config({path:'./config/config.env'})

//passport config
require('./config/passport')(passport)

//mongo db connection
connectDB()

const app=express()

//body parser
app.use(express.urlencoded({extended :false}))
app.use(express.json())

//method override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
}))

//logging
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}
//handlebars helpers
const{formatDate}=require('./helpers/hbs')

//handlebars
app.engine('.hbs',exphbs({helpers:{
    formatDate,
},
defaultLayout: 'main',
extname: 'hbs'})
)

app.set('view engine','.hbs')

//sessions
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:false,
    store: MongoStore.create({mongoUrl:process.env.MONGO_URI}) //to store logged in data so that we can stay logged in even after refreshing the page
})
)


//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//static folder
app.use(express.static(path.join(__dirname,'public')))

//routes
app.use('/',require('./routes/app'))
app.use('/auth',require('./routes/auth'))
app.use('/entries',require('./routes/entries'))

//process.env.variable name in config
const PORT=process.env.PORT||3000

app.listen(
    PORT,
    console.log(`Server running in${process.env.NODE_ENV}node on port ${PORT} `)
    )