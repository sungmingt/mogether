package mogether.mogether.web.interest.bungae;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import mogether.mogether.application.interest.BungaeInterestService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Tag(name = "interest - bungae", description = "번개 관심 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/interest/bungae")
public class BungaeInterestController {

//    private final BungaeInterestService bungaeInterestService;

    @Operation(summary = "번개 관심 등록", description = "번개 관심 등록 요청",
            responses = {
                    @ApiResponse(responseCode = "201", description = "번개 관심 등록 성공"),
            })
    @PostMapping("/{bungaeId}")
    public HttpStatus doInterest(@PathVariable Long bungaeId) {
//        bungaeInterestService.doInterest(bungaeId, principalDetail);
        return HttpStatus.CREATED;
    }

    @Operation(summary = "번개 관심 취소", description = "번개 관심 취소 요청",
            responses = {
                    @ApiResponse(responseCode = "204", description = "번개 관심 취소 성공"),
            })
    @DeleteMapping("/{bungaeId}")
    public HttpStatus undoInterest(@PathVariable Long bungaeId) {
//        bungaeInterestService.undoInterest(bungaeId, principalDetail);
        return HttpStatus.NO_CONTENT;
    }
}