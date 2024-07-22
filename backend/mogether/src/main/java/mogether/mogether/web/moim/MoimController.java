package mogether.mogether.web.moim;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mogether.mogether.application.bungae.BungaeService;
import mogether.mogether.domain.bungae.Bungae;
import mogether.mogether.domain.moim.Moim;
import mogether.mogether.web.bungae.dto.*;
import mogether.mogether.web.moim.dto.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/moim")
public class MoimController {

    @Operation(description = "모임 참여")
    @PostMapping("/{moimId}/join")
    public HttpStatus join(@PathVariable Long moimId,
                           @RequestBody MoimJoinRequest moimJoinRequest) {
        return HttpStatus.OK; /////
    }

    @Operation(description = "모임 글 등록")
    @ResponseStatus(CREATED)
    @PostMapping("/")
    public MoimCreateResponse create(@RequestBody MoimCreateRequest moimCreateRequest) {
        return new MoimCreateResponse();
    }

    @Operation(description = "모임 글 수정")
    @PatchMapping("/{moimId}")
    public MoimUpdateResponse update(@PathVariable Long moimId,
                                     @RequestBody MoimUpdateRequest moimUpdateRequest) {

        return new MoimUpdateResponse();
    }

    @Operation(description = "모임 글 상세 조회")
    @GetMapping("/{moimId}")
    public MoimResponse read(@PathVariable Long moimId) {
        return new MoimResponse();
    }

    @Operation(description = "모임 글 리스트 조회")
    @GetMapping("/")
    public List<MoimListResponse> readAll() { //페이징 방식, dto 형식
        List<Moim> moimList = new ArrayList<>();
        return MoimListResponse.toMoimListResponse(moimList); ///
    }

    @Operation(description = "모임 글 삭제")
    @DeleteMapping("/{moimId}")
    public HttpStatus delete(@PathVariable Long moimId,
                             @RequestBody MoimDeleteRequest moimDeleteRequest) {
        return NO_CONTENT;
    }
}
