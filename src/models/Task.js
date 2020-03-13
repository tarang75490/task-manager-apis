const mongoose = require('mongoose')

const task_schema = new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true,
    },
    completed:{
        type:Boolean,
        default:false,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref :'User'
    }
},{
    timestamps:true
})
const task = mongoose.model('task',task_schema)


// const task1 = new task({
//     description:'Set Up Goal2',
// })

// task1.save().then((result) => {
//     console.log(result)
// }).catch((error) =>{
//     console.log(error)
// })


module.exports = task