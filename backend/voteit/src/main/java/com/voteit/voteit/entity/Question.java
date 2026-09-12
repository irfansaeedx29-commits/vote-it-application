package com.voteit.voteit.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// @Entity tells Hibernate: "this class maps to a database table"
// @Table lets us explicitly name the table. Without it, Hibernate uses the class name.
@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
public class Question {

    // @Id marks this field as the primary key
    // @GeneratedValue tells the database to auto-increment it
    // IDENTITY means it uses the database's built-in auto-increment (PostgreSQL SERIAL)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @Column lets us add constraints at the database level
    // nullable = false → NOT NULL in SQL
    // length = 200 → VARCHAR(200) in SQL
    @Column(nullable = false, length = 200)
    private String text;

    @Column(nullable = false, length = 50)
    private String category;

    // @CreationTimestamp would need Hibernate annotations — we set this manually in the service
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // @OneToMany: one Question has many Options
    // mappedBy = "question": the "question" field in the Option class owns this relationship
    // cascade = ALL: if you save/delete a Question, its Options are saved/deleted too
    // orphanRemoval = true: if you remove an Option from this list, it is deleted from the DB
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Option> options = new ArrayList<>();

    // @OneToMany: one Question has many Votes
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Vote> votes = new ArrayList<>();

    // Convenience constructor used in the service layer
    public Question(String text, String category) {
        this.text = text;
        this.category = category;
        this.createdAt = LocalDateTime.now();
    }
}
