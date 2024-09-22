package mogether.mogether.application.chat;

import lombok.RequiredArgsConstructor;
import mogether.mogether.domain.chat.ChatRoom;
import mogether.mogether.domain.chat.ChatRoomRepository;
import mogether.mogether.domain.chat.ChatRoomUser;
import mogether.mogether.domain.chat.ChatRoomUserRepository;
import mogether.mogether.domain.bungae.Bungae;
import mogether.mogether.domain.moim.Moim;
import mogether.mogether.domain.user.User;
import mogether.mogether.exception.ErrorCode;
import mogether.mogether.exception.MogetherException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static mogether.mogether.exception.ErrorCode.CHATROOM_NOT_FOUND;

@Transactional
@RequiredArgsConstructor
@Service
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomUserRepository chatRoomUserRepository;

    public void joinBungaeChatRoom(User user, Bungae bungae) {
        ChatRoom chatRoom = chatRoomRepository.findById(bungae.getChatRoom().getId())
                .orElseThrow(() -> new MogetherException(CHATROOM_NOT_FOUND));

        ChatRoomUser chatRoomUser = new ChatRoomUser(chatRoom, user);
        chatRoomUserRepository.save(chatRoomUser);
    }

    public void joinMoimChatRoom(User user, Moim moim) {
        ChatRoom chatRoom = chatRoomRepository.findById(moim.getChatRoom().getId())
                .orElseThrow(() -> new MogetherException(CHATROOM_NOT_FOUND));

        ChatRoomUser chatRoomUser = new ChatRoomUser(chatRoom, user);
        chatRoomUserRepository.save(chatRoomUser);
    }

    public void createBungaeChatRoom(Bungae bungae) {
        ChatRoom chatRoom = new ChatRoom("bungae", bungae.getId(), bungae.getTitle());
        ChatRoom savedChatRoom = chatRoomRepository.save(chatRoom);
        bungae.setChatRoom(savedChatRoom);
    }

    public void createMoimChatRoom(Moim moim) {
        ChatRoom chatRoom = new ChatRoom("moim", moim.getId(), moim.getTitle());
        ChatRoom savedChatRoom = chatRoomRepository.save(chatRoom);
        moim.setChatRoom(savedChatRoom);
    }

    public List<User> findJoinUsers(Long roomId) {
        List<ChatRoomUser> chatRoomUserList = chatRoomUserRepository.findByChatRoomId(roomId);
        return chatRoomUserList.stream()
                .map(ChatRoomUser::getUser)
                .toList();
    }

    public List<ChatRoom> findChatRoomList(Long userId) {
        List<ChatRoomUser> chatRoomUserList = chatRoomUserRepository.findByUserId(userId);
        return chatRoomUserList.stream()
                .map(ChatRoomUser::getChatRoom)
                .toList();
    }

    public ChatRoom findById(Long roomId) {
        return chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new MogetherException(CHATROOM_NOT_FOUND));
    }

    public void deleteChatRoom(Long roomId) {
        chatRoomRepository.deleteById(roomId);
    }

    public void deleteJoinUser(Long chatRoomId, Long userId) {
        ChatRoomUser chatRoomUser = chatRoomUserRepository.findByChatRoomIdAndUserId(chatRoomId, userId)
                .orElseThrow(() -> new MogetherException(ErrorCode.CHATROOMUSER_NOT_FOUND));
        chatRoomUserRepository.delete(chatRoomUser);
    }
}
