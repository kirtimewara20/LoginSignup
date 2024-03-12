const {Router} = require('express')

// Importing authentication controller
const authController = require('../controllers/authController')

// Creating a new router instance
const router = Router()


// Defining routes for signup, login, and logout using corresponding controller methods

router.get('/signup', authController.signup_get);// Route to render the signup page
router.post('/signup', authController.signup_post); // Route to handle signup form submissions
router.get('/login', authController.login_get); // Route to render the login page
router.post('/login', authController.login_post); // Route to handle login form submissions
router.get('/logout', authController.logout_get); // Route to handle logout

module.exports = router;