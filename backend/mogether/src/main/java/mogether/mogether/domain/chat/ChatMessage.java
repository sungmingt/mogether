package mogether.mogether.domain.chat;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ChatMessage implements Serializable {

    @Id
    private String id;

    private Long roomId;
    private Long senderId;
    private String senderNickname;
    private String senderImageUrl;
    private String message;

    private String createdAt;
}