const express = require('express')
const cookieParser = require('cookie-parser')
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Importing custom middleware functions
const {requireAuth, checkUser} = require('./middlewares/authMiddlewares')
const authRoutes = require('./routes/authRoutes');

// Initialize Express app
const app = express()
app.use(express.json())

dotenv.config();

//MONGODB Connection
mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("DB connection successful")})
    .catch((err)=>{
        console.log("DB connection error:", err)
    });

// Middleware setup
app.use(express.static('public'))
app.use(cookieParser())

// Registering authentication routes
app.use(authRoutes)

// Setting view engine to EJS for rendering dynamic content
app.set('view engine', 'ejs')

// Route for handling root endpoint
app.get('/', (req,res) => {
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, decodeToken) => {
            if (err) {
                res.render("login");
            } else {
                res.render("dashboard");
            }
        });
    } else {
        res.render("login");
    }
})

// Route for rendering the dashboard, requiring authentication
app.get('/dashboard', requireAuth, (req,res) => {
    res.render('dashboard');
})

// Catch-all route for checking user authentication
app.get('*', checkUser);

// Starting the server
app.listen(process.env.PORT || 8008, ()=>{
    console.log("Server is running!")
});