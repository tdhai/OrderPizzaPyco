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
            phone: JoiHapi.string().required().max(10),
            address: JoiHapi.string().required(),
            totalPrice: JoiHapi.number().required(),
            notice: JoiHapi.string().max(500),
            status: JoiHapi.string().valid(["Processing"]),
            orderDetail: JoiHapi.array().items(JoiHapi.object().keys({
              productID: JoiHapi.string().required(),
              size: JoiHapi.string().required(),
              type: JoiHapi.string().required(),
              quantity: JoiHapi.number().required(),
              topping: JoiHapi.array().items(JoiHapi.string())
            }))
          }

          , failAction: (req, h, error) => {
            console.log(error.details[0]);
            return error.isJoi
              ? h.response({ message: error.details[0].message }).code(400).takeover()
              : h.response(error).code(500).takeover();
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
        validate: {
          headers: JoiHapi.object().keys({
            authorization: JoiHapi.string().required()
          }).unknown()
        }
      },
    })

    server.route({
      method: 'GET',
      path: '/categories/bestseller',
      options: {
        handler: controller.bestSeller,
        tags: ['api']
      }
    })

  },
  name: 'order'
}

