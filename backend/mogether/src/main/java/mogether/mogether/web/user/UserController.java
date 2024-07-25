package mogether.mogether.web.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import mogether.mogether.domain.bungae.Bungae;
import mogether.mogether.domain.moim.Moim;
import mogether.mogether.web.user.dto.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Tag(name = "user", description = "유저 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    @Operation(summary = "일반 유저 회원가입", description = "일반 유저의 회원가입 요청",
            responses = {
                    @ApiResponse(responseCode = "201", description = "유저의 회원가입 성공"),
            })
    @PostMapping("/join")
    public UserJoinResponse join(@PathVariable Long bungaeId,
                                 @RequestBody UserJoinRequest userJoinRequest) {
        return new UserJoinResponse();
    }

    @Operation(summary = "유저 정보 변경", description = "유저 정보를 변경한다",
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저 정보 변경 성공"),
            })
    @PatchMapping("/{userId}")
    public UserUpdateResponse update(@PathVariable Long userId,
                                     @RequestBody UserUpdateRequest userUpdateRequest) {
        return new UserUpdateResponse();
    }

    @Operation(summary = "비밀번호 변경", description = "유저의 비밀번호를 변경한다",
            responses = {
                    @ApiResponse(responseCode = "200", description = "비밀번호 변경 성공"),
            })
    @PatchMapping("/{userId}/password") ////
    public HttpStatus updatePassword(@PathVariable Long userId) {
        return HttpStatus.OK;
    }

    @Operation(summary = "유저 정보 조회", description = "유저의 정보를 조회한다",
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저 정보 조회 성공"),
            })
    @GetMapping("/{userId}")
    public UserResponse getUserInfo(@PathVariable Long userId) {
        return new UserResponse();
    }

    //관심 있는 글 목록
    @Operation(summary = "유저의 관심 글 리스트 조회", description = "유저의 관심 글 리스트를 조회한다",
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저의 관심 글 리스트 조회 성공"),
            })
    @GetMapping("/{userId}/interests")
    public List<GatheringListResponse> getInterestList(@PathVariable Long userId) {
        List<Bungae> bungaeList = new ArrayList<>();
        List<Moim> moimList = new ArrayList<>();
        return GatheringListResponse.toGatheringListResponse(bungaeList, moimList);
    }

    @Operation(summary = "유저가 등록한 글 리스트 조회", description = "유저가 등록한 글 리스트를 조회한다",
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저의 등록 글 리스트 조회 성공"),
            })
    @GetMapping("/{userId}/hosting") /////
    public List<GatheringListResponse> getHostingList(@PathVariable Long userId) {
        List<Bungae> bungaeList = new ArrayList<>();
        List<Moim> moimList = new ArrayList<>();
        return GatheringListResponse.toGatheringListResponse(bungaeList, moimList);
    }
}
