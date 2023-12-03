require('dotenv').config()
const express = require('express');
const app = express()
const cors = require('cors')
const { MongoClient } = require('mongodb');
const mongoURL = process.env.MONGO_URI
const client = new MongoClient(mongoURL)
let collection;
app.use(cors())
app.use(express.json());

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
client.connect()
.then(()=>{
    const db = client.db("test");
    collection = db.collection("spot-diff")
})
.then(async ()=>{
    app.listen(process.env.PORT,  ()=>{
        console.log("Connected to db & Listening on Port", process.env.PORT);
    })
})
.catch((error)=>{
    console.log(error);
})


app.post("/spotdiff", async (req, res)=>{
    // await sleep(2000) 
    const diff = req.body.data;
    const images = await collection.find({diff:diff}).toArray((err, document)=>{
        return document
    });
    res.json(images)
})

// client.db().collection('spot-diff')