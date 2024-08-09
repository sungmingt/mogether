package mogether.mogether.web.bungae.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mogether.mogether.domain.info.Address;
import mogether.mogether.domain.info.Keyword;
import mogether.mogether.domain.bungae.Bungae;
import mogether.mogether.domain.user.User;

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

    public Bungae toBungae(User user) {
        Bungae bungae = new Bungae(
                this.title,
                this.content,
                this.keyword,
                this.address,
                this.gatherAt,
                this.createdAt,
                this.expireAt,
                this.addressDetails,
                this.minMember,
                this.maxMember,
                this.ageLimit,
                this.fee
        );

        bungae.setHost(user);
        return bungae;
    }
}
