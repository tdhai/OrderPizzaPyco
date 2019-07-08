const service = require('../services/orderService')
const helper = require('../helper/helper')

const createOrder = async (req, h) => {
  try {
    customerID = req.auth.credentials.data
    address = req.payload.address
    phone = req.payload.phone
    date = Date.now()
    totalPrice = req.payload.totalPrice
    orderDetail = req.payload.orderDetail
    status = req.payload.status
    notice = req.payload.notice
    // console.log(orderDetail)
    return await service.createOrder(customerID, address, phone, date, totalPrice, notice, orderDetail, status, h)
  } catch (err) {
    throw ("create order fail CONTROLLER", err)
  }
}

const getOrder = async (req, h) => {
  try {
    const customerID = req.auth.credentials.data
    return await service.getOrder(customerID)
  } catch (err) {
    throw ("get order fail CONTROLLER", err)
  }
}

const bestSeller = async (req, h) => {
  try {
    const bestSeller = await service.bestSeller();
    if (!bestSeller) {
      return { err: "Do not have best seller,, because I do not order" }
    } return bestSeller
  } catch (err) {
    throw err
  }
}

module.exports = {
  createOrder,
  getOrder,
  bestSeller
}