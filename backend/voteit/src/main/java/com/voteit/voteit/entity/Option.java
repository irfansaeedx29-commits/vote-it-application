package com.voteit.voteit.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "options")
@Getter
@Setter
@NoArgsConstructor
public class Option {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String text;

    // @ManyToOne: many Options belong to one Question
    // @JoinColumn: this is the foreign key column in the "options" table
    // So the "options" table will have a column "question_id" that references "questions.id"
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    // Convenience constructor used in the service layer
    public Option(String text, Question question) {
        this.text = text;
        this.question = question;
    }
}
