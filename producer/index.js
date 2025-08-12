const amqp = require("amqplib");

// produce messages to a classic queue
async function produce() {
  // physical connection
  const connection = await amqp.connect("amqp://guest:guest@localhost:5672/");
  // virtual connection
  const channel = await connection.createChannel();
  // queue name
  const queue = "hello";

  // var incremented every second
  let count = 0;
  setInterval(() => {
    const message = `Message ${count}`;
    channel.sendToQueue(queue, Buffer.from(message));
    console.log(`[x] Sent ${message}`);
    count++;
  }, 1000);
}

produce();
