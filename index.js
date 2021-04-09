const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config();
const ObjectId = require('mongodb').ObjectID;
const port = process.env.PORT ||5010;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ntps2.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("shodai").collection("products");
  console.log(productsCollection)

  app.get("/getProducts", (req, res) => {
      productsCollection.find()
      .toArray((err, items) => {
          res.send(items);
      })
  })

  app.get("/checkout/:pId", (req,res) => {
    productsCollection.find({"_id":ObjectId(req.params.pId)})
    .toArray((err, newProducts) => {
        res.send(newProducts[0]);
    })
  })

  app.delete("/deleteProduct/:id", (req, res) => {
    productsCollection.deleteOne({"_id":ObjectId(req.params.id)})
    .then(result => res.send(result.deletedCount > 0))
  })

  app.post('/products', (req, res) => {
      const newProduct = req.body;
      productsCollection.insertOne(newProduct)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
      console.log('adding new events', newProduct);
  })
//   client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})