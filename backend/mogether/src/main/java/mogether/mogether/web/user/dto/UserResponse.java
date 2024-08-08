package mogether.mogether.web.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mogether.mogether.domain.Address;
import mogether.mogether.domain.user.Gender;
import mogether.mogether.domain.user.SocialType;
import mogether.mogether.domain.user.User;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private long userId;
    private String imageUrl;
    private String email;
    private SocialType socialType;
    private String providerId;

    private String name;
    private String nickname;

    private Address address;
    private int age;
    private Gender gender;
    private String intro;
    private String phoneNumber;

    public static UserResponse of(User user) {
        return new UserResponse(
                user.getId(), user.getImageUrl(), user.getEmail(),
                user.getSocialType(), user.getProviderId(), user.getName(),
                user.getNickname(), user.getAddress(), user.getAge(),
                user.getGender(), user.getIntro(), user.getPhoneNumber());
    }
}