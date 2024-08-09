package mogether.mogether.web.bungae.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mogether.mogether.domain.info.Address;
import mogether.mogether.domain.info.Keyword;
import mogether.mogether.domain.bungae.Bungae;
import mogether.mogether.domain.bungae.BungaeUser;
import mogether.mogether.domain.user.User;

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
    private int participantsCount;//

    private boolean isJoined;
    private boolean isInterested;

    private String title;
    private String content;
    private Keyword keyword;
    private Address address;

    private int interestsCount;
    private String gatherAt;
    private LocalDate createdAt;
    private LocalDate expireAt;

    private String placeDetails;
    private int minMember;
    private int maxMember;
    private int ageLimit;
    private int fee;

    public static BungaeResponse of(Bungae findBungae, User requestUser) {
        User host = findBungae.getHost();
        List<BungaeUser> bungaeUserList = findBungae.getBungaeUserList();
        List<String> participantsImageUrls = bungaeUserList.stream()
                .map(bungaeUser -> bungaeUser.getUser().getImageUrl())
                .toList();

        return new BungaeResponse(
                findBungae.getId(), findBungae.getImageUrls(), host.getId(),
                host.getNickname(), host.getImageUrl(), host.getIntro(),
                participantsImageUrls, bungaeUserList.size(),
                isJoined(requestUser, bungaeUserList), isInterested(requestUser, findBungae),
                findBungae.getTitle(), findBungae.getContent(), findBungae.getKeyword(),
                findBungae.getAddress(), findBungae.getBungaeInterestList().size(),
                findBungae.getGatherAt(), findBungae.getCreatedAt(), findBungae.getExpireAt(),
                findBungae.getPlaceDetails(), findBungae.getMinMember(), findBungae.getMaxMember(),
                findBungae.getAgeLimit(), findBungae.getFee());
    }


    //todo: DB 조회로 해결? ex)bungae_user.findByUserId() 결국 DB에 추가 접근이니까 비효울적일듯
    //todo: 일단 LazyLoadingException을 피해 transaction 안에서 한번에 조회하는 방법

    //요청 유저의 참여여부
    private static boolean isJoined(User requestUser, List<BungaeUser> bungaeUserList) {
        return bungaeUserList.stream()
                .anyMatch(bungaeUser -> bungaeUser.getUser().getId().equals(requestUser.getId()));
    }

    //요청 유저의 관심여부
    private static boolean isInterested(User user, Bungae bungae) {
        return user.getBungaeInterestList()
                .stream()
                .anyMatch(bungaeInterest -> bungaeInterest.getBungae().getId().equals(bungae.getId()));
    }

}
