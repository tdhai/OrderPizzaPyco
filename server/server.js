"use strict";
require("dotenv").config();
const Hapi = require("@hapi/hapi");
const mongoose = require("mongoose");
const model = require("./models/customerModel");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");

const server = new Hapi.Server({
  host: "localhost",
  // port: 3000,
  port: process.env.PORT,
  routes: {
    cors: true
  }
});

server.app.db = mongoose.connect(
  // 'mongodb://localhost/pizza',
  "mongodb+srv://hai1405:hai1405@pizza-apifw.mongodb.net/pizza?retryWrites=true&w=majority",
  { useNewUrlParser: true, useCreateIndex: true }
);

const validate = async function (decoded, request) {
  if (!model.findCustomerByID(decoded.data)) {
    return [{ isValid: false }];
  }
  return { isValid: true };
};

const swaggerOptions = {
  info: {
    title: "Test API Documentation"
  }
};

const init = async () => {
  await server.register([{ plugin: require("hapi-auth-jwt2") }]);

  server.auth.strategy("jwt", "jwt", {
    key: "abcd", // Never Share your secret key
    validate: validate, // validate function defined above
    verifyOptions: { algorithms: ["HS256"] } // pick a strong algorithm
  });
  await server.register([
    { plugin: require("./routes/customerRoute") },

    { plugin: require("./routes/productRoute") },
    { plugin: require("./routes/categoryRoute") },
    { plugin: require("./routes/toppingRoute") },
    { plugin: require("./routes/orderRoute") },
    // { plugin: require("./kafka/consumer") },
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }
  ]);
  await server.start();
  require('./kafka/consumer')
  console.log(`Server running at: ${server.info.uri}`);
  // console.log("started");
};

init();
