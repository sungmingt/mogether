package mogether.mogether.domain.token.redis;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Repository;

import java.util.concurrent.TimeUnit;

@Repository
public class BlackListTokenRepository {

    private static final String BLACKLIST_PREFIX = "blackList:";

    private final ValueOperations<String, String> valueOperations;

    public BlackListTokenRepository(RedisTemplate<String, String> blackListTokenRedisTemplate) {
        this.valueOperations = blackListTokenRedisTemplate.opsForValue();
    }

    public void setBlackList(String token, Long timeToLive) {
        String key = BLACKLIST_PREFIX + token;
        valueOperations.set(key, token, timeToLive, TimeUnit.MILLISECONDS);
    }

    public boolean isFromBlacklist(String accessToken) {
        String key = BLACKLIST_PREFIX + accessToken;
        String value = valueOperations.get(key);
        return value != null && !value.isEmpty();
    }
}
