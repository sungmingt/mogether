package mogether.mogether.web.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mogether.mogether.domain.info.Address;
import mogether.mogether.domain.info.Gender;
import mogether.mogether.domain.info.SocialType;
import mogether.mogether.domain.user.User;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserJoinResponse {

    private long userId;
    private String imageUrl;
    private String email;
    private SocialType socialType;
    private String nickname;

    private Address address;
    private int age;
    private Gender gender;
    private String intro;
    private String phoneNumber;

    public static UserJoinResponse of(User user) {
        return new UserJoinResponse(
                user.getId(), user.getImageUrl(), user.getEmail(),
                user.getSocialType(), user.getNickname(),
                user.getAddress(), user.getAge(), user.getGender(),
                user.getIntro(), user.getPhoneNumber());
    }
}
