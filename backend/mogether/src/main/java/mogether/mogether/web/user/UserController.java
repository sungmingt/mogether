package mogether.mogether.web.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import mogether.mogether.application.user.UserService;
import mogether.mogether.domain.bungae.Bungae;
import mogether.mogether.domain.moim.Moim;
import mogether.mogether.web.bungae.dto.BungaeListResponse;
import mogether.mogether.web.moim.dto.MoimListResponse;
import mogether.mogether.web.user.dto.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

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
    public UserJoinResponse join(@RequestPart(name = "image") MultipartFile image,
                                 @RequestPart(name = "dto") UserJoinRequest userJoinRequest) {
        return userService.join(userJoinRequest, image);
    }

    @Operation(summary = "유저 정보 변경", description = "유저 정보를 변경한다",
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저 정보 변경 성공"),
            })
    @PatchMapping("/{userId}")
    public UserUpdateResponse update(@PathVariable Long userId,
                                     @RequestPart(name = "image") MultipartFile image,
                                     @RequestPart(name = "dto") UserUpdateRequest userUpdateRequest) {
        return userService.update(userId, userUpdateRequest, image);
    }

    @Operation(summary = "비밀번호 변경", description = "유저의 비밀번호를 변경한다",
            responses = {
                    @ApiResponse(responseCode = "200", description = "비밀번호 변경 성공"),
            })
    @PatchMapping("/{userId}/password") ////
    public HttpStatus updatePassword(@PathVariable Long userId,
                                     @RequestBody UserUpdatePasswordRequest userUpdatePasswordRequest) {
        userService.updatePassword(userId, userUpdatePasswordRequest);
        return HttpStatus.OK;
    }

    @Operation(summary = "유저 정보 조회", description = "유저의 정보를 조회한다",
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저 정보 조회 성공"),
            })
    @GetMapping("/{userId}")
    public UserResponse getUserInfo(@PathVariable(name = "userId") Long userId) {
        return userService.getUserInfo(userId);
    }

    //관심 번개 목록
    @Operation(summary = "유저의 관심 번개 리스트 조회", description = "유저의 관심 번개 리스트를 조회한다",
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저의 관심 번개 리스트 조회 성공"),
            })
    @GetMapping("/{userId}/interest/bungae")
    public List<BungaeListResponse> getBungaeInterestList(@PathVariable Long userId) {
        List<Bungae> bungaeList = new ArrayList<>();
        return BungaeListResponse.toBungaeListResponse(bungaeList);
    }

    //관심 모임 목록
    @Operation(summary = "유저의 관심 모임 리스트 조회", description = "유저의 관심 모임 리스트를 조회한다",
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저의 관심 모임 리스트 조회 성공"),
            })
    @GetMapping("/{userId}/interest/moim")
    public List<MoimListResponse> getMoimInterestList(@PathVariable Long userId) {
        List<Moim> moimList = new ArrayList<>();
        return MoimListResponse.toMoimListResponse(moimList);
    }

    @Operation(summary = "유저가 등록한 번개 리스트 조회", description = "유저가 등록한 번개 리스트를 조회한다",
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저가 등록한 번개 리스트 조회 성공"),
            })
    @GetMapping("/{userId}/host/bungae") /////
    public List<BungaeListResponse> getBungaeHostingList(@PathVariable Long userId) {
        List<Bungae> bungaeList = new ArrayList<>();
        return BungaeListResponse.toBungaeListResponse(bungaeList);
    }

    @Operation(summary = "유저가 등록한 모임 리스트 조회", description = "유저가 등록한 모임 리스트를 조회한다",
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저가 등록한 모임 리스트 조회 성공"),
            })
    @GetMapping("/{userId}/host/moim") /////
    public List<MoimListResponse> getMoimHostingList(@PathVariable Long userId) {
        List<Moim> moimList = new ArrayList<>();
        return MoimListResponse.toMoimListResponse(moimList);
    }
}
