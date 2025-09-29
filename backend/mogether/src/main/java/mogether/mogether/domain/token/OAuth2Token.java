package mogether.mogether.domain.token;

import mogether.mogether.domain.info.SocialType;

public interface OAuth2Token {

    Long getUserId();
    String getAccessToken();
    String getRefreshToken();
    SocialType getSocialType();
}
