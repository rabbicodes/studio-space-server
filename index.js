import express, { application } from 'express'
import 'dotenv/config'
import cors from 'cors'
const app = express()
const port = 8000;
app.use(cors())
app.use(express.json())

import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URL);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}


const mongoClient = await connectToMongoDB()
const db = mongoClient.db('studio-space')
const studionCollection = db.collection('studios')

app.post('/studio',async(req,res)=>{
    const data = req.body
    const result = await studionCollection.insertOne(data)
    console.log(result);
    res.send(result)

})
app.get('/studios',async (req,res)=>{
    const result = await studionCollection.find().toArray()
    res.send(result)
})

app.get('/studios/:id',async (req,res)=>{
    const{id}=req.params;
    const result = await studionCollection.findOne({_id: new ObjectId(id)})
    res.send(result)
})

app.get('/',(req,res)=>{
    res.send({meassage:'server is running'})
})

app.listen(port,()=>{
    console.log(`Server is running at ${port}`);
})