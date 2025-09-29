package mogether.mogether.web.appEvent;

import com.google.api.services.calendar.model.Event;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mogether.mogether.domain.oauth.UpcomingEventsResponse;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AppEventCreateResponse {

    private Long id;
    private String summary;
    private String description;
    private String location;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String googleEventId;

    public static AppEventCreateResponse of(Long id, Event event) {
        return new AppEventCreateResponse(
                id, event.getSummary(), event.getDescription(), event.getLocation(),
                UpcomingEventsResponse.eventDateTimeToLocalDateTime(event.getStart()),
                UpcomingEventsResponse.eventDateTimeToLocalDateTime(event.getEnd()),
                event.getId()
        );
    }
}