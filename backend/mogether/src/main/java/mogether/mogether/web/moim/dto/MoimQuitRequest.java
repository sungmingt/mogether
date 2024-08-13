package mogether.mogether.web.moim.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MoimQuitRequest {

    private Long moimId;
    private Long userId;
}
