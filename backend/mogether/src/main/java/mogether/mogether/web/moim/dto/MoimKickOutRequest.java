package mogether.mogether.web.moim.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MoimKickOutRequest {

    private Long moimId;
    private Long userId;
}
