package mogether.mogether.exception;

import lombok.Getter;

public enum ErrorCode {

    //USER
    USER_NOT_FOUND(404, "존재하지 않는 회원입니다."),
    USER_NOT_AUTHORIZED(403, "로그인되지 않은 사용자입니다."),
    USER_ALREADY_AUTHORIZED(400, "이미 로그인 상태입니다."),
    REQUEST_NOT_AUTHORIZED(403, "작성자가 일치하지 않습니다."),

    //USER INFO
    EMAIL_ALREADY_EXISTS(409, "이미 존재하는 이메일입니다."),
    EMAIL_NOT_EXISTS(400, "존재하지 않는 이메일입니다."),
    EMAIL_NOT_VALID(400, "이메일 형식이 올바르지 않습니다."),
    PASSWORD_NOT_VALID(400, "비밀번호 형식이 올바르지 않습니다."),
    PASSWORD_NOT_MATCH(400, "비밀번호가 일치하지 않습니다."),

    //AUTH
    ILLEGAL_REGISTRATION_ID(400, "잘못된 registration id입니다."),
    INVALID_SOCIAL_TYPE(400, "올바르지 않은 소셜 로그인 제공자입니다."),

    //TOKEN
    ACCESS_TOKEN_EXPIRED(401, "access token 만료, reissue 요청이 필요합니다."),
    REFRESH_TOKEN_EXPIRED(401, "refresh token 만료, 강제 로그아웃"),
    ACCESS_TOKEN_INVALID(401, "유효하지 않은 access token 입니다."),
    REFRESH_TOKEN_INVALID(401, "유효하지 않은 refresh token 입니다."),
    REQUIRED_TOKEN_MISSING(401, "토큰이 존재하지 않습니다."),
    TOKEN_FROM_BLACKLIST(401, "blacklist에 등록된 토큰입니다."),
    PAYLOAD_NOT_VALID(401, "토큰의 payload가 유효하지 않습니다."),
    TOKEN_INVALID(401, "유효하지 않은 토큰입니다."),
    TOKEN_SIGNATURE_INVALID(401, "올바르지 않은 토큰 시그니처입니다."),

    //FILE
    IMAGE_NOT_FOUND(404, "이미지가 존재하지 않습니다."),
    FILE_NOT_FOUND(404, "파일이 존재하지 않습니다."),
    FILE_DELETE_FAILED(404, "파일 삭제에 실패했습니다."),
    FILE_CANNOT_SAVE(404, "파일을 저장하지 못했습니다."),

    //BUNGAE
    BUNGAE_NOT_FOUND(404, "존재하지 않는 번개입니다."),
    NO_BUNGAEJOIN_HISTORY(404, "해당 유저의 번개 참여 이력이 존재하지 않습니다."),

    //MOIM
    MOIM_NOT_FOUND(404, "존재하지 않는 모임입니다."),
    NOT_MOIM_MEMBER(404, "모임 가입 유저가 아닙니다."),

    //INTEREST
    INTEREST_ALREADY_EXISTS(400, "이미 좋아요를 누른 글입니다."),
    INTEREST_NOT_FOUND(400, "좋아요를 누른 글이 아닙니다.");

    @Getter
    private final int status;
    @Getter
    private final String message;

    ErrorCode(final int code, final String message){
        this.status = code;
        this.message = message;
    }
}