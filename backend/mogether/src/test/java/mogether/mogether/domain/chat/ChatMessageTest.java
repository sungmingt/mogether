package mogether.mogether.domain.chat;

import mogether.mogether.application.chat.ChatService;
import mogether.mogether.domain.bungae.Bungae;
import mogether.mogether.domain.bungae.BungaeRepository;
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

    @BeforeEach
    void beforeEach() {
        User user = userRepository.save(new User(1L, "email@gmail.com", "password", "김수현"));
        bungaeRepository.save(new Bungae(user, "title", "content", List.of("abc"), new Address()));
        chatRoomRepository.save(new ChatRoom("bungae", 1L, "농구 동호회 모집"));

    }

    @DisplayName("채팅 메시지를 전송한다")
    @Test
    void messageSendTest() {
        ChatMessageRequest request = new ChatMessageRequest(1L, 1L, "hello", "2024-09-01 20:21");
        chatService.sendMessage(request);

        List<ChatMessage> chatMessages = redisChatMessageRepository.findByRoomId(1L);

        for(ChatMessage message : chatMessages){
            String id = message.getId();

            System.out.println(message.getMessage());
            System.out.println(message.getId());

            System.out.println(redisChatMessageRepository.findById(1L, id).get().getId());
        }
    }
}
