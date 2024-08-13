package mogether.mogether.web.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mogether.mogether.domain.info.Address;
import mogether.mogether.domain.info.Gender;
import mogether.mogether.domain.info.SocialType;
import mogether.mogether.domain.user.User;

import static mogether.mogether.application.user.UserValidator.encodePassword;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserJoinRequest {

    @NotEmpty
    @Email
    private String email;
    @NotEmpty
    private String password; ///대소문자, 특수문자 포함 8자리 이상
    @NotEmpty
    private String name;
    @NotEmpty
    private String nickname;
    private Address address;
    private int age;
    private String gender;
    private String intro;
    private String phoneNumber;

    public User toUser() {
        return new User(
                this.email,
                encodePassword(this.password),
                SocialType.NONE,
                this.nickname,
                this.address,
                this.age,
                Gender.of(this.gender),
                this.intro,
                this.phoneNumber
        );
    }
}
