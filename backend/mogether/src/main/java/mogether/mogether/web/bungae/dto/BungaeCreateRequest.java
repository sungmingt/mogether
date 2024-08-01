package mogether.mogether.web.bungae.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mogether.mogether.domain.Address;
import mogether.mogether.domain.Keyword;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class BungaeCreateRequest {

    @NotEmpty
    private Long userId; /////////////
    @NotEmpty
    private String title;
    @NotEmpty
    private String content;
    @NotEmpty
    private Keyword keyword; ////
    @NotEmpty
    private Address address;

    @NotEmpty
    private String gatherAt;
    @NotEmpty
    private LocalDate createdAt;
    @NotEmpty
    private LocalDate expireAt; ///

    private String addressDetails;
    private int minMember;
    private int maxMember;
    private int ageLimit;
    private int fee;
}
