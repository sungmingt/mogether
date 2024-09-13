package mogether.mogether.web.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mogether.mogether.domain.chat.ChatMessage;
import mogether.mogether.domain.chat.ChatRoom;
import mogether.mogether.domain.user.User;
import mogether.mogether.web.Participant;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoomResponse {

    private String gatherType;
    private Long gatherId;
    private Long roomId;
    private String roomName;
    private List<ChatMessageResponse> chatMessageList;
    private int userCount;
    private List<Participant> participants;

    public static ChatRoomResponse of(ChatRoom chatRoom,
                                      List<ChatMessage> chatMessageList,
                                      List<User> joinUsers){

        List<ChatMessageResponse> chatMessageResponseList = chatMessageList.stream()
                .map(ChatMessageResponse::of)
                .toList();

        List<Participant> participants = joinUsers.stream()
                .map(user -> new Participant(user.getId(), user.getNickname(), user.getImageUrl()))
                .toList();

        return new ChatRoomResponse(
                chatRoom.getGatherType(), chatRoom.getGatherId(), chatRoom.getId(),
                chatRoom.getName(), chatMessageResponseList, participants.size(), participants
        );
    }
}
