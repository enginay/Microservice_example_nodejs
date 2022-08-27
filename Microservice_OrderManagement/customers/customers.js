const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
const eurekaHelper = require('./customer_eureka_client');
const client = require('prom-client');
require("dotenv").config();
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

require("./Customer.model");
const Customer = mongoose.model("Customers");
const url = process.env.MONGO_URL || "mongodb+srv://<User>:<Password>@microservicecustomer.nyapi.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection established with CustomerService");
  })
  .catch(() => {
    console.log("Connection failed");
  });

app.get("/", (req, res) => {
  res.send("This is customer service");
});

// Create Customer
app.post("/customer", (req, res) => {
  const customer = new Customer(req.body);
  customer
    .save()
    .then((data) => {
      if (data) {
        res.status(200).send(data);
      } else {
        res.status(400).send("Something went wrong");
      }
    })
    .catch((err) => {
      res.send(err.message);
    });
});

// Get all Customers
app.get("/customers", (req, res) => {
  Customer.find()
    .then((customers) => {
      if (customers) {
        res.status(200).send(customers);
      } else {
        res.status(404).send("No customers found");
      }
    })
    .catch((err) => res.send(err.message));
});

// Get Customer by Id
app.get("/customer/:id", (req, res) => {
  Customer.findById(req.params.id)
    .then((customer) => {
      if (customer) {
        res.status(200).send(customer);
      } else {
        res.status(404).send("No customer found");
      }
    })
    .catch((err) => res.send(err.message));
});


// Delete specific Customer by Id
app.delete("/customer/:id", (req, res) => {
  Customer.findByIdAndDelete(req.params.id)
    .then((customer) => {
      if (customer) {
        res.status(200).send(customer);
      } else {
        res.status(404).send("No customer found");
      }
    })
    .catch((err) => res.send(err.message));
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
  console.log("Up and running customer service");
});

// Eureka client Registration to set Adress
eurekaHelper.registerWithEureka('customer-service', port);

// Prometheus metric for Monitoring
const register = new client.Registry();
client.collectDefaultMetrics({register});

app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
});