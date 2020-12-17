const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User' , {
    name : {
        type : String ,
        required : true
    } , 
    email : {
        type : String ,
        required : true ,
        trim : true ,
        lowercase : true ,
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

module.exports = User