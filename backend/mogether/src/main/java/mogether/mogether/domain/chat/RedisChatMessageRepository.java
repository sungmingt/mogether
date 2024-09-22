package mogether.mogether.domain.chat;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public class RedisChatMessageRepository {

    private static final String ROOM_KEY_PREFIX = "chatMessage:room:";

    private final RedisTemplate<String, ChatMessage> chatMessageRedisTemplate;
    private final HashOperations<String, String, ChatMessage> hashOperations;

    public RedisChatMessageRepository(@Qualifier("chatMessageRedisTemplate") RedisTemplate<String, ChatMessage> chatMessageRedisTemplate) {
        this.chatMessageRedisTemplate = chatMessageRedisTemplate;
        this.hashOperations = chatMessageRedisTemplate.opsForHash();
    }

    public Optional<ChatMessage> findById(Long roomId, String id) {
        return Optional.ofNullable(hashOperations.get(getRoomKey(roomId), id));
    }

    public List<ChatMessage> findByRoomId(Long roomId) {
        String roomKey = getRoomKey(roomId);
        return hashOperations.values(roomKey);
    }

    public List<ChatMessage> findAll() {
        Set<String> roomKeys = chatMessageRedisTemplate.keys(ROOM_KEY_PREFIX + "*");
        List<ChatMessage> chatMessages = new ArrayList<>();

        if (roomKeys != null) {
            for (String roomKey : roomKeys) {
                chatMessages.addAll(hashOperations.values(roomKey));
            }
        }

        return chatMessages;
    }

    public void save(ChatMessage chatMessage) {
        String roomKey = getRoomKey(chatMessage.getRoomId());
        hashOperations.put(roomKey, chatMessage.getId(), chatMessage);
        chatMessageRedisTemplate.expire(roomKey, Duration.ofHours(25));
    }

    public void saveAllToRedis(List<ChatMessage> messages) {
        for (ChatMessage message : messages) {
            String roomKey = getRoomKey(message.getRoomId());
            hashOperations.put(roomKey, message.getId(), message);
            chatMessageRedisTemplate.expire(roomKey, Duration.ofHours(25));
        }
    }

    public void clearAll() {
        Set<String> roomKeys = chatMessageRedisTemplate.keys(ROOM_KEY_PREFIX + "*");
        if (roomKeys != null) {
            for (String roomKey : roomKeys) {
                chatMessageRedisTemplate.delete(roomKey);  // Delete each room key
            }
        }
    }

    public void deleteById(Long roomId, Long id) {
        hashOperations.delete(getRoomKey(roomId), String.valueOf(id));
    }

    private String getRoomKey(Long roomId) {
        return ROOM_KEY_PREFIX + roomId;
    }
}
