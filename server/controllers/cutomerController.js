const service = require("../services/customerService");
const models = require("../models/customerModel");
const producer = require("../kafka/producer");
const consumer = require("../kafka/consumer");

const createAccount = async (req, h) => {
  try {
    const cusName = req.payload.name;
    const cusEmail = req.payload.email;
    const cusPassword = req.payload.password;
    const cusRePassword = req.payload.rePassword;
    return await service.createAccount(
      cusEmail,
      cusName,
      cusPassword,
      cusRePassword
    );
  } catch (err) {
    return "create account fail CONTROLLER", err;
  }
};

const getAllCustomers = async (req, h) => {
  try {
    return service.getAllCustomers();
  } catch (err) {
    return "get all customer fail CONTROLLER", err;
  }
};

const login = async (req, h) => {
  try {
    // const a = req.payload.email;
    // await producer.send(a)
    // await consumer

    // producer.sendMessage();

    const cusEmail = req.payload.email;
    const cusPassword = req.payload.password;

    return await service.login(cusEmail, cusPassword);
  } catch (err) {
    throw err;
  }
};

const getCustomer = async (req, h) => {
  try {
    const customerID = req.params.id;
    return await service.getCustomer(customerID);
  } catch (err) {
    return "get customer fail CONTROLLER", err;
  }
};

const updateName = async (req, h) => {
  try {
    const cusName = req.payload.name;
    const id = req.auth.credentials.data;
    console.log(id, cusName);
    return await service.updateName(id, cusName);
  } catch (err) {
    return "update account fail CONTROLLER", err;
  }
};

const updatePassword = async (req, h) => {
  try {
    console.log("abc");
    const passwordNew = req.payload.passwordNew;
    const rePasswordNew = req.payload.rePasswordNew;
    const passwordOld = req.payload.passwordOld;
    const id = req.auth.credentials.data;
    return await service.updatePassword(
      id,
      passwordOld,
      passwordNew,
      rePasswordNew
    );
  } catch (err) {
    return "update account fail CONTROLLER", err;
  }
};

module.exports = {
  createAccount,
  getAllCustomers,
  login,
  updateName,
  updatePassword,
  getCustomer
};
