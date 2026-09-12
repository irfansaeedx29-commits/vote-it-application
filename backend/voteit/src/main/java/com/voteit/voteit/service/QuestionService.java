package com.voteit.voteit.service;

import com.voteit.voteit.dto.*;
import com.voteit.voteit.entity.Option;
import com.voteit.voteit.entity.Question;
import com.voteit.voteit.entity.Vote;
import com.voteit.voteit.exception.DuplicateVoteException;
import com.voteit.voteit.exception.ResourceNotFoundException;
import com.voteit.voteit.repository.OptionRepository;
import com.voteit.voteit.repository.QuestionRepository;
import com.voteit.voteit.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

// @Service marks this as a Spring-managed service bean
// @RequiredArgsConstructor (Lombok) generates a constructor for all final fields —
// this is constructor injection, the recommended way to inject dependencies in Spring
@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final OptionRepository optionRepository;
    private final VoteRepository voteRepository;

    // ── Get all questions ────────────────────────────────────────────────────

    public List<QuestionResponse> getAllQuestions() {
        return questionRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toQuestionResponse)
                .collect(Collectors.toList());
    }

    // ── Get single question by ID ────────────────────────────────────────────

    public QuestionResponse getQuestionById(Long id) {
        Question question = questionRepository.findById(id)
                // If not found, throw our custom exception → GlobalExceptionHandler returns 404
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));
        return toQuestionResponse(question);
    }

    // ── Create a question ────────────────────────────────────────────────────

    // @Transactional: wraps this entire method in a database transaction.
    // If anything fails halfway through (e.g. saving an option fails),
    // the entire operation is rolled back — no partial data in the database.
    @Transactional
    public QuestionResponse createQuestion(CreateQuestionRequest request) {
        // 1. Create and save the question first
        Question question = new Question(request.getText(), request.getCategory());
        question = questionRepository.save(question);

        // 2. Create each option and link it to the question
        for (String optionText : request.getOptions()) {
            Option option = new Option(optionText.trim(), question);
            optionRepository.save(option);
        }

        // 3. Reload the question with its options populated
        Question saved = questionRepository.findById(question.getId()).orElseThrow();
        return toQuestionResponse(saved);
    }

    // ── Cast a vote ──────────────────────────────────────────────────────────

    @Transactional
    public VoteResponse castVote(Long questionId, VoteRequest request) {
        // 1. Validate the question exists
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));

        // 2. Validate the option exists
        Option option = optionRepository.findById(request.getOptionId())
                .orElseThrow(() -> new ResourceNotFoundException("Option not found with id: " + request.getOptionId()));

        // 3. Validate the option actually belongs to this question
        if (!option.getQuestion().getId().equals(questionId)) {
            throw new ResourceNotFoundException("Option does not belong to this question");
        }

        // 4. Check for duplicate vote — same voter, same question
        boolean alreadyVoted = voteRepository
                .findByQuestionIdAndVoterId(questionId, request.getVoterId())
                .isPresent();
        if (alreadyVoted) {
            throw new DuplicateVoteException("You have already voted on this question");
        }

        // 5. Save the vote
        Vote vote = new Vote(question, option, request.getVoterId());
        voteRepository.save(vote);

        // 6. Build and return the result breakdown
        return buildVoteResponse(question, request.getOptionId());
    }

    // ── Get results (for a voter returning to a question they already voted on) ──

    public VoteResponse getResults(Long questionId, Long chosenOptionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));
        return buildVoteResponse(question, chosenOptionId);
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    // Converts a Question entity into a QuestionResponse DTO
    private QuestionResponse toQuestionResponse(Question question) {
        long totalVotes = voteRepository.countByQuestionId(question.getId());

        List<OptionResponse> optionResponses = question.getOptions()
                .stream()
                .map(opt -> new OptionResponse(opt.getId(), opt.getText()))
                .collect(Collectors.toList());

        return new QuestionResponse(
                question.getId(),
                question.getText(),
                question.getCategory(),
                totalVotes,
                question.getCreatedAt(),
                optionResponses
        );
    }

    // Builds the full vote result breakdown for a question
    private VoteResponse buildVoteResponse(Question question, Long chosenOptionId) {
        long totalVotes = voteRepository.countByQuestionId(question.getId());

        List<OptionResultResponse> results = question.getOptions()
                .stream()
                .map(opt -> {
                    long votes = voteRepository.countByOptionId(opt.getId());
                    double percentage = totalVotes > 0
                            ? Math.round((votes * 100.0 / totalVotes) * 10.0) / 10.0
                            : 0.0;
                    return new OptionResultResponse(opt.getId(), opt.getText(), votes, percentage);
                })
                .collect(Collectors.toList());

        return new VoteResponse(question.getId(), chosenOptionId, totalVotes, results);
    }
}
