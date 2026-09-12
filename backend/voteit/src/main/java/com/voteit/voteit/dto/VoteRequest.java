package com.voteit.voteit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

// This is what the frontend sends when casting a vote:
// POST /api/questions/{id}/votes
// {
//   "optionId": 3,
//   "voterId": "550e8400-e29b-41d4-a716-446655440000"
// }
@Getter
@Setter
public class VoteRequest {

    @NotNull(message = "optionId is required")
    private Long optionId;

    // A UUID generated on the frontend and stored in localStorage.
    // This is the anonymous identity — lets us prevent double votes
    // without requiring user accounts.
    @NotBlank(message = "voterId is required")
    private String voterId;
}
