package mogether.mogether.web.moim;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import mogether.mogether.application.moim.MoimService;
import mogether.mogether.domain.oauth.AppUser;
import mogether.mogether.web.moim.dto.MoimListResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "search - moim", description = "모임 검색 API")
@RequiredArgsConstructor
@RestController
@RequestMapping("/moim/search")
public class MoimSearchController {

    private final MoimService moimService;

    @Operation(summary = "모임 검색", description = "제목, 위치(시, 구) 기반 모임 검색",
            responses = {
                    @ApiResponse(responseCode = "200", description = "모임 검색 성공"),
            })
    @GetMapping
    public List<MoimListResponse> search(@RequestParam(required = false) String name,
                                         @RequestParam(required = false) String city,
                                         @RequestParam(required = false) String gu,
                                         @AuthenticationPrincipal AppUser appUser) {
        return moimService.searchByAddress(name, city, gu, appUser); //todo: 비로그인 회원 접근 시
    }
}