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
    } ,
    owner : {
        type : mongoose.SchemaTypes.ObjectId ,
        required : true ,
        ref : 'User'
    }
} , {
    timestamps : true
})

taskSchema.static('saveTrimmedDesc' , function(text) {
    const txtArr = text.split(' ')
    let resArr = txtArr.map((item) =>{
        return item.charAt(0).toUpperCase() + item.slice(1)
    })
    return resArr.join('') 
})

taskSchema.methods.toJSON = function(next) {
    const task = this
    const taskObject = task.toObject()

    delete taskObject._id
    delete taskObject.owner
    delete taskObject.__V

    return taskObject
}

const Task = mongoose.model('Task' , taskSchema)


module.exports = Task