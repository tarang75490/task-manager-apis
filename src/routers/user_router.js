const User = require('../models/User.js')
const express = require('express')
const app = new express.Router()
const auth = require('../middleware/auth.js')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail,sendCancellationEmail} = require("../emails/account")
const upload = multer({
    // dest:'images', // Not use dest option makes the file available to be processed in api further
    limits:{
        fileSize:10000000
    },
    fileFilter(req,file,cb){
        console.log(file.originalname)
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('please upload with the expensions jpg,jpeg,png'))
        }
        cb(undefined,true)
    }

})



app.post('/users/me/avatar',auth,upload.single("avatar"),async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:100,height:100}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send("uploaded")
},(error,req,res,next)=>{
        res.status(400).send({error: error.message})
    })

app.delete('/users/me/avatar',auth,async (req,res)=>{
        req.user.avatar = undefined
        await req.user.save()
        res.send("Image Deleted")
    },(error,req,res,next)=>{
            res.status(400).send({error: error.message})
        })
    
app.get('/users/:id/avatar',async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user ||!user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/jpg') // -->  this image is directly returned in correct format
        res.send(user.avatar)
    }
    catch(e){
        res.status(400).send()
    }
})

app.post('/users', async (req,res)=>{
    const user = new User(req.body)
    

    try{
        const token = await user.generatetoken()
        await user.save()
        // sendWelcomeEmail(user.email,user.name)
        res.status(201).send({user,token})


    }catch(error){
        console.log('Unable to create New user \n'+ error.message)
        // res.status(400)
        // res.send(error)
        res.status(400).send('Unable to create New user \n'+ error.message)

    }

    // user.save().then((result)=>{
    //     res.status(201).send('New User Created Successfully')
    //     console.log(user)

    // }).catch((error)=>{
    //     console.log('Unable to create New user \n'+ error.message)
    //     // res.status(400)
    //     // res.send(error)
    //     res.status(400).send('Unable to create New user \n'+ error.message)  //chaining
    // })
    // console.log(req.body)
})





app.get('/users/me',auth,async (req,res)=>{

    res.send(req.user)
    // try{
    //     const users = await User.find()
    //     res.send(users)
    // }
    // catch(error){
    //     res.status(500).send(error)
    // }

    // User.find({age:21}).then((users)=>{
    //     res.send(users)
    // }).catch((error)=>{
    //     res.status(500).send(error)
    // })

})

// app.get('/users/:id',async (req,res)=>{
//     const _id = req.params.id

//     try{
//         const user = await User.findById(_id)   
//         if (!user){
//             return    res.status(404).send('Not Found')
//         }
//         res.send(user)
//     }catch(error){
//         res.status(500).send("Unable to connect \n" ,error)
//     }

//     User.findById(_id).then((user)=>{
//         if (!user){
//             return    res.status(404).send('Not Found')
//         }
//         res.send(user)
// }).catch((error)=>{
//     res.status(500).send("Unable to connect")
// })
// })




// app.patch('/users/:id',async (req,res) =>{
//     const allowed_updates = ['name','age','password','email']
//     const updates = Object.keys(req.body)
//     const valid = updates.every((update)=> allowed_updates.includes(update))

//     if (!valid){
//        return res.status(400).send("Invalid Update Property")
//     }
//     try{
        
//         const user = await User.findById(req.params.id)

//         updates.forEach((update) => user[update] = req.body[update])
//         await user.save()



//         // const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
//         if (!user){
//            return res.status(404).send('Not Found')
//         }
//         res.send(user)

//     }catch(error){
//         res.status(400).send(error)
//     }
// })

app.patch('/users/me',auth,async (req,res) =>{
    const allowed_updates = ['name','age','password','email']
    const updates = Object.keys(req.body)
    const valid = updates.every((update)=> allowed_updates.includes(update))

    if (!valid){
       return res.status(400).send("Invalid Update Property")
    }
    try{
        
        // const user = await User.findById(req.params.id)

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()



        // const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        // if (!user){
        //    return res.status(404).send('Not Found')
        // }
        res.send(req.user)

    }catch(error){
        res.status(400).send(error)
    }
})
app.delete('/users/me',auth,async(req,res) =>{
    try{

        await req.user.remove()
        // sendCancellationEmail(req.user.email,req.user.name)
        // const user = await User.findByIdAndDelete(req.user._id)
        // if (!user){
        //     return res.status(404).send('Not Found')
        // }
        // res.send('Deleted Successfully')
        res.send(req.user)
    }catch(error){
        res.status(500).send(error)
    }
})

app.post('/users/login',async (req,res) => {
    try{
        const user = await User.findbyCredentials(req.body.email,req.body.password)
        const token = await user.generatetoken()
        res.send({user,token})
    }catch(e){
        res.status(401).send(e)
    }
})


app.post('/users/logout',auth,async (req,res) =>{
    
    try{
        req.user.tokens = req.user.tokens.filter((token) => token.token != req.token)

        await req.user.save()
        res.send('Successfully LOGOUT')
    }
    catch(e){
        res.status(500).send(e)
    }
})

app.post('/users/logoutall',auth,async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send('LOGOUT all Successsfully')
    }catch(e){
        res.send(500).send(e)
    }
})



module.exports = app