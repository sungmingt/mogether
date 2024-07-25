package mogether.mogether.web.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mogether.mogether.domain.Address;
import mogether.mogether.domain.Keyword;
import mogether.mogether.domain.bungae.Bungae;
import mogether.mogether.domain.moim.Moim;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GatheringListResponse {

    private Long id;
    private String thumbnailUrl;

    private Long hostId;
    private String hostName;
    private String hostProfileImageUrl;
    private List<String> participantsImageUrls;//
    private Long participantsCount;//

    private String title;
    private String content;
    private Keyword keyword; ////
    private Address address;
    private Long interestsCount;

    private String gatherAt; //////////////////////
    private LocalDate createdAt;
    private LocalDate expireAt;

    //번개, 모임 데이터를 가져와 합치는 작업 필요. (프론트에서 각각 요청하여 합칠수도 있음)
    public static List<GatheringListResponse> toGatheringListResponse(List<Bungae> bunageList,
                                                                  List<Moim> moimList) {
        List<GatheringListResponse> gatheringListResponse = new ArrayList<>();
        gatheringListResponse.addAll(bungaeToGatheringListResponse(bunageList));
        gatheringListResponse.addAll(moimToGatheringListResponse(moimList)); //todo: 데이터 중복 추가 해결
        return gatheringListResponse;
    }

    private static List<GatheringListResponse> bungaeToGatheringListResponse(List<Bungae> bunageList) {
        return bunageList.stream()
                .map(bungae -> new GatheringListResponse(
                        bungae.getId(),
                        "imageUrl",
                        31L,
                        "hostName",
                        "hostPRofileImageUrl",
                        new ArrayList<String>(),
                        12L,
                        bungae.getTitle(),
                        bungae.getContent(),
                        bungae.getKeyword(),
                        bungae.getAddress(),
                        3L,
                        bungae.getGatherAt(),
                        bungae.getCreatedAt(),
                        bungae.getExpireAt()))
                .collect(Collectors.toList());
    }

    private static List<GatheringListResponse> moimToGatheringListResponse(List<Moim> moimList) {
        return moimList.stream()
                .map(moim -> new GatheringListResponse(
                        moim.getId(),
                        "imageUrl",
                        31L,
                        "hostName",
                        "hostPRofileImageUrl",
                        new ArrayList<String>(),
                        12L,
                        moim.getTitle(),
                        moim.getContent(),
                        moim.getKeyword(),
                        moim.getAddress(),
                        3L,
                        "",
                        moim.getCreatedAt(),
                        moim.getExpireAt()))
                .collect(Collectors.toList());
    }
}
