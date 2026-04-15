package com.chatbox.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {
    @PostConstruct
    public void initialize() {
        try {
            // Note: Update this path to where serviceAccountKey.json is actually stored
            FileInputStream serviceAccount = new FileInputStream("../../firebase/serviceAccountKey.json");

            FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setDatabaseUrl("https://demo-app.firebaseio.com")
                .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("Firebase successfully initialized in Spring Boot.");
            }
        } catch (Exception e) {
            System.err.println("Firebase Auth Error (Expected with Dummy Keys): " + e.getMessage());
            System.err.println("Spring Boot Backend is running without Firebase Write access.");
        }
    }
}
