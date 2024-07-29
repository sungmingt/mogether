package mogether.mogether.web.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mogether.mogether.domain.Address;
import mogether.mogether.domain.user.Gender;
import mogether.mogether.domain.user.SocialType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserJoinResponse {

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
}
