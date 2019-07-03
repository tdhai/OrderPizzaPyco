const model = require('../models/orderModel')
const helper = require('../helper/helper')
const productModel = require('../models/productModel')
const toppingModel = require('../models/toppingModel')

const createOrder = async (customerID, address, phone, date, totalPrice, notice, orderDetails, h) => {
  try {
    if (!helper.checkPhone(phone)) {
      return "Phone number wrong"
    }

    var totalPriceAllTopping = 0
    var totalPriceAllProduct = 0

    for (var i = 0; i < orderDetails.length; i++) {
      if (!productModel.getProduct(orderDetails[i].productID)){
        return await err
      }

      let totalPriceProduct = await model.totalPriceProduct(orderDetails[i].productID, orderDetails[i].size, orderDetails[i].type, orderDetails[i].quantity)
      let totalPriceTopping = await model.totalPriceTopping(orderDetails[i].topping)
      totalPriceAllTopping += totalPriceTopping
      totalPriceAllProduct += totalPriceProduct
    }
    let totalPriceServer = totalPriceAllTopping + totalPriceAllProduct
    if (totalPrice !== totalPriceServer) {
      return { err: "Total price server: " + totalPriceServer + ". \n Total price clien wrong(ProductID or ToppingID is not valid)!!!" }
    }
    return await model.createOrder(customerID, address, phone, date, totalPrice, notice, orderDetails)
  } catch (err) {
    throw ("create order fail SERVICE", err)
  }
}

const getOrder = async (customerID) => {
  try {
    return await model.getOrder(customerID)
  } catch (err) {
    throw ("get order fail SERVICE", err)
  }
}

const bestSeller = async() =>{
  try{
    return await model.bestseller()
  }catch(err){
    throw ("best seller fail SERVICE", err)
  }
}

module.exports = {
  createOrder,
  getOrder,
  bestSeller
}