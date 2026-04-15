package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

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

	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	fmt.Printf("App B (Golang) Backend listening on port %s...\n", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}
