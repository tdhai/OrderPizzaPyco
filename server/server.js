'use strict'

const Hapi = require('@hapi/hapi')
const mongoose = require('mongoose')

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

const init = async () => {
  await server
    .register([
      {plugin :require('./routes/Customer/CustomerRoutes')}
    ],
    )
    .catch(err => {
      console.log(err);
    })
  await server.start()
  console.log(`Server running at: ${server.info.uri}`)
  // console.log("started");
}

init();