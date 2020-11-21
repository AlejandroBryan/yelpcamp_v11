const  express            = require('express'),
       bodyParser         = require('body-parser'),
       mongoose           = require('mongoose'),
       passport           = require('passport'),
       cookieParser       = require("cookie-parser"),
       localStrategy      = require('passport-local'),
       Campground         = require('./models/campground'),
       Comment            = require('./models/comment'),
       methodOverride     = require('method-override'),
       flash              = require('connect-flash'),
	User               = require('./models/user'),
       seedDB             = require('./seeds'),
       app                = express(),
       port               = process.env.PORT || 3000
       
// configure dotenv 
require('dotenv').config(); 
      
      
//Requiring routes
const commentRoutes       = require('./routes/comments'),
	  campgroundRoutes    = require('./routes/campgrounds'),
	  indexRoutes         = require('./routes/index')

//Database
mongoose.connect('mongodb://localhost:27017/campgrounds_v12',{
useNewUrlParser: true,
useCreateIndex: true,	
useUnifiedTopology: true,
useFindAndModify: false
}).then(()=>{console.log("Connected to DB!")}).catch(err =>{console.log("Error:", err.message)})


app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(methodOverride('_method'))
app.use(cookieParser('secret'));

//require moment
app.locals.moment = require('moment');
//seedDB()

//PASSPORT CONF.
app.use(require('express-session')({
secret: 'Rey Joel the cutiest baby boy on the world',
resave:false,
saveUninitialized: false

}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use( new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next){
       res.locals.currentUser = req.user
       res.locals.error = req.flash('error')
       res.locals.success = req.flash('success')
	next()
})

app.use('/', indexRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/comments', commentRoutes)


app.listen(port, () =>{
console.log(`The app is running on port : ${port}`)
})




