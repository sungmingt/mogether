package mogether.mogether.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;

@Configuration
public class CacheConfig {

    @Bean
    @Primary
    public RedisCacheManager tokenCacheManager(@Qualifier("tokenRedisConnectionFactory") RedisConnectionFactory tokenRedisConnectionFactory) {
        RedisCacheConfiguration cacheConfig = RedisCacheConfiguration.defaultCacheConfig();
        return RedisCacheManager.builder(tokenRedisConnectionFactory)
                .cacheDefaults(cacheConfig)
                .build();
    }

    @Bean
    public RedisCacheManager chatCacheManager(@Qualifier("chatRedisConnectionFactory") RedisConnectionFactory chatRedisConnectionFactory) {
        RedisCacheConfiguration cacheConfig = RedisCacheConfiguration.defaultCacheConfig();
        return RedisCacheManager.builder(chatRedisConnectionFactory)
                .cacheDefaults(cacheConfig)
                .build();
    }
}