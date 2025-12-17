package com.taskmanagement.taskmanagementbackend.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "tasks")
@Data
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private boolean completed;

    // NEW FIELDS
    private String priority; // High, Medium, Low
    private String category; // Work, Personal, etc.

    @Column(name = "user_id")
    private String userId; // This will store the Google Email

    // ... Getters and Setters (or use @Data if you have Lombok working)
}
