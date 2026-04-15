package config

import (
	"context"
	"log"
	"time"

	firebase "firebase.google.com/go/v4"
	"google.golang.org/api/option"
	"cloud.google.com/go/firestore"
)

func InitFirebase() (*firestore.Client, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	
	// Update path to the shared ServiceAccountKey.json
	opt := option.WithCredentialsFile("../../firebase/serviceAccountKey.json")
	
	app, err := firebase.NewApp(ctx, nil, opt)
	if err != nil {
		return nil, err
	}

	client, err := app.Firestore(ctx)
	if err != nil {
		return nil, err
	}

	log.Println("Firebase successfully initialized in Golang.")
	return client, nil
}
