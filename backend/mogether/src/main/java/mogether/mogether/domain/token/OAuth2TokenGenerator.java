package mogether.mogether.domain.token;

import lombok.Getter;
import mogether.mogether.domain.info.SocialType;
import mogether.mogether.domain.token.OAuth2GoogleToken;
import mogether.mogether.domain.token.OAuth2KakaoToken;
import mogether.mogether.domain.token.OAuth2Token;
import mogether.mogether.exception.MogetherException;

import static mogether.mogether.exception.ErrorCode.ILLEGAL_REGISTRATION_ID;

@Getter
public class OAuth2TokenGenerator {

    public static OAuth2Token of(Long userId, String accessToken, String refreshToken, String registrationId) {
        return switch (registrationId) { //registration id별로 userInfo 생성
            case "google" -> ofGoogle(userId, accessToken, refreshToken);
            case "kakao" -> ofKakao(userId, accessToken, refreshToken);
            default -> throw new MogetherException(ILLEGAL_REGISTRATION_ID);
        };
    }

    private static OAuth2Token ofGoogle(Long userId, String accessToken, String refreshToken) {
        return OAuth2GoogleToken.builder()
                .userId(userId)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .socialType(SocialType.GOOGLE)
                .build();
    }

    private static OAuth2Token ofKakao(Long userId, String accessToken, String refreshToken) {
        return OAuth2KakaoToken.builder()
                .userId(userId)
                .accessToken(accessToken)
                .refeshToken(refreshToken)
                .socialType(SocialType.KAKAO)
                .build();
    }

}
