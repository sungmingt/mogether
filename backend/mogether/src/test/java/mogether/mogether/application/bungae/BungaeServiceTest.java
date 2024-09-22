package mogether.mogether.application.bungae;

import mogether.mogether.application.bungae.BungaeImageService;
import mogether.mogether.application.bungae.BungaeService;
import mogether.mogether.application.chat.ChatRoomService;
import mogether.mogether.application.user.UserService;
import mogether.mogether.domain.bungae.Bungae;
import mogether.mogether.domain.bungae.BungaeRepository;
import mogether.mogether.domain.bungae.BungaeUserRepository;
import mogether.mogether.domain.info.Address;
import mogether.mogether.domain.oauth.AppUser;
import mogether.mogether.domain.user.User;
import mogether.mogether.web.bungae.dto.BungaeJoinRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.times;

@ExtendWith(MockitoExtension.class)
class BungaeServiceTest {

    @Mock
    private BungaeRepository bungaeRepository;

    @Mock
    private BungaeUserRepository bungaeUserRepository;

    @Mock
    private UserService userService;

    @Mock
    private BungaeImageService bungaeImageService;

    @Mock
    private ChatRoomService chatRoomService;

    @InjectMocks
    private BungaeService bungaeService;

    private final User user = new User(1L, "minjae123@gmail.com", "Passw123@", "kim");
    private final AppUser appUser = new AppUser(user, Map.of(), "");
    private final Bungae bungae = new Bungae(user, "title", "content", List.of("imageUrl"), new Address("seoul", "gangnam", "details"));
    List<MultipartFile> images = List.of(new MockMultipartFile("png", new byte[]{12}));

    @DisplayName("번개에 참여한다 - 성공")
    @Test
    void bungaeJoinTest() {
        //given
        given(userService.findById(user.getId())).willReturn(user);
        given(bungaeRepository.findById(bungae.getId())).willReturn(Optional.of(bungae));

        //when
        bungaeService.join(bungae.getId(), appUser);

        //then
        assertThat(user.getBungaeJoinList()).hasSize(1);
        assertThat(bungae.getBungaeUserList()).hasSize(1);

        then(bungaeUserRepository)
                .should(times(1))
                .save(any());
    }
}