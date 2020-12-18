const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

router.post('/tasks' , async (req , res) =>{
    let task = new Task(req.body)
    task.description = saveTrimmedDesc(task.description)
    
    try {
        await task.save()
        res.status(201).send(task)
    } catch(err){
        res.status(400).send(err)
    }
})

router.get('/tasks' , async (req , res) =>{
    try{
        const tasks = await Task.find({})
        res.send(tasks)
    } catch(err) {
        res.status(500).send(err)
    }
    
})

router.get('/tasks/:id' , async (req , res) =>{
    const _id = req.params.id

    try{
        const task = await Task.findById(_id)
        if(!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch(err) {
        res.status(500).send(err)
    }
}) 

router.patch('/tasks/:id' , async (req , res) =>{
    const updates = Object.keys(req.body)
    const allowedUps = ['description' , 'completed']
    const hasValidUpdates = updates.every((update) => allowedUps.includes(update))

    if(!hasValidUpdates){
        return res.status(400).send({
            error : 'Update(s) not valid!'
        })
    }

    try{
        const task = await Task.findById(req.params.id)
        updates.forEach((update) =>{task[update] = req.body[update]})
        await task.save()

        if(!task) {
            return res.status(404).send()
        }
        
        res.send(task)
    } catch(err) {
        res.status(400).send(err)
    }
})

router.delete('/tasks/:id' , async (req , res) =>{
    try {
        const task = await Task.findByIdAndDelete(req.params.id)

        if(!task)
            return res.status(404).send()
            
        res.send(task)
    } catch(err) {
        res.status(500).send(err)
    }
})


module.exports = router


