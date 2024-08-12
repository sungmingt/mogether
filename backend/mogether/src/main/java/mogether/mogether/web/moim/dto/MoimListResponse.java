package mogether.mogether.web.moim.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mogether.mogether.domain.info.Address;
import mogether.mogether.domain.info.Keyword;
import mogether.mogether.domain.moim.Moim;
import mogether.mogether.domain.moim.MoimUser;
import mogether.mogether.domain.user.User;

import java.time.LocalDate;
import java.util.List;

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
    private int participantsCount;//

    private boolean isJoined;
    private boolean isInterested;
    private int interestsCount;

    private String title;
    private String content;
    private Keyword keyword; ////
    private String description;
    private Address address;

    private LocalDate createdAt;
    private LocalDate expireAt;

    public static List<MoimListResponse> of(List<Moim> moimList, User requestUser) {
        return moimList.stream()
                .map(moim -> new MoimListResponse(
                        moim.getId(),
                        moim.getImageUrls().get(0), //////

                        moim.getHost().getId(),
                        moim.getHost().getNickname(),
                        moim.getHost().getImageUrl(),

                        moim.getMoimUserList()
                                .stream()
                                .map(moimUser -> moimUser.getUser().getImageUrl())
                                .limit(6)  /////
                                .toList(),
                        moim.getMoimUserList().size(),

                        isJoined(requestUser, moim.getMoimUserList()),
                        isInterested(requestUser, moim),
                        moim.getMoimInterestList().size(),

                        moim.getTitle(),
                        moim.getContent(),
                        moim.getKeyword(),
                        moim.getDescrpition(),
                        moim.getAddress(),
                        moim.getCreatedAt(),
                        moim.getExpireAt()))
                .toList();
    }

    //todo: DB 조회로 해결? ex)moim_user.findByUserId() 결국 DB에 추가 접근이니까 비효울적일듯
    //todo: 일단 LazyLoadingException을 피해 transaction 안에서 한번에 조회하는 방법
    //todo: 여러 곳에서 쓰이기 때문에 분리 관리 고려

    //요청 유저의 참여여부
    private static boolean isJoined(User requestUser, List<MoimUser> moimUserList) {
        return moimUserList.stream()
                .anyMatch(moimUser -> moimUser.getUser().getId().equals(requestUser.getId()));
    }

    //요청 유저의 관심여부
    private static boolean isInterested(User user, Moim moim) {
        return user.getMoimInterestList()
                .stream()
                .anyMatch(moimInterest -> moimInterest.getMoim().getId().equals(moim.getId()));
    }

    public static List<MoimListResponse> ofAnonymous(List<Moim> moimList) {
        return moimList.stream()
                .map(moim -> new MoimListResponse(
                        moim.getId(),
                        moim.getImageUrls().get(0), //////

                        moim.getHost().getId(),
                        moim.getHost().getNickname(),
                        moim.getHost().getImageUrl(),

                        moim.getMoimUserList()
                                .stream()
                                .map(moimUser -> moimUser.getUser().getImageUrl())
                                .limit(6)  /////
                                .toList(),
                        moim.getMoimUserList().size(),

                        false, false,
                        moim.getMoimInterestList().size(),

                        moim.getTitle(),
                        moim.getContent(),
                        moim.getKeyword(),
                        moim.getDescrpition(),
                        moim.getAddress(),
                        moim.getCreatedAt(),
                        moim.getExpireAt()))
                .toList();

    }
}
