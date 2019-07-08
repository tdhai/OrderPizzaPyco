var Kafka = require("node-rdkafka");
require("dotenv").config();
const orderModel = require('../models/orderModel');
// console.log("consumer out side", orderModel)

// exports.plugin = {
//   register: (server, option) => {
var kafkaConf = {
    "group.id": "cloudkarafka-update",
    "metadata.broker.list": process.env.CLOUDKARAFKA_BROKERS.split(","),
    "socket.keepalive.enable": true,
    "security.protocol": "SASL_SSL",
    "sasl.mechanisms": "SCRAM-SHA-256",
    "sasl.username": process.env.CLOUDKARAFKA_USERNAME,
    "sasl.password": process.env.CLOUDKARAFKA_PASSWORD,
    debug: "generic,broker,security",
    "enable.auto.commit": true,
    "enable.partition.eof": false
};

const prefix = process.env.CLOUDKARAFKA_TOPIC_PREFIX;
const topics = [`${prefix}abc`];
// console.log(topics);
const consumer = new Kafka.KafkaConsumer(kafkaConf);
const numMessages = 1000;
let counter = 0;


consumer.on("error", function (err) {
    console.error(err);
});
consumer.on("ready", function (arg) {
    console.log(`Consumer ${arg.name} ready`);
    consumer.subscribe(topics);
    consumer.consume();
});

consumer.on("data", async function (m) {
    // console.log("consumer data", m);
    //   counter++;
    //   if (counter % numMessages === 0) {
    //     // console.log("calling commit");
    //     consumer.commit(m);
    //   }
    try {
        const message = JSON.parse(m.value.toString())
        const result = await orderModel.updateStatusOrder(message)
    
        // console.log(result)
        return await result
    } catch (err) {
        throw err
    }
})

consumer.on("disconnected", function (arg) {
    // process.exit();
});

consumer.on("event.error", function (err) {
    console.error(err);
    process.exit(1);
});

consumer.on("event", function (log) {
    console.log(log);
});

// setTimeout(function () {
//   console.log("Disconect")
//   consumer.disconnect();
// }, 10000);
consumer.connect(console.log("consumer connected"));
//   },
//   name: "Consumer"
// };
