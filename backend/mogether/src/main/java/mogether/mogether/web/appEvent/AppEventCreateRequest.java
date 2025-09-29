package mogether.mogether.web.appEvent;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AppEventCreateRequest {

    private String summary;
    private String description;
    private String location;
    //@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String googleEventId;

    public void setGoogleEventId(String googleEventId) {
        this.googleEventId = googleEventId;
    }
}
