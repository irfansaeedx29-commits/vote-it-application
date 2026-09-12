package com.voteit.voteit.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

// A single row in the vote result breakdown
// { "optionId": 1, "text": "Java", "votes": 450, "percentage": 36.0 }
@Getter
@AllArgsConstructor
public class OptionResultResponse {
    private Long optionId;
    private String text;
    private long votes;
    private double percentage;
}
