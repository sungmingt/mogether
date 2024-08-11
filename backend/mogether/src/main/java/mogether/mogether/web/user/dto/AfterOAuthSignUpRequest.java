package mogether.mogether.web.user.dto;

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
public class AfterOAuthSignUpRequest {

    private Address address;
    private int age;
    private Gender gender;
    private String intro;
    private String phoneNumber;
}