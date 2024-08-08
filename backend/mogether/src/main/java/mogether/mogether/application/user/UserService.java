package mogether.mogether.application.user;

import lombok.RequiredArgsConstructor;
import mogether.mogether.domain.user.*;
import mogether.mogether.exception.MogetherException;
import mogether.mogether.web.user.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import static mogether.mogether.domain.user.UserValidator.checkPasswordPattern;
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

        User user = createUser(userJoinRequest);
        User savedUser = userRepository.save(user);
        profileImageService.save(user, image);

        return UserJoinResponse.of(savedUser);
    }

    //유저 정보 수정
    public UserUpdateResponse update(Long userId, UserUpdateRequest userUpdateRequest, MultipartFile image) {
        User findUser = findById(userId);
        profileImageService.update(findUser, image);
        updateUser(userUpdateRequest, findUser);

        return UserUpdateResponse.of(findUser);
    }

    //비밀번호 변경
    public void updatePassword(Long userId, UserUpdatePasswordRequest userUpdatePasswordRequest) {
        User findUser = findById(userId);

        validateExpassword(findUser.getPassword(), userUpdatePasswordRequest.getExPassword());
        checkPasswordPattern(userUpdatePasswordRequest.getNewPassword());

        findUser.updatePassword(userUpdatePasswordRequest.getNewPassword());
    }

    //유저 정보 조회
    public UserResponse getUserInfo(Long userId) {
        User findUser = findById(userId);
        return UserResponse.of(findUser);
    }

    //관심 번개 목록


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

    private static User createUser(UserJoinRequest userJoinRequest) {
        return new User(
                userJoinRequest.getEmail(),
                userJoinRequest.getPassword(),
                userJoinRequest.getName(),
                userJoinRequest.getNickname(),
                userJoinRequest.getAddress(),
                userJoinRequest.getAge(),
                userJoinRequest.getGender(),
                userJoinRequest.getIntro(),
                userJoinRequest.getPhoneNumber()
        );
    }

    private static void updateUser(UserUpdateRequest userUpdateRequest, User findUser) {
        findUser.update(
                userUpdateRequest.getName(),
                userUpdateRequest.getNickname(),
                userUpdateRequest.getAddress(),
                userUpdateRequest.getAge(),
                userUpdateRequest.getGender(),
                userUpdateRequest.getIntro(),
                userUpdateRequest.getPhoneNumber()
        );
    }

    private void validateExpassword(String realPassword, String requestedPassword) {
        if (!realPassword.equals(requestedPassword)) {
            throw new MogetherException(PASSWORD_NOT_MATCH);
        }
    }

}
