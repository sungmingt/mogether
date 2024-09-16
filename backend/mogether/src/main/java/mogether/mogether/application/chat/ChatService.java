package mogether.mogether.application.chat;

import lombok.RequiredArgsConstructor;
import mogether.mogether.application.user.UserService;
import mogether.mogether.domain.chat.ChatMessage;
import mogether.mogether.domain.chat.ChatRoom;
import mogether.mogether.domain.chat.RedisChatMessageRepository;
import mogether.mogether.domain.user.User;
import mogether.mogether.web.chat.*;
import mogether.mogether.web.chat.dto.ChatMessageRequest;
import mogether.mogether.web.chat.dto.ChatMessageResponse;
import mogether.mogether.web.chat.dto.ChatRoomListResponse;
import mogether.mogether.web.chat.dto.ChatRoomResponse;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Transactional
@Service
public class ChatService {

    private final ChatRoomService chatRoomService;
    private final RedisChatMessageRepository redisChatMessageRepository;
    private final UserService userService;
    private final RedisPublisher redisPublisher;
    private final RedisMessageListenerContainer listenerContainer;

    //리스너에 수신된 메시지를 messagingTemplate을 이용해 WebSocket 구독자들에게 메시지를 전달
    //Redis로부터 온 메시지를 역직렬화하여 ChatMessage DTO로 전환뒤 필요한 정보와 함께 메시지를 전달한다.
    public void sendMessage(ChatMessageRequest request) {
        //todo: user info caching
        User user = userService.findById(request.getSenderId());

        //채팅 생성/저장
        ChatMessage chatMessage = createChatMessage(request, user);
        redisChatMessageRepository.save(chatMessage);

        String topic = createTopic(chatMessage.getRoomId());
        ChatMessageResponse chatMessageResponse = ChatMessageResponse.of(chatMessage);

        //publish
        redisPublisher.publish(topic, chatMessageResponse);
    }

    //채팅방 정보 반환
    @Transactional(readOnly = true)
    public ChatRoomResponse getChatRoom(Long roomId) {
        ChatRoom chatRoom = chatRoomService.findById(roomId);
        List<User> participants = chatRoomService.findJoinUsers(roomId);
        List<ChatMessage> chatMessageList = redisChatMessageRepository.findByRoomId(roomId);
        return ChatRoomResponse.of(chatRoom, chatMessageList, participants);
    }

    //유저의 채팅 리스트 반환
    @Transactional(readOnly = true)
    public List<ChatRoomListResponse> getChatRoomList(Long userId) {
        List<ChatRoom> chatRoomList = chatRoomService.findChatRoomList(userId);
        return ChatRoomListResponse.of(chatRoomList);
    }

    private String createTopic(Long roomId) {
        return "chatRoom:" + roomId;
    }

    private ChatMessage createChatMessage(ChatMessageRequest request, User user) {
        return ChatMessage.builder()
                .id(UUID.randomUUID().toString())
                .roomId(request.getRoomId())
                .senderId(user.getId())
                .senderNickname(user.getNickname())
                .senderImageUrl(user.getImageUrl())
                .message(request.getMessage())
                .createdAt(request.getCreatedAt())
                .build();
    }
}
