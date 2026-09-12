package com.voteit.voteit.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

// What the API returns when you GET /api/questions or GET /api/questions/{id}
// {
//   "id": 1,
//   "text": "What's the best language?",
//   "category": "Technology",
//   "totalVotes": 1250,
//   "createdAt": "2025-01-11T09:00:00",
//   "options": [
//     { "id": 1, "text": "Java" },
//     { "id": 2, "text": "Python" }
//   ]
// }
@Getter
@AllArgsConstructor
public class QuestionResponse {
    private Long id;
    private String text;
    private String category;
    private long totalVotes;
    private LocalDateTime createdAt;
    private List<OptionResponse> options;
}
