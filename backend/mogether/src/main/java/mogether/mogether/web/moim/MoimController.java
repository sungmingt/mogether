package mogether.mogether.web.moim;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import mogether.mogether.domain.moim.Moim;
import mogether.mogether.web.moim.dto.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;

@Tag(name = "moim", description = "모임 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/moim")
public class MoimController {

    @Operation(summary = "모임 참여", description = "모임 id와 유저 id를 통해 유저가 모임에 가입한다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저의 모임 가입 성공"),
            })
    @PostMapping("/join")
    public HttpStatus join(@RequestBody MoimJoinRequest moimJoinRequest) {
        return HttpStatus.OK; /////
    }

    @Operation(summary = "모임 탈퇴", description = "모임 id와 유저 id를 통해 유저가 가입한 모임에서 탈퇴한다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저의 모임 탈퇴 성공"),
            })
    @DeleteMapping("/quit")
    public HttpStatus quit(@RequestBody MoimQuitRequest moimQuitRequest) {
        return HttpStatus.OK; /////
    }

    @Operation(summary = "모임 글 등록", description = "유저 id를 통해 유저가 모임 글을 등록한다.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "유저의 모임 글 등록 성공"),
            })
    @ResponseStatus(CREATED)
    @PostMapping("/")
    public MoimCreateResponse create(@RequestPart(name = "images") List<MultipartFile> images,
                                     @RequestPart(name = "dto") MoimCreateRequest moimCreateRequest) {
        return new MoimCreateResponse();
    }

    @Operation(summary = "모임 글 수정", description = "모임 id와 유저 id를 통해 모임 글을 수정한다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저의 모임 글 수정 성공"),
            })
    @PatchMapping("/{moimId}")
    public MoimUpdateResponse update(@PathVariable Long moimId,
                                     @RequestPart(name = "images") List<MultipartFile> images,
                                     @RequestPart(name = "dto") MoimUpdateRequest moimUpdateRequest) {

        return new MoimUpdateResponse();
    }

    @Operation(summary = "모임 글 상세 조회", description = "모임 id를 통해 특정 모임 글 상세 페이지를 조회한다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "모임 글 상세 페이지 조회 성공"),
            })
    @GetMapping("/{moimId}")
    public MoimResponse read(@PathVariable Long moimId) {
        return new MoimResponse();
    }

    @Operation(summary = "모임 글 리스트 조회", description = "모임 글 리스트를 조회한다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "모임 글 리스트 조회 성공"),
            })
    @GetMapping("/")
    public List<MoimListResponse> readAll() { //페이징 방식, dto 형식
        List<Moim> moimList = new ArrayList<>();
        return MoimListResponse.toMoimListResponse(moimList); ///
    }

    @Operation(summary = "모임 글 삭제", description = "모임 id와 유저 id를 통해 유저가 모임 글을 삭제한다.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "유저의 모임 글 삭제 성공"),
            })
    @DeleteMapping("/{moimId}")
    public HttpStatus delete(@PathVariable Long moimId,
                             @RequestBody MoimDeleteRequest moimDeleteRequest) {
        return NO_CONTENT;
    }
}
