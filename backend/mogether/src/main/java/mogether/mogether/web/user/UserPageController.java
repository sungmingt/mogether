package mogether.mogether.web.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import mogether.mogether.application.bungae.BungaeService;
import mogether.mogether.application.interest.BungaeInterestService;
import mogether.mogether.application.interest.MoimInterestService;
import mogether.mogether.application.moim.MoimService;
import mogether.mogether.domain.oauth.AppUser;
import mogether.mogether.web.bungae.dto.BungaeListResponse;
import mogether.mogether.web.moim.dto.MoimListResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "user page", description = "유저 페이지 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserPageController {

    private final BungaeService bungaeService;
    private final MoimService moimService;
    private final BungaeInterestService bungaeInterestService;
    private final MoimInterestService moimInterestService;

    //관심 번개 목록
    @Operation(summary = "유저의 관심 번개 리스트 조회", description = "유저의 관심 번개 리스트를 조회한다",
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저의 관심 번개 리스트 조회 성공"),
            })
    @GetMapping("/{userId}/interest/bungae")
    public List<BungaeListResponse> getBungaeInterestList(@PathVariable("userId") Long userId,
                                                          @AuthenticationPrincipal AppUser appUser) {
        return bungaeInterestService.readAll(userId, appUser);
    }

    //관심 모임 목록
    @Operation(summary = "유저의 관심 모임 리스트 조회", description = "유저의 관심 모임 리스트를 조회한다",
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저의 관심 모임 리스트 조회 성공"),
            })
    @GetMapping("/{userId}/interest/moim")
    public List<MoimListResponse> getMoimInterestList(@PathVariable("userId") Long userId,
                                                      @AuthenticationPrincipal AppUser appUser) {
        return moimInterestService.readAll(userId, appUser);
    }

    @Operation(summary = "유저가 등록한 번개 리스트 조회", description = "유저가 등록한 번개 리스트를 조회한다",
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저가 등록한 번개 리스트 조회 성공"),
            })
    @GetMapping("/{userId}/host/bungae")
    public List<BungaeListResponse> getBungaeHostingList(@PathVariable("userId") Long userId,
                                                         @AuthenticationPrincipal AppUser appUser) {
        return bungaeService.getHostingList(userId, appUser);
    }

    @Operation(summary = "유저가 등록한 모임 리스트 조회", description = "유저가 등록한 모임 리스트를 조회한다",
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저가 등록한 모임 리스트 조회 성공"),
            })
    @GetMapping("/{userId}/host/moim")
    public List<MoimListResponse> getMoimHostingList(@PathVariable("userId") Long userId,
                                                     @AuthenticationPrincipal AppUser appUser) {
        return moimService.getHostingList(userId, appUser);
    }
}
