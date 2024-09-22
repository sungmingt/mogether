package mogether.mogether.domain.chat;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomUserRepository extends JpaRepository<ChatRoomUser, Long> {

    List<ChatRoomUser> findByUserId(Long userId);

    List<ChatRoomUser> findByChatRoomId(Long chatroomId);

    Optional<ChatRoomUser> findByChatRoomIdAndUserId(Long chatRoomId, Long userId);
}
