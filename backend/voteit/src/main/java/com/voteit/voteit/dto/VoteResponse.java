package com.voteit.voteit.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

// What the API returns after a successful vote
// {
//   "questionId": 1,
//   "chosenOptionId": 2,
//   "totalVotes": 1251,
//   "results": [
//     { "optionId": 1, "text": "Java",       "votes": 450, "percentage": 35.9 },
//     { "optionId": 2, "text": "Python",      "votes": 601, "percentage": 47.9 },
//     { "optionId": 3, "text": "JavaScript",  "votes": 200, "percentage": 16.0 }
//   ]
// }
@Getter
@AllArgsConstructor
public class VoteResponse {
    private Long questionId;
    private Long chosenOptionId;
    private long totalVotes;
    private List<OptionResultResponse> results;
}
