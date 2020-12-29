const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')


router.post('/tasks' , auth , async (req , res) =>{
    const task = new Task({
        ...req.body ,
        owner : req.user._id
    })
    
    try {
        await task.save()
        res.status(201).send(task)
    } catch(err){
        res.status(400).send(err.message)
    }
})

router.get('/tasks' , auth , async (req , res) =>{
    try{
        const {query , user} = req
        const match = {}
        const sort = {}
        
        if(query.completed) {
            match.completed = query.completed === 'true'
        }

        if(query.sortBy) {
            const parts = query.sortBy.split(':')
            sort[parts[0]] = parts[0] === 'asc' ? 1 : -1
        }

        await user.populate({
            path : 'tasks' ,
            match ,
            options : {
                limit : parseInt(query.limit) ,
                skip : parseInt(query.skip) ,
                sort
            }
        }).execPopulate()

        res.send(user.tasks)
    } catch(err) {
        res.status(500).send(err.message)
    }
    
})

router.get('/tasks/:id' , auth , async (req , res) =>{
    const _id = req.params.id

    try{
        const task = await Task.findOne({_id , owner : req.user._id})

        if(!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch(err) {
        res.status(500).send(err.message)
    }
}) 

router.patch('/tasks/:id' , auth , async (req , res) =>{
    const updates = Object.keys(req.body)
    const allowedUps = ['description' , 'completed']
    const hasValidUpdates = updates.every((update) => allowedUps.includes(update))

    if(!hasValidUpdates){
        return res.status(400).send({
            error : 'Update(s) not valid!'
        })
    }

    try{
        const _id = req.params.id
        const task = await Task.findOne({_id , owner : req.user._id})
        
        if(!task) {
            return res.status(404).send()
        }

        updates.forEach((update) =>{task[update] = req.body[update]})
        await task.save()
        
        res.send(task)
    } catch(err) {
        res.status(400).send(err.message)
    }
})

router.delete('/tasks/:id' , auth , async (req , res) =>{
    try {
        const _id = req.params.id

        const task = await Task.findOneAndDelete({_id , owner : req.user._id})

        if(!task)
            return res.status(404).send()
            
        res.send(task)
    } catch(err) {
        res.status(500).send(err.message)
    }
})


module.exports = router


