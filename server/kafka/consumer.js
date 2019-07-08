var Kafka = require("node-rdkafka");
require("dotenv").config();
//test
exports.plugin = {
  register: (server, option) => {
    var kafkaConf = {
      "group.id": "cloudkarafka-example",
      "metadata.broker.list": process.env.CLOUDKARAFKA_BROKERS.split(","),
      "socket.keepalive.enable": true,
      "security.protocol": "SASL_SSL",
      "sasl.mechanisms": "SCRAM-SHA-256",
      "sasl.username": process.env.CLOUDKARAFKA_USERNAME,
      "sasl.password": process.env.CLOUDKARAFKA_PASSWORD,
      debug: "generic,broker,security",
      "enable.partition.eof": false
    };

    const prefix = process.env.CLOUDKARAFKA_TOPIC_PREFIX;
    const topics = [`${prefix}order`];
    console.log(topics);
    const consumer = new Kafka.KafkaConsumer(kafkaConf);
    const numMessages = 5;
    let counter = 0;

    consumer.connect(console.log("abc"));

    consumer.on("error", function(err) {
      console.error(err);
    });
    consumer.on("ready", function(arg) {
      console.log(`Consumer ${arg.name} ready`);
      consumer.subscribe(topics);
      consumer.consume();
    });
    
    consumer.on("data", function(m) {
      console.log("ab");
      console.log("consumer data", m);
      counter++;
      if (counter % numMessages === 0) {
        console.log("calling commit");
        consumer.commit(m);
      }
      console.log(m.value.toString());
    });

    consumer.on("disconnected", function(arg) {
      // process.exit();
    });

    consumer.on("event.error", function(err) {
      console.error(err);
      process.exit(1);
    });

    consumer.on("event.log", function(log) {
      // console.log(log);
    });

    // setTimeout(function () {
    //   console.log("Disconect")
    //   consumer.disconnect();
    // }, 10000);
  },
  name: "Consumer"
};
