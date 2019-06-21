const models = require('../models/customerModel')
const helper = require('../helper/helper')


const createAccount = async (cusEmail, cusName, cusPassword, cusRePassword) => { //, cusAddress, cusPhone) => {
  try {
    if (!helper.checkPassword(cusPassword)) {
      return { error: "Password does not have 8 symbols" }
    }

    if (!cusPassword || cusPassword !== cusRePassword) {
      return { error: "Password does not match rePassword" }
    }

    if (!helper.checkEmail(cusEmail)) {
      return { error: "Email is not valid" }
    }

    if (await models.findEmail(cusEmail) !== null) {
      return { err: "Email was registed" }
    }

    const cusPasswordHashed = await helper.hashPassword(cusPassword);

    return await models.createAccount(cusEmail, cusName, cusPasswordHashed) //, cusAddress, cusPhone)

  } catch (error) {
    console.log(error)
    return error;
  }
};

const getAllCustomers = async () => {
  return await models.getAllCustomers()
}

const getCustomer = async (cusEmail, cusPassword) => {
  try {
    if (!helper.checkPassword(cusPassword)) {
      return { error: "Password does not have 8 symbols" }
    }

    if (!helper.checkEmail(cusEmail)) {
      return { error: "Email is not valid" }
    }

    //const cusPasswordHashed = await helper.hashPassword(cusPassword)

    return await models.getCustomer(cusEmail, cusPassword)
  } catch (error) {
    console.log(error)
    return error;
  }
}

const updateAccount = async (id, cusName, cusPassword) => {
  try {
    if (!helper.checkPassword(cusPassword)) {
      return { error: "Password does not have 8 symbols" }
    }
    const cusPasswordHashed = await helper.hashPassword(cusPassword);
    return await models.findEmailAndUpdate(id, cusName, cusPasswordHashed)
  } catch (error) {
    console.log(error)
    return error;
  }
}

module.exports = {
  createAccount,
  getAllCustomers,
  getCustomer,
  updateAccount
}