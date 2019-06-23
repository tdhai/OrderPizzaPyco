'use strict'

const Hapi = require('@hapi/hapi')
const mongoose = require('mongoose')
const model = require('./models/customerModel')


const server = new Hapi.Server({
  host: 'localhost',
  port: 3000,
  routes: {
    cors: true
  }
})

server.app.db = mongoose.connect(
  'mongodb://localhost/pizza',
  { useNewUrlParser: true }
)

const validate = async function (decoded, request) {
  if (!model.findEmailByID(decoded.data)) {
    return { isValid: false };
  } return { isValid: true }
  // else {
  //   return { isValid: false };
  // }
  // console.log(decoded)
  // try {
  //   return await decoded.data
  // } catch (error) {
  //   console.log(error)
  //   return error
  // }

};

const init = async () => {
  await server
    .register([

      { plugin: require('hapi-auth-jwt2') }

    ]);

  server.auth.strategy('jwt', 'jwt',
    {
      key: 'abcd',          // Never Share your secret key
      validate: validate,            // validate function defined above
      verifyOptions: { algorithms: ['HS256'] } // pick a strong algorithm
    });
  await server.register([
    { plugin: require('./routes/customerRoute') },

    { plugin: require('./routes/productRoute') },
    { plugin: require('./routes/categoryRoute') },
    { plugin: require('./routes/toppingRoute') },
    { plugin: require('./routes/orderRoute') }
  ])
  // await console.log(validate)
  // server.auth.default('jwt');

  // await Promise.all()
  // .catch(err => {
  //   console.log(err);
  // })
  await server.start()
  console.log(`Server running at: ${server.info.uri}`)
  // console.log("started");
}

init();

