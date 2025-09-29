package mogether.mogether.config;

import mogether.mogether.domain.token.OAuth2Token;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class TokenRedisConfig {

    @Value("${spring.redis.token.host}")
    private String host;

    @Value("${spring.redis.token.port}")
    private int port;

    @Bean
    @Qualifier("tokenRedisConnectionFactory")
    public RedisConnectionFactory tokenRedisConnectionFactory() {
        RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration();
        redisStandaloneConfiguration.setHostName(host);
        redisStandaloneConfiguration.setPort(port);
        return new LettuceConnectionFactory(redisStandaloneConfiguration);
    }

    @Bean
    @Qualifier("oAuth2TokenRedisTemplate")
    public RedisTemplate<String, OAuth2Token> oAuth2TokenRedisTemplate() {
        RedisTemplate<String, OAuth2Token> oAuth2TokenRedisTemplate = new RedisTemplate<>();
        oAuth2TokenRedisTemplate.setConnectionFactory(tokenRedisConnectionFactory());
        oAuth2TokenRedisTemplate.setKeySerializer(new StringRedisSerializer());
        oAuth2TokenRedisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        return oAuth2TokenRedisTemplate;
    }

    @Bean
    @Qualifier("refreshTokenRedisTemplate")
    public RedisTemplate<String, String> refreshTokenRedisTemplate() {
        RedisTemplate<String, String> refreshTokenRedisTemplate = new RedisTemplate<>();
        refreshTokenRedisTemplate.setConnectionFactory(tokenRedisConnectionFactory());
        refreshTokenRedisTemplate.setEnableTransactionSupport(true);
        return refreshTokenRedisTemplate;
    }

    @Bean
    @Qualifier("blackListTokenRedisTemplate")
    public StringRedisTemplate blackListTokenRedisTemplate() {
        StringRedisTemplate blackListTokenRedisTemplate = new StringRedisTemplate();
        blackListTokenRedisTemplate.setConnectionFactory(tokenRedisConnectionFactory());
        blackListTokenRedisTemplate.setEnableTransactionSupport(true);
        return blackListTokenRedisTemplate;
    }
}
