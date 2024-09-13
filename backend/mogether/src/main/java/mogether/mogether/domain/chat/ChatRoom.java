package mogether.mogether.domain.chat;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import static jakarta.persistence.CascadeType.REMOVE;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ChatRoom implements Serializable {

     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;

     private String name;

     private String gatherType;
     private Long gatherId;

     private int userCount;

     @OneToMany(mappedBy = "chatRoom", cascade = REMOVE)
     private List<ChatRoomUser> chatRoomUserList = new ArrayList<>();

     public ChatRoom(String gatherType, Long gatherId, String roomName) {
          this.gatherType = gatherType;
          this.gatherId = gatherId;
          this.name = roomName;
     }
}
