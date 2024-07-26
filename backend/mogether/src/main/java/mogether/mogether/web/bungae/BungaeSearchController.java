package mogether.mogether.web.bungae;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import mogether.mogether.domain.bungae.Bungae;
import mogether.mogether.web.bungae.dto.BungaeListResponse;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Tag(name = "search - bungae", description = "번개 검색 API")
@RequiredArgsConstructor
@RestController
@RequestMapping("/bungae")
public class BungaeSearchController {

    @Operation(summary = "번개 검색", description = "제목, 위치(시, 구) 기반 번개 검색",
            responses = {
                    @ApiResponse(responseCode = "200", description = "번개 검색 성공"),
            })
    @GetMapping
    public List<BungaeListResponse> search(@RequestParam(required = false) String name,
                                           @RequestParam(required = false) String city,
                                           @RequestParam(required = false) String gu) {
        List<Bungae> bungaeList = new ArrayList<>();
        return BungaeListResponse.toBungaeListResponse(bungaeList);
    }
}
