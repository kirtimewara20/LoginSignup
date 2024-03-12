const User = require("../models/User");
const jwt = require('jsonwebtoken')

// Setting the maximum age for the JWT token
const maxAge = 3* 24 * 60 * 60

// Function to create a JWT token with user ID
const createToken = (id) => {
    return jwt.sign({id}, process.env.SECRET_KEY, {
        expiresIn:maxAge
    })
}

// Controller action to render the signup page
module.exports.signup_get = (req, res) => {
    res.render('signup');
}

// Function to handle errors and return appropriate error messages
const handleErrors = (err) => {
    console.log(err.message, err.code)

    let errors = {
        name:"",
        email:"",
        password:""
    };

    // Handling different types of errors

    // Incorrect email or password
    if(err.message === "incorrect email") {
        errors.email = 'That email is not registered';
    }
    if(err.message === "incorrect password") {
        errors.password = 'That password is incorrect';
    }

    // Duplicate email error
    if (err.code === 11000) {
        errors.email = 'That email is already registered'
        return errors;
    }

    //validation errors
    if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;// Returning the error object
};   

// Controller action to handle signup POST requests
module.exports.signup_post = async (req, res) => {
    const { name, email, password } = req.body;
     try {
        // Creating a new user in the database
        const user = await User.create ({
            name, 
            email, 
            password
        });

        // Creating and setting JWT token as a cookie
        const token = createToken(user._id)
        res.cookie('jwt', token,{httpOnly: true, maxAge: maxAge})

        // Sending response with the user ID
        res.status(201).json({user: user._id});
    } catch (err) {
        console.log(err);
        // Handling errors and sending appropriate response
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
};

// Controller action to handle login POST requests
module.exports.login_post =  async(req, res) => {
    const { email, password } = req.body;
     try {
        // Logging in the user
        const user = await User.login(email, password)

        // Creating and setting JWT token as a cookie
        const token = createToken(user._id)
        res.cookie('jwt', token,{httpOnly: true, maxAge: maxAge})

        // Sending response with the user ID
        res.status(200).json({user: user._id});

    } catch (err) {
        console.log(err);

        // Handling errors and sending appropriate response
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
};

// Controller action to handle logout GET requests
module.exports.logout_get = (req, res, next) => {
    // Clearing the JWT token cookie
    res.cookie("jwt", '', {maxAge: 1});
    res.redirect('/')
}

// Controller action to render the login page
module.exports.login_get = (req, res) => {
    res.render('login');
}