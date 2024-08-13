package mogether.mogether.web.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mogether.mogether.domain.info.Address;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AfterOAuthSignUpRequest {

    private Address address;
    private int age;
    private String gender;
    private String intro;
    private String phoneNumber;
}