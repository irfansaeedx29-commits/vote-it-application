package com.voteit.voteit.controller;

import com.voteit.voteit.dto.*;
import com.voteit.voteit.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// @RestController = @Controller + @ResponseBody
// Means: every method in this class returns data (JSON), not a view/template
//
// @RequestMapping("/api/questions") sets the base URL for all methods in this class
// @CrossOrigin allows the React frontend (running on port 5173) to call this API
// Without this, the browser blocks the request due to CORS policy
@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    // GET /api/questions
    // Returns all questions, newest first
    @GetMapping
    public ResponseEntity<List<QuestionResponse>> getAllQuestions() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    // GET /api/questions/{id}
    // Returns a single question by its ID
    // {id} is a path variable — e.g. /api/questions/3 → id = 3
    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponse> getQuestion(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }

    // POST /api/questions
    // Creates a new question
    // @RequestBody: Spring reads the JSON body and maps it to CreateQuestionRequest
    // @Valid: triggers the validation annotations on CreateQuestionRequest
    //         If validation fails, Spring throws MethodArgumentNotValidException
    //         which our GlobalExceptionHandler catches and returns 400
    @PostMapping
    public ResponseEntity<QuestionResponse> createQuestion(
            @Valid @RequestBody CreateQuestionRequest request) {
        QuestionResponse created = questionService.createQuestion(request);
        // 201 Created is the correct HTTP status for a successful resource creation
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // POST /api/questions/{id}/votes
    // Casts a vote on a question
    @PostMapping("/{id}/votes")
    public ResponseEntity<VoteResponse> vote(
            @PathVariable Long id,
            @Valid @RequestBody VoteRequest request) {
        VoteResponse result = questionService.castVote(id, request);
        return ResponseEntity.ok(result);
    }

    // GET /api/questions/{id}/results?voterId=xxx&chosenOptionId=yyy
    // Returns results for a voter who already voted (page refresh scenario)
    @GetMapping("/{id}/results")
    public ResponseEntity<VoteResponse> getResults(
            @PathVariable Long id,
            @RequestParam Long chosenOptionId) {
        return ResponseEntity.ok(questionService.getResults(id, chosenOptionId));
    }
}
