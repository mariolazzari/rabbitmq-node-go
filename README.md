# Master Microservices: Build a Real-Time RabbitMQ Producer-Consumer System in Node.js & Golang

YouTube [video](https://www.youtube.com/watch?v=BYkBTdeS114)
amqplib [npm](https://www.npmjs.com/package/amqplib)

## Definitions

- Message broker: core service that receives messages from producers (senders), routes them according to rules, and delivers them to consumers (receivers)
- Loose coupling

## Concepts

- Connection: TCP/IP connection
- Channels: virtual connections over physical TCP one, in order to open more connections per client
- Queues
  - non replicated FIFO queue
  - replicated quorum queues

## Rabbitmq Docker image (with management console)

```sh
docker run -d --name rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

## Producer (NodeJS)

```sh
mkdir producer
cd producer
pnpm init
pnpm i amqplib
```

```js
// index.js
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
  const count = 0;
  setInterval(() => {
    const message = `Message ${count}`;
    channel.sendToQueue(queue, Buffer.from(message));
    console.log(`[x] Sent ${message}`);
  }, 1000);
}

produce();
```

## Consumer (Go lang)

```sh
mkdir consumer
cd consumer
go mod init consumer
```

```go
package main

import (
 "fmt"
 "log"

 "github.com/streadway/amqp"
)

func main() {
 fmt.Println("ciao")
 log.Default()

 // physical connection
 conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
 if err != nil {
  log.Fatal("Error connecting to server")
 }
 defer conn.Close()

 // virtual connection
 channel, err := conn.Channel()
 if err != nil {
  log.Fatal("Error creating channel")
 }
 defer channel.Close()

 // create queue
 queue, err := channel.QueueDeclare("hello", false, false, false, false, nil)
 if err != nil {
  log.Fatal("Error creating queue hello")
 }

 // consume message from queue
 messages, err := channel.Consume(queue.Name, "", true, false, false, false, nil)
 if err != nil {
  log.Fatalf("Failed to register a consumer: %v", err)
 }

 // read message
 go func() {
  for message := range messages {
   fmt.Printf("Received a message: %s\n", message.Body)
  }
 }()

 // infinite loop
 forever := make(chan bool)
 fmt.Println("Waiting for message... ctrl+c top quit")
 <-forever
}
```

### Execution

```sh
# terminal 1
go run consumer/main.go
# terminal 2
node producer/index.js
```
