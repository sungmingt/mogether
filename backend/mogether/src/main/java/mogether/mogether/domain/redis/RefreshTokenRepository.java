package mogether.mogether.domain.redis;

import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import static java.time.Duration.ofMillis;
import static mogether.mogether.domain.redis.TokenInfo.REFRESH_TOKEN_VALIDATION_SECOND;

@Repository
public class RefreshTokenRepository {

    private static final String KEY = "refreshToken";

    private final RedisTemplate<String, String> refreshTokenRedisTemplate;
    private final HashOperations<String, String, String> hashOperations;

    public RefreshTokenRepository(RedisTemplate<String, String> refreshTokenRedisTemplate) {
        this.refreshTokenRedisTemplate = refreshTokenRedisTemplate;
        this.hashOperations = refreshTokenRedisTemplate.opsForHash();
    }

    public Optional<String> findById(Long id) {
        return Optional.ofNullable(hashOperations.get(KEY, String.valueOf(id)));
    }

    public String save(Long id, String refreshToken) {
        hashOperations.put(KEY, String.valueOf(id), refreshToken);
        refreshTokenRedisTemplate.expire(KEY, ofMillis(REFRESH_TOKEN_VALIDATION_SECOND));
        return refreshToken;
    }

    public void deleteById(Long id) {
        hashOperations.delete(KEY, String.valueOf(id));
    }

    public void deleteAll() {
        refreshTokenRedisTemplate.delete(KEY);
    }

    public boolean existsById(Long id) {
        return hashOperations.hasKey(KEY, String.valueOf(id));
    }


//    public void setBlacklist(String accessToken, long expireTimeLeft) {
//        redisTemplate.setBlackList(accessToken, expireTimeLeft);
//    }
//
//    public boolean isBlackList(String accessToken) {
//        return redisTemplate.isBlacklist(accessToken);
//    }
//
//    public void update(String accessToken, String reissuedAccessToken, String reissuedRefreshToken) {
//        redisTemplate.deleteData(accessToken);
//        //atk blacklist 등록 필요
//        save(reissuedAccessToken, reissuedRefreshToken);
//    }
//
//    public String findByAccessToken(String accessToken) {
//        return redisTemplate.getData(accessToken);
//    }
}
