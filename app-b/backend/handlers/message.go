package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"chatbox-backend/models"
	"cloud.google.com/go/firestore"
)

func EnableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	}
}

func MessageHandler(client *firestore.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var msg models.Message
		if err := json.NewDecoder(r.Body).Decode(&msg); err != nil {
			http.Error(w, "Bad request", http.StatusBadRequest)
			return
		}

		msg.Timestamp = time.Now().UnixMilli()

		_, _, err := client.Collection("messages").Add(context.Background(), msg)
		if err != nil {
			http.Error(w, "Failed to write to Firebase", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status": "Message logged securely by Golang"}`))
	}
}
