// Load Express
const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const eurekaHelper = require('./book_eureka_client');
const client = require('prom-client');
//Load mongoose
const mongoose = require("mongoose")
require("dotenv").config();
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());


// model Book in const Book
require("./Book.model")
const Book = mongoose.model("Book")
const url = process.env.MONGO_URL || "mongodb+srv://<User>:<Password>@microservicebook.2ue2p.mongodb.net/?retryWrites=true&w=majority";
//connect

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection established with Book");
  })
  .catch(() => {
    console.log("Connection failed");
  });

app.get('/', (req, res) => {
    res.send("This is Book Service")
});

// Create functionilty
app.post("/book", (req, res) => {
    // create new Book
    const book = new Book(req.body)
    // save func from mongoose 
    book
    .save()
    .then((data) =>{
        res.status(200).send(data)
    }).catch((err) => {
        res.status(400).send(err)
    })
});

app.get("/books", (req, res) => {
  Book.find()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.get("/book/:id", (req, res) => {
  Book.findById(req.params.id)
    .then((book) => {
      if (book) {
        res.status(200).send(book);
      } else {
        res.status(404).send("No such book found");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.delete("/book/:id", (req, res) => {
  Book.findByIdAndDelete(req.params.id)
    .then((book) => {
      if (book) {
        res.status(200).send(book);
      } else {
        res.status(404).send("No book found");
      }
    })
    .catch((err) => res.status(400).send(err));
});

//const port = process.env.PORT || 3000;
app.listen(3000, () => {
    console.log("Up and running books service");
})

// Eureka client Registration to set Adress
eurekaHelper.registerWithEureka('book-service', 3000);

// Prometheus metric for Monitoring
const register = new client.Registry();
client.collectDefaultMetrics({register});

// Call localhost:port/metrics to see monitoring
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
});