package mogether.mogether.domain.user;

import lombok.Builder;
import lombok.Getter;
import mogether.mogether.domain.Address;

@Getter
@Builder
public class User {

    private Long id;

    private String email;

    private String password;

    private SocialType socialType;

    private String providerId;
//    private String provider; //////

    private String name;

    private String nickname;

    private Address address;

    private int age;

    private Gender gender;

    private String intro;

    private String phoneNumber;
}
