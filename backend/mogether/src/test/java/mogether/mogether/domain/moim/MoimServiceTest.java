package mogether.mogether.domain.moim;

import mogether.mogether.application.chat.ChatRoomService;
import mogether.mogether.application.moim.MoimImageService;
import mogether.mogether.application.moim.MoimService;
import mogether.mogether.application.user.UserService;
import mogether.mogether.domain.info.Address;
import mogether.mogether.domain.info.Keyword;
import mogether.mogether.domain.oauth.AppUser;
import mogether.mogether.domain.user.User;
import mogether.mogether.web.moim.dto.MoimCreateRequest;
import mogether.mogether.web.moim.dto.MoimCreateResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.times;

@ExtendWith(MockitoExtension.class)
class MoimServiceTest {

    @Mock
    private MoimRepository moimRepository;

    @Mock
    private MoimUserRepository moimUserRepository;

    @Mock
    private UserService userService;

    @Mock
    private MoimImageService moimImageService;

    @Mock
    private ChatRoomService chatRoomService;

    @InjectMocks
    private MoimService moimService;

    private final User user = new User(1L, "minjae123@gmail.com", "Passw123@", "kim");
    private final AppUser appUser = new AppUser(user, Map.of(), "");
    private final Moim moim = new Moim(user, "title", "content", List.of("imageUrl"), new Address("seoul", "gangnam", "details"));
    List<MultipartFile> images = List.of(new MockMultipartFile("png", new byte[]{12}));

    @DisplayName("모임에 참여한다 - 성공")
    @Test
    void moimJoinTest() {
        //given
        given(userService.findById(user.getId())).willReturn(user);
        given(moimRepository.findById(moim.getId())).willReturn(Optional.of(moim));

        //when
        moimService.join(moim.getId(), appUser);

        //then
        assertThat(user.getMoimJoinList()).hasSize(1);
        assertThat(moim.getMoimUserList()).hasSize(1);

        then(moimUserRepository)
                .should(times(1))
                .save(any());
    }

    @DisplayName("모임 글을 작성한다 - 성공")
    @Test
    void moimCreateTest() {
        //given
        MoimCreateRequest request = new MoimCreateRequest(user.getId(), "title", "content",
                "PARTY", new Address(), LocalDate.of(2024, 1, 1), LocalDate.of(2024, 1, 2));
        given(userService.findById(user.getId())).willReturn(user);
        given(moimRepository.save(any())).willReturn(request.toMoim(user));

        //when
        MoimCreateResponse response = moimService.create(appUser, images, request);

        //then
        assertThat(response.getKeyword()).isEqualTo(Keyword.of(request.getKeyword()));
        assertThat(response.getContent()).isEqualTo(request.getContent());

        then(moimRepository)
                .should(times(1))
                .save(any());
        then(moimImageService)
                .should(times(1))
                .save(any(), eq(images));
    }
}