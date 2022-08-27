const express = require("express");
const {createProxyMiddleware}  = require("http-proxy-middleware");
const app = express();
const eurekaHelper = require('./api-gateway_eureka_client');
const {
    BOOK_API_URL,
    CUSTOMER_API_URL,
    ORDER_API_URL,
  } = require("./URLs");


app.use(
    '/',
    createProxyMiddleware({
      target: 'http://localhost',
      router:{
        // endpoints Books
        "/books":BOOK_API_URL,
        "/book":"http://localhost:3000",
        "book/:id":"http://localhost:3000",
        // endpoints customer
        "/customers":CUSTOMER_API_URL,
        "/customer":"http://localhost:4000",
        "/customer/:id":"http://localhost:4000",
        // endpoint orders
        "/orders":ORDER_API_URL,
        "/order":"http://localhost:5000",
        "/order/:id":"http://localhost:5000",
      },
      changeOrigin: true,
    })
  );

const port = process.env.PORT || 6000;
app.listen(port, () => console.log(`Api-Gateway app listening on port ${port}!`));

// Eureka client Registration to set Adress
eurekaHelper.registerWithEureka('api-gateway-service', port);