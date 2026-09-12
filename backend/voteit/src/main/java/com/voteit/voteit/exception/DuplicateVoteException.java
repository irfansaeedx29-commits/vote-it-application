package com.voteit.voteit.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Thrown when a user tries to vote on a question they already voted on
@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateVoteException extends RuntimeException {

    public DuplicateVoteException(String message) {
        super(message);
    }
}
