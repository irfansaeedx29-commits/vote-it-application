package com.voteit.voteit.repository;

import com.voteit.voteit.entity.Option;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OptionRepository extends JpaRepository<Option, Long> {
    // JpaRepository gives us findById(id) which is all we need for now.
    // When a vote comes in, we look up the option by its ID to validate it exists.
}
