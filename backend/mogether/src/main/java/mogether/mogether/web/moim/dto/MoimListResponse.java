package mogether.mogether.web.moim.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mogether.mogether.domain.Address;
import mogether.mogether.domain.Keyword;
import mogether.mogether.domain.moim.Moim;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MoimListResponse {

    private Long id;
    private String thumbnailUrl;

    private Long hostId;
    private String hostName;
    private String hostProfileImageUrl;
    private List<String> participantsImageUrls;//
    private Long participantsCount;//

    private boolean isJoined;
    private boolean isInterested; //todo

    private String title;
    private String content;
    private Keyword keyword; ////
    private Address address;
    private Long interestsCount;

    private LocalDate createdAt;
    private LocalDate expireAt;

    public static List<MoimListResponse> toMoimListResponse(List<Moim> moimList) {
        return moimList.stream()
                .map(moim -> new MoimListResponse(
                        moim.getId(),
                        "imageUrl",
                        31L,
                        "hostName",
                        "hostPRofileImageUrl",
                        new ArrayList<String>(),
                        12L,
                        false,
                        false,
                        moim.getTitle(),
                        moim.getContent(),
                        moim.getKeyword(),
                        moim.getAddress(),
                        3L,
                        moim.getCreatedAt(),
                        moim.getExpireAt()))
                .collect(Collectors.toList());
    }
}
