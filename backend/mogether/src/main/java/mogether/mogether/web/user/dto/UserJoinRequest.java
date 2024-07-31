package mogether.mogether.web.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mogether.mogether.domain.Address;
import mogether.mogether.domain.user.Gender;
import org.springframework.web.multipart.MultipartFile;

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

    private MultipartFile image;

    private Address address;
    private int age;
    private Gender gender;
    private String intro;
    private String phoneNumber;
}
