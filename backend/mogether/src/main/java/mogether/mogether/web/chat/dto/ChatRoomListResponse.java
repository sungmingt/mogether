package mogether.mogether.web.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mogether.mogether.domain.chat.ChatRoom;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoomListResponse {

    private String gatherType;
    private Long gatherId;
    private Long roomId;
    private String roomName;
    private int userCount;
    //todo: latestMessage

    public static List<ChatRoomListResponse> of(List<ChatRoom> chatRoomList) {

        return chatRoomList.stream()
                .map(chatRoom -> new ChatRoomListResponse(
                        chatRoom.getGatherType(), chatRoom.getGatherId(),
                        chatRoom.getId(), chatRoom.getName(), chatRoom.getChatRoomUserList().size()))
                .toList();
    }
}
