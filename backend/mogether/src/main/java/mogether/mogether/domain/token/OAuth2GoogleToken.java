package mogether.mogether.domain.token;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import mogether.mogether.domain.info.SocialType;

@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OAuth2GoogleToken implements OAuth2Token{

    private Long userId;
    private String accessToken;
    private String refreshToken;
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
        return this.refreshToken;
    }

    @Override
    public SocialType getSocialType() {
        return this.socialType;
    }
}
