
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors= require('cors')
const app = express()
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors())
//pet-shop
// e9v17hefgi1dlsJC




const uri = "mongodb+srv://pet-shop:e9v17hefgi1dlsJC@cluster0.nxcosv7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const petCollection = client.db('petShop').collection('pets')
    const userCollection = client.db('petShop').collection('users')

// post featured data
app.post('/pets', async(req,res)=>{
    const formData = req.body;
    const result = await petCollection.insertOne(formData)
    // console.log(result);
    res.send(result)
})


// get feature data
app.get('/pets', async(req,res)=>{
    const result= await petCollection.find().toArray();
    res.send(result)
})

// feature delete
app.delete('/pets/:id', async(req,res)=>{
    const id = req.params.id;
    const query = {_id : new ObjectId(id)};
    const result = await petCollection.deleteOne(query);
    res.send(result)
})


// edit feature data
app.patch('/pets/:id', async(req,res)=>{
  const id = req.params.id;
  const query={_id: new ObjectId(id)};
  const updatedData=req.body;
  const result =await petCollection.updateOne(query, {$set: updatedData})
  console.log(result);
  res.send(result)
})

// get single data
app.get('/pets/:id', async(req,res)=>{
  const id = req.params.id
  const  query = {_id: new ObjectId(id)}
  const result = await petCollection.findOne(query);
  res.send(result)
})


// user data
app.put('/user/:email', async(req,res)=>{
  const email= req.params.email;
  const user =req.body;
  console.log({user})
  const filter = {email: email};
  const options = { upsert: true };
  const updateDoc = {
    $set: {
      email : user.email,
      photo: user.photoURL,
      name : user.displayName,
    },
  };
  const result = await userCollection.updateOne(filter, updateDoc, options);
  res.send(result)
})

// get update user data
app.get('/user/update/:id', async(req,res)=>{
  const id = req.params.id;
  const result = await userCollection.findOne({_id: new ObjectId(id)})
  res.send(result)
})

// get user data

app.get('/user/:email', async(req,res)=>{
  const email = req.params.email;
  const result = await userCollection.findOne({email})
  res.send(result)
})


// patch updated data
app.patch('/user/:email', async(req,res)=>{
  const email = req.params.email;
  const userData= req.body;
  

  const result = await userCollection.updateOne({email}, {$set: userData}, {upsert:true});
  res.send(result)
    
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})