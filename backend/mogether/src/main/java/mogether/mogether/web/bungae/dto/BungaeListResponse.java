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
@AllArgsConstructor
@NoArgsConstructor
public class BungaeListResponse {

    private Long id;
    private String thumbnailUrl;

    private Long hostId;
    private String hostName;
    private String hostProfileImageUrl;

    private List<String> participantsImageUrls;//
    private int participantsCount;//

    private boolean isJoined;
    private boolean isInterested; //todo

    private String title;
    private String content;
    private Keyword keyword; ////
    private Address address;
    private int interestsCount;

    private String gatherAt; //////////////////////
    private LocalDate createdAt;
    private LocalDate expireAt;

    public static List<BungaeListResponse> of(List<Bungae> bunageList, User requestUser) {

        return bunageList.stream()
                .map(bungae -> new BungaeListResponse(
                        bungae.getId(),
                        bungae.getImageUrls().get(0), //////

                        bungae.getHost().getId(),
                        bungae.getHost().getNickname(),
                        bungae.getHost().getImageUrl(),

                        bungae.getBungaeUserList()
                                .stream()
                                .map(bungaeUser -> bungaeUser.getUser().getImageUrl())
                                .limit(6) ////
                                .toList(),
                        bungae.getBungaeUserList().size(),

                        isJoined(requestUser, bungae.getBungaeUserList()),
                        isInterested(requestUser, bungae),

                        bungae.getTitle(),
                        bungae.getContent(),
                        bungae.getKeyword(),
                        bungae.getAddress(),
                        bungae.getBungaeInterestList().size(),
                        bungae.getGatherAt(),
                        bungae.getCreatedAt(),
                        bungae.getExpireAt()))
                .toList();
    }

    //todo: DB 조회로 해결? ex)bungae_user.findByUserId() 결국 DB에 추가 접근이니까 비효울적일듯
    //todo: 일단 LazyLoadingException을 피해 transaction 안에서 한번에 조회하는 방법
    //todo: 여러 곳에서 쓰이기 때문에 분리 관리 고려

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
