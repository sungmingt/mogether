package mogether.mogether.web.bungae.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mogether.mogether.domain.Address;
import mogether.mogether.domain.Keyword;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BungaeResponse {

    private Long id;
    private List<String> imageUrls;

    private Long hostId;
    private String hostName;
    private String hostProfileImageUrl;
    private String hostIntro;
    private List<String> participantsImageUrls;//
    private Long participantsCount;//

    //todo: get 요청에 userId를 알려면, token 정보에 넣거나 hearder로 받아야 한다,,,,,
    private boolean isJoined;
    private boolean isInterested;

    private String title;
    private String content;
    private Keyword keyword; ////
    private Address address;
    private Long interestsCount;

    private String gatherAt;
    private LocalDate createdAt;
    private LocalDate expireAt;

    private String placeDetails;
    private int minMember;
    private int maxMember;
    private int ageLimit;
    private int fee;

//    public static BungaeResponse of(Bungae findBungae) {
//        User host = findBungae.getHost();
//        List<BungaeUser> bungaeUserList = findBungae.getBungaeUserList();
//        List<String> participantsImageUrls = bungaeUserList.stream()
//                .map(bungaeUser -> bungaeUser.getUser().getImageUrl())
//                .toList();
//
//        return new BungaeResponse(
//                findBungae.getId(), findBungae.getImageUrls(), host.getId(),
//                host.getName(), host.getImageUrl(), host.getIntro(),
//                participantsImageUrls,
//                participantsImageUrls.size(),
//
//        )
//    }
}
