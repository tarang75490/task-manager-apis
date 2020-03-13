const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User_schema = new mongoose.Schema({
    name :{
        type:String,
        required:true,
        trim:true
    },
    age:{
        type:Number,
        validate(value){
            if(value<0){
                throw new Error('Age Should be greater than 0')
            }
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if (!validator.isEmail(value))
            {
                throw new Error('Email not valid')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            // if(value.length <6) {
            //     throw new Error('Password is too short ')
            // }
            if(((value.toLowerCase()).includes('password'))){
                throw new Error("password can't be included in Password field")
            }

        }
    },
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }],
    avatar:{
        type:Buffer,
    }

},{
    timestamps:true
})

// virtual property: is a property which is not going to be stored in  database but it is used to link make reference

User_schema.virtual('tasks',{
    ref:'task',
    localField:'_id',
    foreignField:'owner'
})



// NOTE : no arrow function  (this keyword is used)
User_schema.methods.generatetoken = async function () {
    const user = this   
    const token = await jwt.sign({_id:user._id.toString() },process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}


User_schema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}


// method        ----->         for particular instances
// statics         ------>          for models



User_schema.statics.findbyCredentials = async (email,password) => {
    const user = await  User.findOne({email})

    if (!user){
        throw new Error('Invalid user')
    }
    
    const isMatch =  await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Unable to Login')
    }
    return user
}



// pre(before an event) or post(after an event)
// can't use arrow fuction because this binding will be needed
// middleware
User_schema.pre('save',async function (next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    
    
    next() // to  end up this asynchronous function and to move to next otherwise will be hanged waiting for to complete
})


// cascading delete the tast when user is deleted
const Task = require('./Task.js')
User_schema.pre('remove',async function(next){
    const user = this
    await Task.deleteMany({owner:user._id}) 
    next()
})




const User = mongoose.model('User',User_schema)


module.exports = User


// const me  =  new User({
//     name:' Tarang',
//     age:21,
//     email:'taRANg111@gmail.com      ',
//     password:'tarang75490'
// })
// me.save().then((result) =>{
//     console.log(me)
// }).catch((error) =>{
//     console.log('Error')
//     console.log(error)
// })