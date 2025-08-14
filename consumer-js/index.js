const amqp = require("amqplib");

const queue = "hello";

(async function () {
  try {
    // open connection
    const connection = await amqp.connect(
      "amqp://guest:guest@localhost:5672/",
      {}
    );
    // open channel
    const channel = await connection.createChannel();
    // connect channel to queue
    await channel.assertQueue(queue, { durable: false });
    // consume messege from queue
    channel.consume(queue, msg => {
      console.log(`Queue ${queue}: ${msg.content}`);
    });
  } catch (error) {
    console.error("Error connecting to RabbitMQ", error);
  }
})();
