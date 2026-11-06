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
const studioSCollection = db.collection('studios')
const bookingsCollection = db.collection('bookings')
app.post('/studio',async(req,res)=>{
    const data = req.body
    const result = await studioSCollection.insertOne(data)
    console.log(result);
    res.send(result)

})
app.get('/studios',async (req,res)=>{
    const result = await studioSCollection.find().toArray()
    res.send(result)
})

app.get('/studios/:id',async (req,res)=>{
    const{id}=req.params;
    const result = await studioSCollection.findOne({_id: new ObjectId(id)})
    res.send(result)
})

app.post("/mybooking", async (req, res) => {
  try {
    const { data, studioId } = req.body;

    const { date, startTime, endTime } = data || {};

    // Required fields validation
    if ( !date || !startTime || !endTime) {
      return res.status(400).send({
        message: "Please provide all booking information",
      });
    }

    // Check valid time range
    if (startTime >= endTime) {
      return res.status(400).send({
        message: "End time must be later than start time",
      });
    }

    // Check existing booking with overlapping time
    const existingBooking = await bookingsCollection.findOne({
      studioId: studioId,
      "data.date": date,
      "data.startTime": { $lt: endTime },
      "data.endTime": { $gt: startTime },
      status: { $in: ["Pending", "Confirmed"] },
    });

    if (existingBooking) {
      return res.status(409).send({
        message: "This studio is already booked for the selected time. Please choose another time.",
      });
    }

    // Save new booking
    const result = await bookingsCollection.insertOne(req.body);

    res.status(201).send({
      message: "Booking submitted successfully",
      result,
    });

  } catch (error) {
    console.error("Booking Error:", error);

    res.status(500).send({
      message: "Failed to create booking",
    });
  }
});
app.get('/mybooking',async(req,res)=>{
    const result = await bookingsCollection.find().toArray()
    res.send(result)
})


app.patch('/mybooking/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await bookingsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: status } }
  );

  res.send(result);
});


app.get('/',(req,res)=>{
    res.send({meassage:'server is running'})
})

app.listen(port,()=>{
    console.log(`Server is running at ${port}`);
})