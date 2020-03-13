const express = require('express')
require('./db/mongoose.js')
const User = require('./models/User.js')
const Task = require('./models/Task.js')
const task_router = require('./routers/task_router.js')
const user_router = require('./routers/user_router.js')
const app = express()
const port = process.env.PORT


// MiddleWare Function
// app.use((req,res,next) => {
//     if (req.method == 'GET')
//     {
//         return    res.send("Get Request Disabled")
//     }

//     next()
// })


// app.use((req,res,next) =>{
//     return res.status(503).send("Site is Under Maintanence\n Currently the site is down .Check Back Soon")
// })




app.use(express.json())
// to parce the upcomming json data 

const router = new express.Router()

router.get('/test',(req,res)=>{
    res.send('from other routher')
})

app.use(router)
app.use(task_router)
app.use(user_router)



app.listen(port,()=>{
    console.log('Connected Successfully to port '+port)
})

const bcrypt = require('bcrypt')

// password='Tarang75490'
// bcrypt.hash(password,8).then((data)=>{
//     console.log(data)
// })

// const bcrypt_fun = async () => {
//     const password='Tarang75490'
//     const hashed_password = await bcrypt.hash(password,8)
//     console.log(password)
//     console.log(hashed_password)

//     in_password = "Tarang75490"
//     const is_match = await bcrypt.compare(in_password,hashed_password)
//     console.log(is_match)
// }

// bcrypt_fun()


// hashing
// tarang75490 --> baskhbdjbbsddasbddsa
// * uni-directional
// * irreversible


// encryption
// tarang75490 --> asfasffasdfdafafsfdvsdfsdv -->  tarang75490
// * bidirectional
// * reversible



// const jwt = require('jsonwebtoken')

// const jwt_function = async () => {
    
//     const token = jwt.sign({_id:'abc123'},"thisismyprivatekey",{expiresIn:'7 days'})
//     console.log(token)


//     const data = jwt.verify(token,'thisismyprivatekey')
//     console.log(data)

// }


// jwt_function()

// token :
// base64encoded JSON Striing (meta data + algo ) Headers
// base64encoded JSON Striing (data that we have provided if.e Headers,_id ) payload
// base64encoded JSON Striing (to verify the token later on) signature   



// modifying data(object) before return

// const myself = { name : "Tarang" , sports:"Badminton"}

// myself.toJSON = function(){
//     console.log(this)    //
//     delete this.name     // --->modifying 
//     return this          //
// }

// console.log(JSON.stringify(myself))




// Setting Up relationships

// const main = async() =>{
//     const task = await Task.findById('5e5bd11acf565a43a0e9a3e5')
//     await task.populate('owner').execPopulate()
//     console.log(task.owner)


//     const user = await User.findById('5e5bd10ccf565a43a0e9a3e3')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }


// main()

// const multer = require('multer')
// const upload =multer({
//     dest:'images',
//         limits:{
//             fileSize:100000
//         },
//         fileFilter(req,file,cb){
//             if(!file.originalname.match('/\.(doc|docx)$/')){
//                 return cb(new Error('please upload a word document'))
//             }
//             cb(undefined,true)
//         }
// })
// app.post('/upload',upload.single('upload'),(req,res)=>{
//     res.send('uploaded')
// })
