package mogether.mogether.web.bungae.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mogether.mogether.domain.info.Address;
import mogether.mogether.domain.info.Keyword;
import mogether.mogether.domain.bungae.Bungae;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BungaeCreateResponse {

    private Long id;
    private Long hostId;
    private List<String> imageUrls;

    private String title;
    private String content;
    private Keyword keyword;
    private Address address;

    private String gatherAt;
    private LocalDate createdAt;
    private LocalDate expireAt;

    private String placeDetails;
    private int minMember;
    private int maxMember;
    private int ageLimit;
    private int fee;

    public static BungaeCreateResponse of(Bungae bungae) {
        return new BungaeCreateResponse(
                bungae.getId(), bungae.getHost().getId(), bungae.getImageUrls(),
                bungae.getTitle(), bungae.getContent(), bungae.getKeyword(),
                bungae.getAddress(), bungae.getGatherAt(), bungae.getCreatedAt(),
                bungae.getExpireAt(), bungae.getPlaceDetails(), bungae.getMinMember(),
                bungae.getMaxMember(), bungae.getAgeLimit(), bungae.getFee()
        );
    }
}
