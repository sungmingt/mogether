package mogether.mogether.web.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mogether.mogether.domain.chat.ChatMessage;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageResponse {

    private String id;
    private Long roomId;
    private Long senderId;
    private String nickname;
    private String senderImageUrl;
    private String message;
    private String createdAt;

    public static ChatMessageResponse of(ChatMessage chatMessage) {
        return new ChatMessageResponse(
                chatMessage.getId(),
                chatMessage.getRoomId(),
                chatMessage.getSenderId(),
                chatMessage.getSenderNickname(),
                chatMessage.getSenderImageUrl(),
                chatMessage.getMessage(),
                chatMessage.getCreatedAt().toString()
        );
    }

}