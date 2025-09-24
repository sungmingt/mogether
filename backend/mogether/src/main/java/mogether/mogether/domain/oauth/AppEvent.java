package mogether.mogether.domain.oauth;

import jakarta.persistence.*;
import lombok.*;
import mogether.mogether.domain.user.User;

import java.time.LocalDateTime;

import static jakarta.persistence.FetchType.LAZY;

@Entity
@Getter
@AllArgsConstructor
@Builder
public class AppEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String summary;
    private String description;
    private String location;
    private LocalDateTime startTme;
    private LocalDateTime endTime;

    private String googleEventId; // 구글 캘린더에 등록된 이벤트 ID (동기화 용)

    public void setGoogleEventId(String googleEventId) {
        this.googleEventId = googleEventId;
    }
}