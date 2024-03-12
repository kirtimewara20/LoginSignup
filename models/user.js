const mongoose = require("mongoose");
const bcrypt = require ("bcrypt");
const {isEmail} = require('validator');

// Defining user schema using Mongoose
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require: [true,"Please enter a name"],
    },
    email:{
        type: String,
        require: [true,"Please enter a email"],
        unique: true,
        validate: [isEmail,"Please enter a valid email"]
    },
    password:{
        type: String,
        require: [true,"Please enter a password"],
        minlength: [6, "Minimum length of password should be six"]
    },
  },
  { timestamps: true }
);

// Middleware to hash the password before saving the user
userSchema.pre('save', async function(next) {
    // Generating salt and hashing the plain password
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

// Static method to log in a user
userSchema.statics.login = async function(email, password){
    // Finding user by email
    const user = await this.findOne({email})
    if(user) {
        // If user is found, compare provided password with hashed password
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            return user; // If password matches, return the user
        }
        throw Error("incorrect password"); // If password doesn't match, throw incorrect password error
    }
    throw Error("incorrect email"); // If email is not found, throw incorrect email error
}

const User = mongoose.model('user', userSchema);

module.exports = User;