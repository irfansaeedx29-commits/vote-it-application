package com.voteit.voteit.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

// What the API returns for a single option inside a question response
// {
//   "id": 1,
//   "text": "Java"
// }
@Getter
@AllArgsConstructor
public class OptionResponse {
    private Long id;
    private String text;
}
