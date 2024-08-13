package mogether.mogether.domain.info;

import mogether.mogether.exception.ErrorCode;
import mogether.mogether.exception.MogetherException;

import java.util.Arrays;

public enum SocialType {

    GOOGLE, KAKAO, NONE;

    public static SocialType of(String input) {
        return Arrays.stream(values())
                .filter(socialType -> socialType.name().equals(input.toUpperCase()))
                .findFirst()
                .orElseThrow(() -> new MogetherException(ErrorCode.INVALID_SOCIAL_TYPE));
    }
}
