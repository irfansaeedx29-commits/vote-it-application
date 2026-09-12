package com.voteit.voteit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

// This is what the frontend sends when creating a question:
// POST /api/questions
// {
//   "text": "What's the best language?",
//   "category": "Technology",
//   "options": ["Java", "Python", "JavaScript"]
// }
@Getter
@Setter
public class CreateQuestionRequest {

    // @NotBlank: must not be null or empty string or just whitespace
    // @Size: enforces min/max length — matches the validation rules in the spec
    @NotBlank(message = "Question text is required")
    @Size(min = 10, max = 200, message = "Question must be between 10 and 200 characters")
    private String text;

    @NotBlank(message = "Category is required")
    @Size(max = 50, message = "Category must be at most 50 characters")
    private String category;

    // @Size on the list itself — enforces min 2, max 6 options
    @Size(min = 2, max = 6, message = "A question must have between 2 and 6 options")
    private List<
        @NotBlank(message = "Option text cannot be blank")
        @Size(min = 1, max = 100, message = "Each option must be between 1 and 100 characters")
        String
    > options;
}
