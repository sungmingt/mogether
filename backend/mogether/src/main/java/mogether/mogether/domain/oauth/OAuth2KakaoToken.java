package mogether.mogether.domain.oauth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import mogether.mogether.domain.info.SocialType;

@Builder
@AllArgsConstructor
public class OAuth2KakaoToken implements OAuth2Token{

    private Long userId;
    private String accessToken;
    private String refeshToken;
    private SocialType socialType;

    @Override
    public Long getUserId() {
        return this.userId;
    }

    @Override
    public String getAccessToken() {
        return this.accessToken;
    }

    @Override
    public String getRefreshToken() {
        return this.refeshToken;
    }

    @Override
    public SocialType getSocialType() {
        return this.socialType;
    }
}
