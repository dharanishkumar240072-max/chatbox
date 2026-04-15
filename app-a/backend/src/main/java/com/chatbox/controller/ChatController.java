package com.chatbox.controller;

import com.chatbox.model.Message;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class ChatController {

    @PostMapping
    public ResponseEntity<String> sendMessage(@RequestBody Message message) {
        try {
            message.setTimestamp(System.currentTimeMillis());
            
            // Write to Firestore db collection 'messages'
            Firestore dbFirestore = FirestoreClient.getFirestore();
            dbFirestore.collection("messages").add(message);
            
            return ResponseEntity.ok("Message logged securely by Spring Boot");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
