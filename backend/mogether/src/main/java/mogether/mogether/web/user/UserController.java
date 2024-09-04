package mogether.mogether.web.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import mogether.mogether.application.user.UserService;
import mogether.mogether.domain.oauth.AppUser;
import mogether.mogether.web.user.dto.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@Tag(name = "user", description = "유저 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @Operation(summary = "일반 유저 회원가입", description = "일반 유저의 회원가입 요청",
            responses = {
                    @ApiResponse(responseCode = "201", description = "유저의 회원가입 성공"),
            })
    @PostMapping("/join")
    public UserJoinResponse join(@RequestPart(name = "image", required = false) MultipartFile image,
                                 @RequestPart(name = "dto") @Validated UserJoinRequest userJoinRequest) {
        return userService.join(userJoinRequest, image);
    }

    @Operation(summary = "유저 정보 변경", description = "유저 정보를 변경한다",
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저 정보 변경 성공"),
            })
    @PatchMapping("/{userId}")
    public UserUpdateResponse update(@PathVariable("userId") Long userId,
                                     @AuthenticationPrincipal AppUser appUser,
                                     @RequestPart(name = "image", required = false) MultipartFile image,
                                     @RequestPart(name = "dto") @Validated UserUpdateRequest userUpdateRequest
                                    ) {
        return userService.update(userId, appUser, userUpdateRequest, image);
    }

    @Operation(summary = "비밀번호 변경", description = "유저의 비밀번호를 변경한다",
            responses = {
                    @ApiResponse(responseCode = "200", description = "비밀번호 변경 성공"),
            })
    @PatchMapping("/{userId}/password")
    public HttpStatus updatePassword(@PathVariable("userId") Long userId,
                                     @AuthenticationPrincipal AppUser appUser,
                                     @RequestBody @Validated PasswordUpdateRequest passwordUpdateRequest) {
        userService.updatePassword(userId, appUser, passwordUpdateRequest);
        return HttpStatus.OK;
    }

    @Operation(summary = "비밀번호 찾기", description = "유저의 비밀번호를 찾는다",
            responses = {
                    @ApiResponse(responseCode = "200", description = "비밀번호 찾기 성공"),
            })
    @PostMapping("/password")
    public PasswordFindResponse findPassword(@RequestBody @Validated PasswordFindRequest passwordFindRequest) {
        return userService.findPassword(passwordFindRequest);
    }

    @Operation(summary = "유저 정보 조회", description = "유저의 정보를 조회한다",
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저 정보 조회 성공"),
            })
    @GetMapping("/{userId}")
    public UserResponse getUserInfo(@PathVariable(name = "userId") Long userId) {
        return userService.getUserInfo(userId);
    }

    @Operation(summary = "유저 탈퇴", description = "유저 앱 탈퇴를 진행한다.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "유저 앱 탈퇴 성공"),
            })
    @DeleteMapping("/{userId}")
    public HttpStatus quit(@PathVariable(name = "userId") Long userId,
                           @AuthenticationPrincipal AppUser appUser) {
        userService.quit(userId, appUser);
        return HttpStatus.NO_CONTENT;
    }

    @Operation(summary = "소셜 계정 회원가입 추가정보 입력", description = "소셜 계정 회원가입 후 추가 정보를 입력한다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "추가 정보 기입 성공"),
            })
    @PostMapping("/{userId}/oauth2/info")
    public UserJoinResponse addInfoAfterOAuthSignUp(@PathVariable("userId") Long userId,
                                                    @RequestPart(name = "image", required = false) MultipartFile image,
                                                    @RequestPart(name = "dto") @Validated AfterOAuthSignUpRequest afterOAuthSignUpRequest) {
        return userService.addInfoAfterOAuthSignUp(userId, image, afterOAuthSignUpRequest);
    }
}
