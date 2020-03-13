const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID
 
// Connection URL
const connectionurl = 'mongodb://127.0.0.1:27017'
 
// Database Name
const dbName = 'task-manager'

const id = new ObjectID()
console.log(id.getTimestamp())

// Use connect method to connect to the server
MongoClient.connect(connectionurl,{useNewUrlParser:true}, function(error, client) {
  
    if (error){
        return    console.log('Unable to connect with database')
    }

    // console.log('Connected successfully to Mongo Database')
    const db = client.db(dbName)

    // db.collection('tasks').findOne({_id : new ObjectID("5e55543cc78cb83be077889b")},(error,user) => {
    //     if (error){
    //         return    console.log('Unable to fetch')
    //     }
    //     console.log(user)
    // })
    // db.collection('tasks').find({completed:false}).toArray((error,tasks)=>{
    //     if (error){
    //         return console.log('unable to fetch')
    //     }

    //     console.log(tasks)
    // })
    // db.collection('tasks').find({completed:false}).count((error,count)=>{
    //     if (error){
    //         return console.log('unable to fetch')
    //     }

    //     console.log(count)
    // })

    // db.collection('Users').updateOne({name :'Andrew'},{
    //     $set : {
    //     name:"Holi"
    // }},(error,result) =>{
    //     if (error){
    //        return console.log('Unable to update')
    //     }
    //     console.log(result.result)
    // })
    //using callback function



    // using promises

    // const UpdatePromise = db.collection('Users').updateOne({_id: new ObjectID("5e553bc8fbe4e3473ccd34ba")},{
    //     $set:{
    //         name:"Taaddd"
    //     }
    // })
    db.collection('Users').updateOne({name:"zaid11"},{
        $inc:{
            age:-3
        }
    }).then((result)=>{
        console.log(result)
    }).catch((error) =>{
        console.log(error)
    })
    // db.collection('tasks').updateMany({completed:true},{
    //     $set:{
    //         completed:false
    //     }
    // }).then((result) =>{
    //     console.log(result.modifiedCount)
        
    // }).then((error) =>{
    //     console.log(error)
    // })


    // db.collection('Users').deleteOne({ age :21 }).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // }
    // )

    db.collection('Users').insertMany([
        {
            name:"Tarang75490",
            age:21
        },
    {
        name:"sakshi",
        age:21
    }]).then((result) =>{
        console.log(result.ops)
    }).catch((error)=>{
        console.log(error)
    })
    


})