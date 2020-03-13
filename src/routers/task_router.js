const Task = require('../models/Task.js')
const express = require('express')
const auth = require('../middleware/auth.js')
const app = new express.Router()

app.post('/tasks',auth,async (req,res)=>{

    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner:req.user._id

    })

    try{
        await task.save()
        res.status(201).send('Created New Task \n'+task)
    }
    catch(error){
        res.status(400).send('Unable to create New task \n'+error.message)
    }

    // const task = new Task(req.body)
    // task.save().then((result) =>{
    //     res.status(201).send('Created New Task \n'+task)
    // }).catch((error)=>{
    //     res.status(400).send('Unable to create New task \n'+error.message)
    // })

})







// app.get('/tasks/:completed',(req,res)=>{
//     const completed= req.params.completed

//     Task.find({completed}).then((tasks)=>{
//         if(!tasks){
//             return res.status(404).send('not found')
//         }
//         res.send(tasks)
//     }).catch((error)=>{
//         res.status(500).send('Unable to connect \n',error)
//     })
// })

//GET /tasks?completed=true
//GET /tasks?limit=2?&skip=1
//GET /tasks?sortBy=createdAt:desc     //_asc
app.get('/tasks',auth,async (req,res)=>{
    const match ={}
    const sort ={}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if (req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] == 'desc' ? -1:1
    }
    try{
        // const tasks = await Task.find({owner:req.user._id})
        // res.send(tasks)
        //   OR
        await req.user.populate({
          path:  'tasks',
          match,
          options:{
              limit:parseInt(req.query.limit),
              skip:parseInt(req.query.skip),
              sort
          }
        }).execPopulate()
        res.send(req.user.tasks)
    }
    catch(error){
        res.status(500).send('Unable to connect \n',error)
    }
    // Task.find().then((tasks)=>{
    //     res.send(tasks)
    // }).catch((error)=>{
    //     res.status(500).send('Unable to connect \n',error)
    // })
})



app.get('/tasks/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id,owner:req.user._id})
    // const task = await Task.findById(_id)
        if(!task){
            return res.status(404).send('not found')
        }
        res.send(task)
    }
    catch(error){
        res.send(500).send('Unable to connect \n',error)
    }
})





app.delete('/tasks/:id',auth,async(req,res) =>{
    try{
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if (!task){
            return res.status(404).send('Not Found')
        }
        res.send('Deleted Successfully')
    }catch(error){
        res.status(500).send(error)
    }
})

app.patch('/tasks/:id',auth,async (req,res) =>{
    const allowed_updates = ['completed','description']
    const updates = Object.keys(req.body)
    const valid = updates.every((update) => allowed_updates.includes(update))
    if (!valid){
        return res.status(400).send("Invalid Update Property")
    }

    try{
        // const task = await Task.findById(req.params.id)
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
        
        // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if (!task){
            return res.send(404).send('Not Found')
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
            res.send(task)
    }catch(error){
        res.send(400).send(error)
    }
})










module.exports = app