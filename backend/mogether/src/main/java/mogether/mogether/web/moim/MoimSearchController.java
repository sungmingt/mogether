package mogether.mogether.web.moim;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import mogether.mogether.domain.moim.Moim;
import mogether.mogether.web.moim.dto.MoimListResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@Tag(name = "search - moim", description = "모임 검색 API")
@RequiredArgsConstructor
@RestController
@RequestMapping("/moim")
public class MoimSearchController {

    @Operation(summary = "모임 검색", description = "제목, 위치(시, 구) 기반 모임 검색",
            responses = {
                    @ApiResponse(responseCode = "200", description = "모임 검색 성공"),
            })
    @GetMapping
    public List<MoimListResponse> search(@RequestParam(required = false) String name,
                                         @RequestParam(required = false) String city,
                                         @RequestParam(required = false) String gu) {
        List<Moim> moimList = new ArrayList<>();
        return MoimListResponse.toMoimListResponse(moimList);
    }
}