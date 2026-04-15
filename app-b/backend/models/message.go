package models

type Message struct {
	Text      string `json:"text" firestore:"text"`
	Sender    string `json:"sender" firestore:"sender"`
	Timestamp int64  `json:"timestamp" firestore:"timestamp"`
}
