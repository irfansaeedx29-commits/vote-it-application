package com.voteit.voteit.repository;

import com.voteit.voteit.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// JpaRepository<Question, Long>:
//   - Question = the entity this repository manages
//   - Long     = the type of the primary key (id field)
//
// By extending JpaRepository you get for free:
//   findAll()         → SELECT * FROM questions
//   findById(id)      → SELECT * FROM questions WHERE id = ?
//   save(question)    → INSERT or UPDATE
//   delete(question)  → DELETE
//   count()           → SELECT COUNT(*) FROM questions
//   ... and more
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    // Spring Data JPA reads the method name and generates the SQL automatically.
    // "findBy" + "Category" → WHERE category = ?
    List<Question> findByCategory(String category);

    // "findBy" + "Category" + "OrderBy" + "CreatedAt" + "Desc"
    // → WHERE category = ? ORDER BY created_at DESC
    List<Question> findByCategoryOrderByCreatedAtDesc(String category);

    // All questions newest first
    List<Question> findAllByOrderByCreatedAtDesc();
}
