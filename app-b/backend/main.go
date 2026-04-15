package main

import (
	"fmt"
	"log"
	"net/http"

	"chatbox-backend/config"
	"chatbox-backend/handlers"
)

func main() {
	// Initialize Firebase
	client, err := config.InitFirebase()
	if err != nil {
		log.Fatalf("Error initializing Firebase: %v\n", err)
	}

	// Setup routes
	http.HandleFunc("/api/messages", handlers.EnableCORS(handlers.MessageHandler(client)))

	fmt.Println("App B (Golang) Backend listening on port 8081...")
	if err := http.ListenAndServe(":8081", nil); err != nil {
		log.Fatal(err)
	}
}
