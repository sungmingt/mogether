package mogether.mogether.web.chat;

import mogether.mogether.web.chat.dto.ChatMessageResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class RedisPublisher {

    //Redis에 메세지 전송 요청을 하는 역할
    //메세지를 전송할 channel, DTO를 인자로 Redis Channel 에 pub 한다
    private final RedisTemplate<String, ChatMessageResponse> chatRedisTemplate;

    public RedisPublisher(@Qualifier("chatRedisTemplate") RedisTemplate<String, ChatMessageResponse> chatRedisTemplate) {
        this.chatRedisTemplate = chatRedisTemplate;
    }

    public void publish(String topic, ChatMessageResponse dto) {
        chatRedisTemplate.convertAndSend(topic, dto);
    }
}