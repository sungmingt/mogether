package mogether.mogether.web.appEvent;

import lombok.RequiredArgsConstructor;
import mogether.mogether.application.appEvent.AppEventService;
import mogether.mogether.domain.oauth.AppUser;
import mogether.mogether.domain.oauth.UpcomingEventsResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class AppEventController {

    private final AppEventService appEventService;

    @PostMapping("/{userId}")
    public AppEventCreateResponse createEvent(@PathVariable("userId") Long userId,
                                           @AuthenticationPrincipal AppUser appUser,
                                           @RequestBody AppEventCreateRequest eventCreateRequest) throws IOException, GeneralSecurityException {
        return appEventService.createEvent(userId, eventCreateRequest);
    }

    @GetMapping("/{userId}")
    public List<UpcomingEventsResponse> listEvents(@PathVariable("userId") Long userId,
                                                   @AuthenticationPrincipal AppUser appUser) throws IOException, GeneralSecurityException {
        return appEventService.getUpcomingEvents(userId);
    }
}