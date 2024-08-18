package mogether.mogether.application.user;

import lombok.RequiredArgsConstructor;
import mogether.mogether.domain.info.Gender;
import mogether.mogether.domain.oauth.AppUser;
import mogether.mogether.domain.user.*;
import mogether.mogether.exception.MogetherException;
import mogether.mogether.web.user.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import static mogether.mogether.application.user.UserValidator.*;
import static mogether.mogether.application.user.UserValidator.checkPasswordPattern;
import static mogether.mogether.exception.ErrorCode.*;

@Transactional
@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final ProfileImageService profileImageService;

    //회원가입
    public UserJoinResponse join(UserJoinRequest userJoinRequest, MultipartFile image) {
        checkEmailExists(userJoinRequest.getEmail());
        checkPasswordPattern(userJoinRequest.getPassword());

        User user = (userJoinRequest.toUser());
        User savedUser = userRepository.save(user);
        profileImageService.save(user, image);

        return UserJoinResponse.of(savedUser);
    }

    //유저 정보 수정
    public UserUpdateResponse update(Long userId, AppUser appUser,
                                     UserUpdateRequest userUpdateRequest, MultipartFile image) {
        validateUser(userId, appUser.getId());

        User findUser = findById(userId);
        profileImageService.update(findUser, image);
        updateUser(userUpdateRequest, findUser);

        return UserUpdateResponse.of(findUser);
    }

    //비밀번호 변경
    public void updatePassword(Long userId, AppUser appUser, PasswordUpdateRequest passwordUpdateRequest) {
        validateUser(userId, appUser.getId());

        User findUser = findById(userId);
        validateExpasswordSameness(findUser.getPassword(), encodePassword(passwordUpdateRequest.getExPassword()));
        checkPasswordPattern(passwordUpdateRequest.getNewPassword());

        findUser.updatePassword(encodePassword(passwordUpdateRequest.getNewPassword()));
    }

    //유저 정보 조회
    @Transactional(readOnly = true)
    public UserResponse getUserInfo(Long userId) {
        User findUser = findById(userId);
        return UserResponse.of(findUser);
    }

    //탈퇴
    public void quit(Long userId, AppUser appUser) {
        validateUser(userId, appUser.getId());
        userRepository.deleteById(userId);
    }

    public UserJoinResponse addInfoAfterOAuthSignUp(Long userId, AppUser appUser, AfterOAuthSignUpRequest request) {
        validateUser(userId, appUser.getId());

        User findUser = findById(userId);
        findUser.update(
                findUser.getNickname(), request.getAddress(), request.getAge(),
                Gender.of(request.getGender()), request.getIntro(), request.getPhoneNumber());

        return UserJoinResponse.of(findUser);
    }


    @Transactional(readOnly = true)
    public String getProfileImageUrl(Long userId) {
        User user = findById(userId);
        return profileImageService.getImageUrl(user);
    }

    @Transactional(readOnly = true)
    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new MogetherException(USER_NOT_FOUND));
    }

    private void checkEmailExists(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new MogetherException(EMAIL_ALREADY_EXISTS);
        }
    }

    private static void updateUser(UserUpdateRequest userUpdateRequest, User findUser) {
        findUser.update(
                userUpdateRequest.getNickname(),
                userUpdateRequest.getAddress(),
                userUpdateRequest.getAge(),
                Gender.of(userUpdateRequest.getGender()),
                userUpdateRequest.getIntro(),
                userUpdateRequest.getPhoneNumber()
        );
    }

    private void validateExpasswordSameness(String realPassword, String requestedPassword) {
        if (!realPassword.equals(requestedPassword)) {
            throw new MogetherException(PASSWORD_NOT_MATCH);
        }
    }
}
