package com.chatbox.model;

public class Message {
    private String text;
    private String sender;
    private long timestamp;

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}
