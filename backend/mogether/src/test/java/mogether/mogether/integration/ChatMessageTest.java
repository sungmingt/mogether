package mogether.mogether.integration;

import mogether.mogether.application.chat.ChatService;
import mogether.mogether.domain.bungae.Bungae;
import mogether.mogether.domain.bungae.BungaeRepository;
import mogether.mogether.domain.chat.ChatMessage;
import mogether.mogether.domain.chat.ChatRoom;
import mogether.mogether.domain.chat.ChatRoomRepository;
import mogether.mogether.domain.chat.RedisChatMessageRepository;
import mogether.mogether.domain.info.Address;
import mogether.mogether.domain.user.User;
import mogether.mogether.domain.user.UserRepository;
import mogether.mogether.web.chat.dto.ChatMessageRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class ChatMessageTest {

    @Autowired
    private ChatService chatService;

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BungaeRepository bungaeRepository;

    @Autowired
    private RedisChatMessageRepository redisChatMessageRepository;

    private User user;
    private Bungae bungae;
    private ChatRoom chatRoom;

    @BeforeEach
    void beforeEach() {
        redisChatMessageRepository.clearAll();
        user = userRepository.save(new User("email@gmail.com", "password", "김수현"));
        bungae = bungaeRepository.save(new Bungae(user, "title", "content", List.of("abc"), new Address()));
        chatRoom = chatRoomRepository.save(new ChatRoom("bungae", bungae.getId(), "농구 동호회 모집"));
    }

    @DisplayName("채팅 메시지를 전송한다")
    @Test
    void sendMessageTest() {
        //given
        ChatMessageRequest request = new ChatMessageRequest(1L, 1L, "hello", "2024-09-01 20:21");

        //when
        chatService.sendMessage(request);

        //then
        List<ChatMessage> chatMessages = redisChatMessageRepository.findByRoomId(chatRoom.getId());
        assertThat(chatMessages).hasSize(1);
    }
}
