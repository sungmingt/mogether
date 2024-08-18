package mogether.mogether.domain.oauth;

import lombok.Builder;
import lombok.Getter;
import mogether.mogether.domain.info.SocialType;
import mogether.mogether.domain.user.User;
import mogether.mogether.exception.MogetherException;

import java.util.Map;

import static mogether.mogether.exception.ErrorCode.*;

@Getter
@Builder
public class OAuth2UserInfo {    //유저 정보 dto

    private String name;
    private String email;
    //    private String profile;  요구사항 상 이미지는 가져오지 않는다.
    private SocialType socialType;
    private String socialId;

    public static OAuth2UserInfo of(String registrationId, Map<String, Object> attributes) {
        return switch (registrationId) { // registration id별로 userInfo 생성
            case "google" -> ofGoogle(attributes, registrationId);
            case "kakao" -> ofKakao(attributes, registrationId);
            default -> throw new MogetherException(ILLEGAL_REGISTRATION_ID);
        };
    }

    private static OAuth2UserInfo ofGoogle(Map<String, Object> attributes, String registrationId) {
        return OAuth2UserInfo.builder()
                .name((String) attributes.get("name"))
                .email((String) attributes.get("email"))
                .socialType(SocialType.of(registrationId))
                .socialId((String) attributes.get("sub"))
//                .profile((String) attributes.get("picture"))
                .build();
    }

    private static OAuth2UserInfo ofKakao(Map<String, Object> attributes, String registrationId) {
        Map<String, Object> account = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) account.get("profile");

        return OAuth2UserInfo.builder()
                .name((String) profile.get("nickname"))
                .email((String) account.get("email"))
                .socialType(SocialType.of(registrationId))
                .socialId(String.valueOf(attributes.get("id")))  ////
//                .profile((String) profile.get("profile_image_url"))
                .build();
    }

    public User toEntity() {
        return new User(name, email, socialType, socialId);
    }
}



