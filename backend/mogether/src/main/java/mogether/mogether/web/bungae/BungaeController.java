package mogether.mogether.web.bungae;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mogether.mogether.application.bungae.BungaeService;
import mogether.mogether.domain.bungae.Bungae;
import mogether.mogether.web.bungae.dto.*;
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
@RequestMapping("/bungae")
public class BungaeController {

    private final BungaeService bungaeService;

    @Operation(description = "번개 참여")
    @PostMapping("/{bungaeId}/join")
    public HttpStatus join(@PathVariable Long bungaeId,
                           @RequestBody BungaeJoinRequest bungaeJoinRequest) {
        return HttpStatus.OK; /////
    }

    @Operation(description = "번개 글 등록")
    @ResponseStatus(CREATED)
    @PostMapping("/")
    public BungaeCreateResponse create(@RequestBody BungaeCreateRequest bungaeCreateRequest) {
        return new BungaeCreateResponse();
    }

    @Operation(description = "번개 글 수정")
    @PatchMapping("/{bungaeId}")
    public BungaeUpdateResponse update(@PathVariable Long bungaeId,
                                       @RequestBody BungaeUpdateRequest bungaeUpdateRequest) {

        return new BungaeUpdateResponse();
    }

    @Operation(description = "번개 글 상세 조회")
    @GetMapping("/{bungaeId}")
    public BungaeResponse read(@PathVariable Long bungaeId) {
        return new BungaeResponse();
    }

    @Operation(description = "번개 글 리스트 조회")
    @GetMapping("/")
    public List<BungaeListResponse> readAll() { //페이징 방식, dto 형식
        List<Bungae> bungaeList = new ArrayList<>();
        return BungaeListResponse.toBungaeListResponse(bungaeList); ///
    }

    @Operation(description = "번개 글 삭제")
    @DeleteMapping("/{bungaeId}")
    public HttpStatus delete(@PathVariable Long bungaeId,
                             @RequestBody BungaeDeleteRequest deleteRequest) {
        return NO_CONTENT;
    }
}
