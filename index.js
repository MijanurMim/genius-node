const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// MiddleWare
app.use(cors());
app.use(express.json());

// MongoDb connection with env
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kin6o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// mongoDb connection
async function run() {
  try {
    await client.connect();
    const database = client.db("carMechanic");
    const servicesCollection = database.collection("services");

    // GET ALL DATA API
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // GET SINGLE DATA API
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specifiq service");
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });

    // POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hitted the post API", service);
      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });

    // DELETE API
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("deleting specifiq service");
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });

    // checking the connection
    console.log("connected to database");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Genius server");
});

app.get("/hello", (req, res) => {
  console.log("hello updated here");
});

app.listen(port, () => {
  // checking the port connection
  console.log("running genius server on port ", port);
});

/*
one time : 
1. heroku account open 
2. heroku software install 
3. 


Every Projects:
1. git init
2. git ignore (nodemodules , env)
3. push everything to git 
4. make sure u have this script : "start": "node index.js",
5. make sure : process.env.PORT infront of your port 
6. heroku login
7. heroku create (one time for a project)
8. command : git push heroku main
-------------

update: 

1.save everything check locally
2. git add,commit,push
3. git push heroku main



*/
