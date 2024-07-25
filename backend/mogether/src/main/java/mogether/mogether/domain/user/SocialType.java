package mogether.mogether.domain.user;

import java.util.Arrays;

public enum SocialType {

    GOOGLE, KAKAO, NONE;

//    public static SocialType of(String input) {
//        return Arrays.stream(values())
//                .filter(socialType -> socialType.name().equals(input.toUpperCase()))
//                .findFirst()
//                .orElseThrow(SocialTypeNotFoundException::new);
//    }
}
