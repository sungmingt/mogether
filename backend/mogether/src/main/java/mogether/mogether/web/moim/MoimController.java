package mogether.mogether.web.moim;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import mogether.mogether.application.moim.MoimService;
import mogether.mogether.domain.oauth.AppUser;
import mogether.mogether.web.moim.dto.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;

@Tag(name = "moim", description = "모임 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/moim")
public class MoimController {

    private final MoimService moimService;

    @Operation(summary = "모임 참여", description = "모임 id와 유저 id를 통해 유저가 모임에 가입한다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저의 모임 가입 성공"),
            })
    @PostMapping("/{moimId}/join")
    public HttpStatus join(@PathVariable("moimId") Long moimId, @AuthenticationPrincipal AppUser appUser) {
        moimService.join(moimId, appUser);
        return HttpStatus.OK;
    }

    @Operation(summary = "모임 탈퇴", description = "모임 id와 유저 id를 통해 유저가 가입한 모임에서 탈퇴한다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저의 모임 탈퇴 성공"),
            })
    @DeleteMapping("/{moimId}/quit")
    public HttpStatus quit(@PathVariable("moimId") Long moimId, @AuthenticationPrincipal AppUser appUser) {
        moimService.quit(moimId, appUser);
        return HttpStatus.OK;
    }

    //모임 추방 기능
    @Operation(summary = "모임 강제 퇴장", description = "호스트가 유저를 강제 퇴장시킨다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "호스트의 유저 강제퇴장 성공"),
            })
    @PostMapping("/kickout")
    public HttpStatus kickOut(@AuthenticationPrincipal AppUser appUser,
                              @RequestBody @Validated MoimKickOutRequest kickOutRequest) {
        moimService.kickOut(appUser, kickOutRequest);
        return HttpStatus.OK;
    }

    @Operation(summary = "모임 글 등록", description = "유저 id를 통해 유저가 모임 글을 등록한다.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "유저의 모임 글 등록 성공"),
            })
    @ResponseStatus(CREATED)
    @PostMapping
    public MoimCreateResponse create(@AuthenticationPrincipal AppUser appUser,
                                     @RequestPart(name = "images", required = false) List<MultipartFile> images,
                                     @RequestPart(name = "dto") @Validated MoimCreateRequest moimCreateRequest) {
        return moimService.create(appUser, images, moimCreateRequest);
    }

    @Operation(summary = "모임 글 수정", description = "모임 id와 유저 id를 통해 모임 글을 수정한다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저의 모임 글 수정 성공"),
            })
    @PatchMapping("/{moimId}")
    public MoimUpdateResponse update(@PathVariable("moimId") Long moimId,
                                     @AuthenticationPrincipal AppUser appUser,
                                     @RequestPart(name = "images", required = false) List<MultipartFile>images,
                                     @RequestPart(name = "dto") @Validated MoimUpdateRequest moimUpdateRequest) {
        return moimService.update(moimId, appUser, images, moimUpdateRequest);
    }

    @Operation(summary = "모임 글 상세 조회", description = "모임 id를 통해 특정 모임 글 상세 페이지를 조회한다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "모임 글 상세 페이지 조회 성공"),
            })
    @GetMapping("/{moimId}")
    public MoimResponse read(@PathVariable("moimId") Long moimId, @AuthenticationPrincipal AppUser appUser) {
        return moimService.read(moimId, appUser);
    }

    @Operation(summary = "모임 글 리스트 조회", description = "모임 글 리스트를 조회한다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "모임 글 리스트 조회 성공"),
            })
    @GetMapping
    public List<MoimListResponse> readAll(@AuthenticationPrincipal AppUser appUser) {
        return moimService.readAll(appUser);
    }

    @Operation(summary = "모임 글 삭제", description = "모임 id와 유저 id를 통해 유저가 모임 글을 삭제한다.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "유저의 모임 글 삭제 성공"),
            })
    @DeleteMapping("/{moimId}")
    public HttpStatus delete(@PathVariable Long moimId, @AuthenticationPrincipal AppUser appUser) {
        moimService.delete(moimId, appUser);
        return NO_CONTENT;
    }
}
