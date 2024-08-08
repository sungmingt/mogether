package mogether.mogether.web.interest.moim;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Tag(name = "interest - moim", description = "모임 관심 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/interest/moim")
public class MoimInterestController {

    @Operation(summary = "모임 관심 등록", description = "모임 관심 등록 요청",
            responses = {
                    @ApiResponse(responseCode = "201", description = "모임 관심 등록 성공"),
            })
    @PostMapping("/{moimId}")
    public HttpStatus doInterest(@PathVariable Long moimId) {
        return HttpStatus.CREATED;
    }

    @Operation(summary = "모임 관심 취소", description = "모임 관심 취소 요청",
            responses = {
                    @ApiResponse(responseCode = "204", description = "모임 관심 취소 성공"),
            })
    @DeleteMapping("/{moimId}")
    public HttpStatus undoInterest(@PathVariable Long moimId) {
        return HttpStatus.NO_CONTENT;
        //todo: 관심 취소할때 interest id를 모른다? -> 글을 조회할때 관심 등록했는지 프론트에서 어떻게 알지?
    }
}