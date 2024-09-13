package mogether.mogether.web.bungae.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotNull
    private Long userId;
    @NotBlank
    private String title;
    @NotBlank
    private String content;
    @NotBlank
    private String keyword;
    private Address address;

    private String gatherAt;
    private LocalDate createdAt;
    private LocalDate expireAt;

    private String addressDetails;
    private int minMember;
    private int maxMember;
    private int ageLimit;
    private int fee;

    public Bungae toBungae(User user) {
        Bungae bungae = new Bungae(
                this.title,
                this.content,
                Keyword.of(this.keyword),
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
