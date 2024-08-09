package mogether.mogether.web.user.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mogether.mogether.domain.info.Address;
import mogether.mogether.domain.info.Gender;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {

    @NotEmpty
    private String name;
    @NotEmpty
    private String nickname;
    private Address address;
    private int age;
    private Gender gender;
    private String intro;
    private String phoneNumber;
}
