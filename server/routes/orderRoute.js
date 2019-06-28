'use strict'

const controller = require('../controllers/orderController')
const JoiHapi = require('@hapi/joi');

exports.plugin = {
  register: (server, option) => {
    server.route({
      method: 'POST',
      path: '/orders',
      options: {
        auth: 'jwt',
        handler: controller.createOrder,
        tags: ['api'], // ADD THIS TAG  
        description: 'Create order by authorization',
        validate: {
          headers: JoiHapi.object().keys({
            authorization: JoiHapi.string().required()
          }).unknown(),
          payload: {
            phone: JoiHapi.string(),
            address: JoiHapi.string(),
            totalPrice: JoiHapi.number(),
            orderDetail: JoiHapi.array().items(JoiHapi.object().keys({
              productID: JoiHapi.string(),
              quantity: JoiHapi.number(),
              topping: JoiHapi.array().items(JoiHapi.string())
            }))
          }
        }
      }
    })

    server.route({
      method: 'GET',
      path: '/orders',
      options: {
        auth: 'jwt',
        handler: controller.getOrder,
        tags: ['api'], // ADD THIS TAG
        description: 'Get order by authorization',
        validate:{
          headers: JoiHapi.object().keys({
            authorization: JoiHapi.string().required()
          }).unknown()
        }
      },

    })


  },
  name: 'order'
}

