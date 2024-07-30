package mogether.mogether.web.bungae;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import mogether.mogether.application.bungae.BungaeService;
import mogether.mogether.domain.bungae.Bungae;
import mogether.mogether.web.bungae.dto.*;
import mogether.mogether.web.moim.dto.MoimQuitRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
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
    @PostMapping("/join")
    public HttpStatus join(@RequestBody BungaeJoinRequest bungaeJoinRequest) {
        return HttpStatus.OK; /////
    }

    @Operation(summary = "번개 참여 취소", description = "모임 id와 유저 id를 통해 유저가 번개 참여를 취소한다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저의 번개 참여 취소 성공"),
            })
    @DeleteMapping("/quit")
    public HttpStatus quit(@RequestBody BungaeQuitRequest moimQuitRequest) {
        return HttpStatus.OK; /////
    }

    @Operation(summary = "번개 글 등록", description = "유저 id를 통해 유저가 번개 글을 등록한다.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "유저의 번개 글 등록 성공"),
            })
    @ResponseStatus(CREATED)
    @PostMapping("/")
    public BungaeCreateResponse create(@RequestBody BungaeCreateRequest bungaeCreateRequest) {
        return new BungaeCreateResponse();
    }

    @Operation(summary = "번개 글 수정", description = "모임 id와 유저 id를 통해 유저가 작성한 번개 글을 수정한다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저의 작성한 번개 글 수정 성공"),
            })
    @PatchMapping("/{bungaeId}")
    public BungaeUpdateResponse update(@PathVariable Long bungaeId,
                                       @RequestBody BungaeUpdateRequest bungaeUpdateRequest) {

        return new BungaeUpdateResponse();
    }

    @Operation(summary = "번개 글 상세 조회", description = "번개 id를 통해 특정 번개 글 상세 페이지를 조회한다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "번개 글 상세 페이지 조회 성공"),
            })
    @GetMapping("/{bungaeId}")
    public BungaeResponse read(@PathVariable Long bungaeId) {
        return new BungaeResponse();
    }

    @Operation(summary = "번개 글 리스트 조회", description = "번개 글 리스트를 조회한다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "번개 글 리스트 조회 성공"),
            })
    @GetMapping("/")
    public List<BungaeListResponse> readAll() { //페이징 방식, dto 형식
        List<Bungae> bungaeList = new ArrayList<>();
        return BungaeListResponse.toBungaeListResponse(bungaeList); ///
    }

    @Operation(summary = "번개 글 삭제", description = "번개 id와 유저 id를 통해 번개 글을 삭제한다.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "번개 글 삭제 성공"),
            })
    @DeleteMapping("/{bungaeId}")
    public HttpStatus delete(@PathVariable Long bungaeId,
                             @RequestBody BungaeDeleteRequest deleteRequest) {
        return NO_CONTENT;
    }
}
