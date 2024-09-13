package mogether.mogether.domain.chat;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRoomUserRepository extends JpaRepository<ChatRoomUser, Long> {

    List<ChatRoomUser> findByUserId(Long userId);

    List<ChatRoomUser> findByChatRoomId(Long chatroomId);
}
