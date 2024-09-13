package mogether.mogether.web.chat;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import mogether.mogether.application.chat.ChatService;
import mogether.mogether.web.chat.dto.ChatMessageRequest;
import mogether.mogether.web.chat.dto.ChatRoomListResponse;
import mogether.mogether.web.chat.dto.ChatRoomResponse;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "chat", description = "채팅 API")
@RequiredArgsConstructor
@RestController
public class ChatController {

    private final ChatService chatService;

    //Client Message 요청 -> Controller -> Service -> Pub - Redis -> MessageListener -> Sub Logic

    @MessageMapping("/chat/message")
    public void message(ChatMessageRequest chatMessageRequest) {
        chatService.sendMessage(chatMessageRequest);
    }

    @Operation(summary = "채팅방 상세 정보", description = "특정 채팅방의 정보와 채팅 메시지 내역 요청",
            responses = {
                    @ApiResponse(responseCode = "200", description = "채팅방 정보 응답 성공"),
            })
    @GetMapping("/chat/room/{roomId}")
    public ChatRoomResponse getChatRoom(@PathVariable("roomId") Long roomId){
        return chatService.getChatRoom(roomId);
    }

    @Operation(summary = "유저가 참여한 채팅방 리스트", description = "유저가 참여한 채팅방 리스트 요청",
            responses = {
                    @ApiResponse(responseCode = "200", description = "채팅방 리스트 응답 성공"),
            })
    @GetMapping("/user/{userId}/chat")
    public List<ChatRoomListResponse> getChatMessageList(@PathVariable("userId") Long userId){
        return chatService.getChatRoomList(userId);
    }
}