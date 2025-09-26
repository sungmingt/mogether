package mogether.mogether.domain.oauth;

import mogether.mogether.domain.info.SocialType;

public interface OAuth2Token {

    Long getUserId();
    String getAccessToken();
    String getRefreshToken();
    SocialType getSocialType();
}
