const Kafka = require("node-rdkafka");
const Joi = require("@hapi/joi");
require("dotenv").config();
const orderModel = require('../models/orderModel')

const kafkaConf = {
  "group.id": "cloudkarafka-order",
  "metadata.broker.list": process.env.CLOUDKARAFKA_BROKERS.split(","),
  "socket.keepalive.enable": true,
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "SCRAM-SHA-256",
  "sasl.username": process.env.CLOUDKARAFKA_USERNAME,
  "sasl.password": process.env.CLOUDKARAFKA_PASSWORD,
  dr_cb: true,
  debug: "generic,broker,security"
};

const prefix = process.env.CLOUDKARAFKA_TOPIC_PREFIX;
const topic = `${prefix}abc`;

const sendMessage = async (message) => {
  try {
    const messageBuffer = Buffer.from(
      JSON.stringify({
        orderID: message,
        statusMes: "Processed"
      })
    );
    producer.produce(topic, -1, messageBuffer, 2)
    // setTimeout(() => producer.disconnect(), 0);
  } catch (err) {
    console.error(err);
  }
  // return "Message sent successfully!";
};

const producer = new Kafka.Producer(kafkaConf);

producer.connect();

producer.on("ready", function (arg) {
  console.log(`producer ${arg.name} ready.`);
})

producer.on("error", function (err) {
  console.error(err);
  process.exit(1);
});

producer.on("event.error", function (event) {
  console.error(event);
  process.exit(1);
});

producer.on("event.stats", function (envent) {
  console.error(envent);
  process.exit(1);
});

producer.on("event.log", function (log) {
  // console.log(log);
});

producer.on("disconnected", function (arg) {
  // process.exit();
});

module.exports = {
  sendMessage
};
