package mogether.mogether.web.bungae;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import mogether.mogether.application.bungae.BungaeService;
import mogether.mogether.domain.oauth.AppUser;
import mogether.mogether.web.bungae.dto.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;

@Tag(name = "bungae", description = "번개 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/bungae")
public class BungaeController {

    private final BungaeService bungaeService;

    @Operation(summary = "번개 참여", description = "번개 id와 유저 id를 통해 유저가 번개에 참여한다.",
            responses = {
            @ApiResponse(responseCode = "200", description = "유저의 번개 참여 성공"),
    })
    @PostMapping("/{bungaeId}/join")
    public HttpStatus join(@PathVariable("bungaeId") Long bungaeId,
                           @AuthenticationPrincipal AppUser appUser) {
        bungaeService.join(bungaeId, appUser);
        return HttpStatus.OK;
    }

    @Operation(summary = "번개 참여 취소", description = "모임 id와 유저 id를 통해 유저가 번개 참여를 취소한다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저의 번개 참여 취소 성공"),
            })
    @DeleteMapping("/{bungaeId}/quit")
    public HttpStatus quit(@PathVariable("bungaeId") Long bungaeId,
                           @AuthenticationPrincipal AppUser appUser) {
        bungaeService.quit(bungaeId, appUser);
        return HttpStatus.OK;
    }

    @Operation(summary = "번개 강제 퇴장", description = "호스트가 유저를 강제퇴장시킨다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "호스트의 유저 강제퇴장 성공"),
            })
    @PostMapping("/kickout")
    public HttpStatus kickOut(@AuthenticationPrincipal AppUser appUser,
                              @RequestBody BungaeKickOutRequest kickOutRequest) {
        bungaeService.kickOut(appUser, kickOutRequest);
        return HttpStatus.OK;
    }

    @Operation(summary = "번개 글 등록", description = "유저 id를 통해 유저가 번개 글을 등록한다.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "유저의 번개 글 등록 성공"),
            })
    @ResponseStatus(CREATED)
    @PostMapping
    public BungaeCreateResponse create(@AuthenticationPrincipal AppUser appUser,
                                       @RequestPart(name = "images", required = false) List<MultipartFile> images,
                                       @RequestPart(name = "dto") BungaeCreateRequest bungaeCreateRequest) {
        return bungaeService.create(appUser, images, bungaeCreateRequest);
    }

    @Operation(summary = "번개 글 수정", description = "모임 id와 유저 id를 통해 유저가 작성한 번개 글을 수정한다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저의 작성한 번개 글 수정 성공"),
            })
    @PatchMapping("/{bungaeId}")
    public BungaeUpdateResponse update(@PathVariable("bungaeId") Long bungaeId,
                                       @AuthenticationPrincipal AppUser appUser,
                                       @RequestPart(name = "images", required = false) List<MultipartFile> images,
                                       @RequestPart(name = "dto") BungaeUpdateRequest bungaeUpdateRequest) {
        return bungaeService.update(bungaeId, appUser, bungaeUpdateRequest, images);
    }

    @Operation(summary = "번개 글 상세 조회", description = "번개 id를 통해 특정 번개 글 상세 페이지를 조회한다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "번개 글 상세 페이지 조회 성공"),
            })
    @GetMapping("/{bungaeId}")
    public BungaeResponse read(@PathVariable("bungaeId") Long bungaeId,
                               @AuthenticationPrincipal AppUser appUser) {
        return bungaeService.read(bungaeId, appUser);
    }

    @Operation(summary = "번개 글 리스트 조회", description = "번개 글 리스트를 조회한다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "번개 글 리스트 조회 성공"),
            })
    @GetMapping
    public List<BungaeListResponse> readAll(@AuthenticationPrincipal AppUser appUser) { //전체 데이터 return
        return bungaeService.readAll(appUser);
    }

    @Operation(summary = "번개 글 삭제", description = "번개 id와 유저 id를 통해 번개 글을 삭제한다.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "번개 글 삭제 성공"),
            })
    @DeleteMapping("/{bungaeId}")
    public HttpStatus delete(@PathVariable("bungaeId") Long bungaeId,
                             @AuthenticationPrincipal AppUser appUser) {
        bungaeService.delete(bungaeId, appUser);
        return NO_CONTENT;
    }
}
