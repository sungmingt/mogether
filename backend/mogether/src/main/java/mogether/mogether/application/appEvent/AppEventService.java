package mogether.mogether.application.appEvent;

import com.google.api.services.calendar.Calendar.Events;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.UserCredentials;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import mogether.mogether.domain.appEvent.AppEvent;
import mogether.mogether.domain.appEvent.AppEventRepository;
import mogether.mogether.domain.oauth.UpcomingEventsResponse;
import mogether.mogether.domain.token.OAuth2Token;
import mogether.mogether.domain.token.redis.RedisOAuth2TokenRepository;
import mogether.mogether.exception.MogetherException;
import mogether.mogether.web.appEvent.AppEventCreateRequest;
import mogether.mogether.web.appEvent.AppEventCreateResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import static mogether.mogether.exception.ErrorCode.CALENDAR_INSERT_FAILED;

@Service
@RequiredArgsConstructor
public class AppEventService {

    private final RedisOAuth2TokenRepository redisOAuth2TokenRepository;
    private final AppEventRepository appEventRepository;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;
    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;

    public Calendar getCalendarService(Long userId) throws GeneralSecurityException, IOException {
        //Redis에서 사용자 OAuth2 토큰 조회
        OAuth2Token token = redisOAuth2TokenRepository.findByUserId(userId);

        //UserCredentials 생성, Credential 구성
        GoogleCredentials credentials;
        if (token.getRefreshToken() != null) {
            // refresh token 존재 -> UserCredentials 사용
            credentials = UserCredentials.newBuilder()
                    .setClientId(clientId)
                    .setClientSecret(clientSecret)
                    .setAccessToken(new AccessToken(token.getAccessToken(), null))
                    .setRefreshToken(token.getRefreshToken())
                    .build();
        } else {
            //refresh token 없음 -> 단발성 AccessToken
            credentials = GoogleCredentials.create(new AccessToken(token.getAccessToken(), null));
        }

        //HttpRequestInitializer 생성
        HttpRequestInitializer requestInitializer = new HttpCredentialsAdapter(credentials);

        //Calendar 클라이언트 생성
        return new Calendar.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JacksonFactory.getDefaultInstance(),
                requestInitializer
        )
                .setApplicationName("GoogleCalendarApp")
                .build();
    }

    //google calendar에 일정 추가
    public AppEventCreateResponse createEvent(Long userId, AppEventCreateRequest dto) {
        //RDB save
        AppEvent appEvent = AppEvent.builder()
                .summary(dto.getSummary())
                .description(dto.getDescription())
                .location(dto.getLocation())
                .startTme(dto.getStartTime())
                .endTime(dto.getEndTime())
                .build();

        appEventRepository.save(appEvent);

        try {
            Calendar service = getCalendarService(userId);
            Event googleEvent = new Event()
                    .setSummary(dto.getSummary())
                    .setDescription(dto.getDescription())
                    .setLocation(dto.getLocation())
                    .setStart(new EventDateTime().setDateTime(toGoogleDateTime(dto.getStartTime())))
                    .setEnd(new EventDateTime().setDateTime(toGoogleDateTime(dto.getEndTime())));

            //기본 캘린더에 추가
            //primary : 기본 캘린더. (이외에 회사 캘린더 등이 있음)
            Event createdEvent = service.events().insert("primary", googleEvent).execute();

            //insert googleEventId
            appEvent.setGoogleEventId(createdEvent.getId());
            appEventRepository.save(appEvent);

            return AppEventCreateResponse.of(appEvent.getId(), createdEvent);

        } catch (IOException | GeneralSecurityException ex) {
            //구글 API 호출 실패 → rollback
            throw new MogetherException(CALENDAR_INSERT_FAILED);
        }
    }

    private DateTime toGoogleDateTime(LocalDateTime ldt) {
        return new DateTime(ZonedDateTime.of(ldt, ZoneId.systemDefault())
                .toInstant().toEpochMilli());
    }

    //google calendar 불러오기
    public List<UpcomingEventsResponse> getUpcomingEvents(Long userId) throws IOException, GeneralSecurityException {
        Calendar service = getCalendarService(userId);

        //현재로부터 3개월치 일정 불러오기
        LocalDateTime start = LocalDateTime.now();
        LocalDateTime end = start.plusMonths(3);

        //Google DateTime expects milliseconds since epoch (UTC), so convert with ZoneId
        DateTime timeMin = new DateTime(ZonedDateTime.of(start, ZoneId.systemDefault()).toInstant().toEpochMilli());
        DateTime timeMax = new DateTime(ZonedDateTime.of(end, ZoneId.systemDefault()).toInstant().toEpochMilli());

        Events.List request = service.events().list("primary")
                .setSingleEvents(true) //반복 이벤트를 인스턴스 단위로 구성
                .setOrderBy("startTime") // 시작 시간 순 정렬
                .setTimeMin(timeMin)
                .setTimeMax(timeMax);

        List<Event> events = request.execute().getItems();
        return UpcomingEventsResponse.of(events);
    }
}