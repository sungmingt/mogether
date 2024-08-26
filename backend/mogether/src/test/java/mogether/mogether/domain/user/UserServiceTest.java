package mogether.mogether.domain.user;

import mogether.mogether.application.user.ProfileImageService;
import mogether.mogether.application.user.UserService;
import mogether.mogether.domain.info.Address;
import mogether.mogether.domain.info.Gender;
import mogether.mogether.domain.oauth.AppUser;
import mogether.mogether.exception.ErrorCode;
import mogether.mogether.exception.MogetherException;
import mogether.mogether.web.user.dto.AfterOAuthSignUpRequest;
import mogether.mogether.web.user.dto.PasswordUpdateRequest;
import mogether.mogether.web.user.dto.UserJoinRequest;
import mogether.mogether.web.user.dto.UserJoinResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Optional;

import static java.lang.Boolean.*;
import static mogether.mogether.application.user.UserValidator.*;
import static mogether.mogether.exception.ErrorCode.PASSWORD_NOT_MATCH;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.times;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private ProfileImageService profileImageService;

    @InjectMocks
    private UserService userService;

    private final User user = new User(1L, "kim123@gmail.com", encodePassword("Password123@"), "kim");
    private final AppUser appUser = new AppUser(user, Map.of(), "");
    MultipartFile image = new MockMultipartFile("png", new byte[]{12});

    @DisplayName("회원 가입을 진행한다 - 성공")
    @Test
    void userJoinTest() {
        //given
        UserJoinRequest request = new UserJoinRequest(
                "kim123@gmail.com", "Password123@", "kim",
                new Address(), 25, "MALE", "", "");

        given(userRepository.existsByEmail(request.getEmail())).willReturn(FALSE);
        given(userRepository.save(any())).willReturn(user);

        //when
        UserJoinResponse response = userService.join(request, image);

        //then
        assertThat(response.getEmail()).isEqualTo(request.getEmail());
        assertThat(response.getNickname()).isEqualTo(request.getNickname());

        then(userRepository)
                .should(times(1))
                .save(any());
        then(userRepository)
                .should(times(1))
                .existsByEmail(any());
    }

    @DisplayName("회원 가입을 진행한다 - 실패 (이메일 중복)")
    @Test
    void userJoinTestFailsByEmailDuplication() {
        //given
        UserJoinRequest request = new UserJoinRequest(
                "kim123@gmail.com", "Password123@", "kim",
                new Address(), 25, "MALE", "", "");

        given(userRepository.existsByEmail(request.getEmail())).willReturn(TRUE);

        //when,then
        assertThatThrownBy(() -> userService.join(request, image))
                .isInstanceOf(MogetherException.class)
                .hasMessage(ErrorCode.EMAIL_ALREADY_EXISTS.getMessage());

        then(userRepository)
                .should(times(1))
                .existsByEmail(any());
    }

    @DisplayName("회원 가입을 진행한다 - 실패 (올바르지 않은 비밀번호 형식)")
    @Test
    void userJoinTestFailsByInvalidPasswordPattern() {
        //given
        UserJoinRequest request = new UserJoinRequest(
                "kim123@gmail.com", "pass12@", "kim",
                new Address(), 25, "MALE", "", "");

        given(userRepository.existsByEmail(request.getEmail())).willReturn(FALSE);

        //when,then
        assertThatThrownBy(() -> userService.join(request, image))
                .isInstanceOf(MogetherException.class)
                .hasMessage(ErrorCode.PASSWORD_NOT_VALID.getMessage());

        then(userRepository)
                .should(times(1))
                .existsByEmail(any());
    }


    @DisplayName("비밀번호 변경을 진행한다 - 성공")
    @Test
    void passwordUpdateTest() {
        //given
        PasswordUpdateRequest request = new PasswordUpdateRequest("Password123@", "newPassword123@");
        given(userRepository.findById(anyLong())).willReturn(Optional.of(user));

        //when
        userService.updatePassword(user.getId(), appUser, request);

        //then
        assertThat(user.getPassword()).isEqualTo(encodePassword(request.getNewPassword()));
    }

    @DisplayName("비밀번호 변경을 진행한다 - 실패 (기존 비밀번호 불일치)")
    @Test
    void passwordUpdateTestFailsByInvalidExPW() {
        //given
        PasswordUpdateRequest request = new PasswordUpdateRequest("Invalid123@", "newPassword123@");
        given(userRepository.findById(anyLong())).willReturn(Optional.of(user));

        //when, then
        assertThatThrownBy(() -> userService.updatePassword(user.getId(), appUser, request))
                .isInstanceOf(MogetherException.class)
                .hasMessage(PASSWORD_NOT_MATCH.getMessage());
    }

    @DisplayName("소셜 회원가입 후 추가 정보를 입력한다 - 성공")
    @Test
    void addInfoAfterOAuthSignUpTest() {
        //given
        AfterOAuthSignUpRequest request = new AfterOAuthSignUpRequest(new Address(), 20, "MALE", "", "");
        given(userRepository.findById(user.getId())).willReturn(Optional.of(user));

        //when
        UserJoinResponse resposne = userService.addInfoAfterOAuthSignUp(user.getId(), appUser, image, request);

        //then
        assertThat(resposne.getGender()).isEqualTo(Gender.of(request.getGender()));
        assertThat(resposne.getAge()).isEqualTo(request.getAge());
    }
}