const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description : {
        type : String , 
        required : true , 
        trim : true , 
        set : d => Task.saveTrimmedDesc(d)
    } ,
    completed : {
        type : Boolean ,
        default : false
    }
})

taskSchema.static('saveTrimmedDesc' , function(text) {
    const txtArr = text.split(' ')
    let resArr = txtArr.map((item) =>{
        return item.charAt(0).toUpperCase() + item.slice(1)
    })
    return resArr.join('') 
})


const Task = mongoose.model('Task' , taskSchema)


module.exports = Task