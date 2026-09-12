package com.voteit.voteit.repository;

import com.voteit.voteit.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {

    // Check whether a specific voter already voted on a specific question.
    // Spring Data generates: SELECT * FROM votes WHERE question_id = ? AND voter_id = ? LIMIT 1
    // This is how we prevent the same person from voting twice.
    Optional<Vote> findByQuestionIdAndVoterId(Long questionId, String voterId);

    // Count how many votes a specific option has received
    // SELECT COUNT(*) FROM votes WHERE option_id = ?
    long countByOptionId(Long optionId);

    // Count total votes for a question
    // SELECT COUNT(*) FROM votes WHERE question_id = ?
    long countByQuestionId(Long questionId);
}
