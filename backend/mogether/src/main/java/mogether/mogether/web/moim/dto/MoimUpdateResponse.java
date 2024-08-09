package mogether.mogether.web.moim.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mogether.mogether.domain.info.Address;
import mogether.mogether.domain.info.Keyword;
import mogether.mogether.domain.moim.Moim;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MoimUpdateResponse {

    private Long id;
    private Long hostId;
    private List<String> imageUrls;

    private String title;
    private String content;
    private Keyword keyword; ////
    private String description; //
    private Address address;

    private LocalDate createdAt;
    private LocalDate expireAt;

    public static MoimUpdateResponse of(Moim moim) {
        return new MoimUpdateResponse(
                moim.getId(), moim.getHost().getId(), moim.getImageUrls(),
                moim.getTitle(), moim.getContent(), moim.getKeyword(), moim.getDescrpition(),
                moim.getAddress(), moim.getCreatedAt(), moim.getExpireAt()
        );
    }
}