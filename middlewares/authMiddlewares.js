const jwt = require('jsonwebtoken')
const User = require("../models/User")

// Middleware function to require authentication for protected routes
const requireAuth = (req,res,next) => {
    const token = req.cookies.jwt; // Getting the JWT token from cookies

    // Checking if token exists
    if(token) {
        // Verifying the token
        jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
            if(err) {
                // If token verification fails, redirecting to login page
                res.redirect('/login')
            }
            else {
                // If token is valid, proceed to the next middleware/controller
                next()
            }
        });
    } else {
        // If token doesn't exist, redirecting to login page
        res.redirect('/login')
    }
};

// Middleware function to check user authentication and attach user data to response locals
const checkUser =  (req, res, next) => {
    const token = req.cookies.jwt; // Getting the JWT token from cookies

    // Checking if token exists
    if(token) {
        // Verifying the token
        jwt.verify(token, process.env.SECRET_KEY, async(err, decodeToken) => {
            if(err) {
                // If token verification fails, setting user to null in response locals and proceeding to the next middleware/controller
                res.locals.user = null; 
                next();
            } else{
                // If token is valid, finding user by decoded token ID
                try {
                    let user = await User.findById(decodeToken.id); // Finding user by ID in the database
                    res.locals.user = user; // Setting found user data to response locals
                    next()
                } catch(err) {
                    console.log(err); // Logging any errors
                    res.locals.user = null; // Setting user to null in response locals
                    next();
                }
            }
        });
    } else {
        // If token doesn't exist, setting user to null in response locals and proceeding to the next middleware/controller
        res.locals.user = null;
        next();   
    }
}

module.exports = {
    requireAuth,
    checkUser
};