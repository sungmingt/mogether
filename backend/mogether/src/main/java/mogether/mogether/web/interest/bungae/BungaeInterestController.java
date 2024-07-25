package mogether.mogether.web.interest.bungae;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Tag(name = "interest - bungae", description = "번개 관심 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/interest/bungae")
public class BungaeInterestController {

    @Operation(summary = "번개 관심 등록", description = "번개 관심 등록 요청",
            responses = {
                    @ApiResponse(responseCode = "201", description = "번개 관심 등록 성공"),
            })
    @PostMapping
    public HttpStatus doInterest(@RequestBody BungaeInterestRequest doInterestRequest) {
        return HttpStatus.CREATED;
    }

    @Operation(summary = "번개 관심 취소", description = "번개 관심 취소 요청",
            responses = {
                    @ApiResponse(responseCode = "204", description = "번개 관심 취소 성공"),
            })
    @DeleteMapping //todo: 어차피 관심 취소할때 interest id를 모른다?
    public HttpStatus undoInterest(@RequestBody BungaeInterestRequest undoInterestRequest) {

        return HttpStatus.NO_CONTENT;
    }
}