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
@NoArgsConstructor
@AllArgsConstructor
public class MoimResponse {

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
    private int interestsCount;

    private String title;
    private String content;
    private Keyword keyword; ////
    private Address address;

    private LocalDate createdAt;
    private LocalDate expireAt;

    public static MoimResponse of(Moim findMoim, User requestUser) {
        User host = findMoim.getHost();
        List<MoimUser> moimUserList = findMoim.getMoimUserList();
        List<String> participantsImageUrls = moimUserList.stream()
                .map(moimUser -> moimUser.getUser().getImageUrl())
                .toList();

        return new MoimResponse(
                findMoim.getId(), findMoim.getImageUrls(), host.getId(),
                host.getNickname(), host.getImageUrl(), host.getIntro(),
                participantsImageUrls, moimUserList.size(),
                isJoined(requestUser, moimUserList), isInterested(requestUser, findMoim),
                findMoim.getMoimInterestList().size(),
                findMoim.getTitle(), findMoim.getContent(), findMoim.getKeyword(),
                findMoim.getAddress(), findMoim.getCreatedAt(), findMoim.getExpireAt());
    }


    //todo: DB 조회로 해결? ex) moim_user.findByUserId() 결국 DB에 추가 접근이니까 비효울적일듯
    //todo: 일단 LazyLoadingException을 피해 transaction 안에서 한번에 조회하는 방법

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

    public static MoimResponse ofAnonymous(Moim findMoim) {
        User host = findMoim.getHost();
        List<MoimUser> moimUserList = findMoim.getMoimUserList();
        List<String> participantsImageUrls = moimUserList.stream()
                .map(moimUser -> moimUser.getUser().getImageUrl())
                .toList();

        return new MoimResponse(
                findMoim.getId(), findMoim.getImageUrls(), host.getId(),
                host.getNickname(), host.getImageUrl(), host.getIntro(),
                participantsImageUrls, moimUserList.size(),
                false, false,
                findMoim.getMoimInterestList().size(),
                findMoim.getTitle(), findMoim.getContent(), findMoim.getKeyword(),
                findMoim.getAddress(), findMoim.getCreatedAt(), findMoim.getExpireAt());
    }
}