package mogether.mogether.web.chat;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import mogether.mogether.web.chat.dto.ChatMessageResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class RedisSubscriber implements MessageListener {

    //Pub을 통해 전송된 메세지를 받는 역할
    //여기서는 pub 된 메세지가 존재할때, converting, 로깅, 비지니스 로직(DB 저장, 등등) 을 수행하기 위해 설정한다

    private final ObjectMapper objectMapper;
    private final RedisTemplate<String, ChatMessageResponse> chatRedisTemplate;
    private final SimpMessageSendingOperations messagingTemplate;

    public RedisSubscriber(@Qualifier("chatRedisTemplate") RedisTemplate<String, ChatMessageResponse> chatRedisTemplate,
                           ObjectMapper objectMapper,
                           SimpMessageSendingOperations messagingTemplate) {
        this.chatRedisTemplate = chatRedisTemplate;
        this.objectMapper = objectMapper;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            RedisSerializer<String> stringSerializer = chatRedisTemplate.getStringSerializer();
            String publishMessage = stringSerializer.deserialize(message.getBody());

            ChatMessageResponse chatMessageResponse = objectMapper
//                    .registerModule(new JavaTimeModule())
//                    .findAndRegisterModules()
                    .readValue(publishMessage, ChatMessageResponse.class);

            messagingTemplate.convertAndSend("/sub/chat/room/" + chatMessageResponse.getRoomId(), chatMessageResponse);
            log.info("### chat message successfully sent");
            log.info("### roomId: {}", chatMessageResponse.getRoomId());
            log.info("### id: {}", chatMessageResponse.getId());
            log.info("### nickname: {}", chatMessageResponse.getNickname());
            log.info("### message: {}", chatMessageResponse.getMessage());
            log.info("### createdAt: {}", chatMessageResponse.getCreatedAt());
        } catch (Exception e) {
            log.error("### {}", e.getMessage());
        }
    }
}