const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true
    } , 
    email : {
        type : String ,
        required : true ,
        trim : true ,
        lowercase : true ,
        // set : p => await bcrypt.hash(p , 8) ,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('The provided email is invalid!')
            }
        }
    } ,
    password : {
        type : String ,
        required : true ,
        minlength : 7 , 
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error("Your password must not contain the word 'password'!")
            }
        } 
    } ,
    age : {
        type : Number ,
        default : 0
    }
})

userSchema.pre('save' , async function(next) {
    const user = this

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password , 8)
    }

    next()
})

const User = mongoose.model('User' , userSchema)

module.exports = User