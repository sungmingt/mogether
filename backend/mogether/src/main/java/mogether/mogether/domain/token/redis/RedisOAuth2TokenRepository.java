package mogether.mogether.domain.token.redis;

import mogether.mogether.domain.token.OAuth2Token;
import mogether.mogether.exception.ErrorCode;
import mogether.mogether.exception.MogetherException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class RedisOAuth2TokenRepository {

    private static final String OAUTH2TOKEN_KEY_PREFIX = "oAuth2Token:";

    private final RedisTemplate<String, OAuth2Token> oAuth2TokenRedisTemplate;
    private final ValueOperations<String, OAuth2Token> valueOperations;

    public RedisOAuth2TokenRepository(@Qualifier("oAuth2TokenRedisTemplate") RedisTemplate<String, OAuth2Token> oAuth2TokenRedisTemplate) {
        this.oAuth2TokenRedisTemplate = oAuth2TokenRedisTemplate;
        valueOperations = oAuth2TokenRedisTemplate.opsForValue();
    }

    public String getUserKey(Long userId) {
        return OAUTH2TOKEN_KEY_PREFIX + userId;
    }

    public OAuth2Token findByUserId(Long userId) {
        return Optional.ofNullable(valueOperations.get(getUserKey(userId)))
                .orElseThrow(() -> new MogetherException(ErrorCode.OAUTH2TOKEN_NOT_FOUND));
    }

    public OAuth2Token save(OAuth2Token oAuth2Token) {
        String userKey = getUserKey(oAuth2Token.getUserId());
        valueOperations.set(userKey, oAuth2Token);
        return oAuth2Token;
    }

    public void deleteById(Long userId) {
        valueOperations.getAndDelete(getUserKey(userId));
    }
}
