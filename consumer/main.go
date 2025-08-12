package main

import (
	"fmt"
	"log"

	"github.com/streadway/amqp"
)

func main() {
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
