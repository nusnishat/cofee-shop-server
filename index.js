const express = require("express");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors());
app.use(express.json());

//cMU6V717gTe5D0Un
//coffee-shop
const uri = "mongodb+srv://coffee-shop:cMU6V717gTe5D0Un@cluster0.richl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    //db
    const database = client.db("coffeeDb");
    const coffeeCollection = database.collection("coffeeCollection");

    //get
    app.get("/coffees", async(req, res)=>{
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

     //get
     app.get("/coffees/:id", async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.findOne(query);

      res.send(result);
    })

    //put
    app.put("/coffees/:id", async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updateCoffee = req.body;
      const coffee = {
        $set:{
          name:updateCoffee.name,
          price:updateCoffee.price,
          details:updateCoffee.details,
          photo:updateCoffee.photo

        }
      }
      const result = await coffeeCollection.updateOne(filter, coffee, options)
      res.send(result);
    })

    //post
    app.post('/coffees', async (req, res) => {
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    app.delete('/coffees/:id', async(req, res)=>{
      const id = req.params.id;
      console.log(id)
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.deleteOne(query);
 
      res.send(result);
    })

    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('coffee server running');
})


app.listen(port,()=>{
    console.log(`running on port ${port}`);
})