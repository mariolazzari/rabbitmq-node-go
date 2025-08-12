# Master Microservices: Build a Real-Time RabbitMQ Producer-Consumer System in Node.js & Golang

YouTube [video](https://www.youtube.com/watch?v=BYkBTdeS114)

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
docker run -d --name rabbitmq -p 5672:5672 rabbitmq:3-management
```


## Producer (NodeJS)

## Consumer (Go lang)
