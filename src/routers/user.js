const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail , sendCancelationEmail} = require('../emails/account')
const router = new express.Router()


router.post('/users' , async (req , res) =>{
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user)

        const token = await user.generateAuthToken()

        res.status(201).send({user , token})
    } catch(err) {
        res.status(400).send(err.message)
    }
})

router.post('/users/login' , async (req , res) =>{
    try {
        const user = await User.findByCredentials(req.body.email , req.body.password)
        const token = await user.generateAuthToken()

        res.send({user , token})
    } catch(err) {
        res.status(400).send(err.message)
    }
})

const upload = multer({
    limits : {
        fileSize : 1600000 ,
    } ,
    fileFilter(req , file , cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
           return cb(new Error('Only picture extensions are allowed'))
        }

        cb(undefined , true)
    }
})

router.post('/users/me/avatar' , auth , upload.single('avatar') , async (req , res) =>{
    const buffer = await sharp(req.file.buffer).resize({width : 250 , height : 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
} , (error , req , res , next) =>{
    res.status(400).send({error : error.message})
})

router.post('/users/logout' , auth , async (req , res) =>{
    try {
        req.user.tokens = req.user.tokens.filter((token) =>{
            return token.token !== req.token
        }) 

        await req.user.save()
        res.send()

    } catch(err) {
        res.status(500).send(err.message)
    }
})

router.post('/users/logoutAll' , auth , async (req , res) =>{
    try {
        req.user.tokens = []

        await req.user.save()
        res.send()

    } catch(err) {
        res.status(500).send(err.message)
    }
})

router.get('/users/me' , auth , async (req , res) =>{
    res.send(req.user)
})

router.get('/users/:id/avatar' , async (req , res) =>{
    try {
        const user = await User.findById(req.params.id)
    
    if(!user) {
        throw new Error('No user found with such ID!')
    }
    else if(!user.avatar) {
        throw new Error('The user does\'nt have an avatar')
    }

    res.set('Content-Type' , 'image/png')
    res.send(user.avatar)
    } catch(err) {
        res.status(404).send(err.message)
    }
})

router.patch('/users/me' , auth , async (req , res) =>{
    const updates = Object.keys(req.body)
    const allowedUps = ['name' , 'email' , 'password' , 'age']
    const hasValidUpdates = updates.every((update) => allowedUps.includes(update))

    if(!hasValidUpdates){
        return res.status(400).send({
            error : 'Update(s) not valid!'
        })
    }

    try{
        updates.forEach((update) =>{req.user[update] = req.body[update]})

        await req.user.save()
        
        res.send(req.user)

    } catch(err) {
        res.status(400).send(err.message)
    }
})

router.delete('/users/me' , auth , async (req , res) =>{
    try {
        await req.user.remove()
        sendCancelationEmail(req.user)

        res.send(req.user)
    } catch(err) {
        res.status(500).send(err.message)
    }
})

router.delete('/users/me/avatar' , auth , async (req , res) =>{
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch(err) {
        res.status(500).send(err.message)
    }
})


module.exports = router

