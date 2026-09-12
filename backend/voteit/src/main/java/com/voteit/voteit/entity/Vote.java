package com.voteit.voteit.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "votes")
@Getter
@Setter
@NoArgsConstructor
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which question this vote belongs to
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    // Which option was chosen
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "option_id", nullable = false)
    private Option option;

    // A unique identifier for the anonymous voter.
    // We generate this on the frontend (UUID stored in localStorage)
    // and send it with every vote. This is how we prevent double voting
    // without requiring user accounts.
    @Column(nullable = false, length = 100)
    private String voterId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Vote(Question question, Option option, String voterId) {
        this.question = question;
        this.option = option;
        this.voterId = voterId;
        this.createdAt = LocalDateTime.now();
    }
}
