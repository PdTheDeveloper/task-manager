const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description : {
        type : String , 
        required : true , 
        trim : true
    } ,
    completed : {
        type : Boolean ,
        default : false
    }
})

taskSchema.methods.saveTrimmedDesc = function() {
    const desc = this.description
    const txtArr = desc.split(' ')
    let resArr = txtArr.map((item) =>{
        return item.charAt(0).toUpperCase() + item.slice(1)  
    })
    desc = resArr.join('')
}

taskSchema.pre('save' , async function(next) {
    const task = this

    if(task.isModified('description')) {
        task.saveTrimmedDesc()
    }

    next()
})

const Task = mongoose.model('Task' , taskSchema)


module.exports = Task