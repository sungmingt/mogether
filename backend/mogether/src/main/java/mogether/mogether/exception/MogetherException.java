package mogether.mogether.exception;

import lombok.Getter;

public class MogetherException extends RuntimeException{

    @Getter
    private ErrorCode errorCode;

    public MogetherException(ErrorCode errorCode){
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}