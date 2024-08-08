package mogether.mogether.domain.bungae;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mogether.mogether.domain.Address;
import mogether.mogether.domain.Keyword;
import mogether.mogether.domain.interest.BungaeInterest;
import mogether.mogether.domain.user.User;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static jakarta.persistence.GenerationType.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Bungae {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "bungae")
    private List<BungaeImage> bungaeImageList = new ArrayList<>();

    @OneToMany(mappedBy = "bungae") //todo: orphan, cascade 설정
    private List<BungaeUser> bungaeUserList = new ArrayList<>();

    @OneToMany(mappedBy = "bungae")
    private List<BungaeInterest> bungaeInterestList = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id")
    private User host;

    private String title;
    private String content;
    private List<String> imageUrls = new ArrayList<>();
    private Keyword keyword;
    private Address address;

    private String gatherAt;
    //interests
    private LocalDate createdAt;
    private LocalDate expireAt;

    //todo: embedded class로 작다
    private String placeDetails;
    private int minMember;
    private int maxMember;
    private int ageLimit;
    private int fee;

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public void setHost(User user) {
        this.host = user;
        user.getBungaeHostList().add(this);
    }

    public Bungae(User host, String title, String content, Keyword keyword, Address address, String gatherAt, LocalDate createdAt, LocalDate expireAt, String placeDetails, int minMember, int maxMember, int ageLimit, int fee) {
        this.host = host;
        this.title = title;
        this.content = content;
        this.keyword = keyword;
        this.address = address;
        this.gatherAt = gatherAt;
        this.createdAt = createdAt;
        this.expireAt = expireAt;
        this.placeDetails = placeDetails;
        this.minMember = minMember;
        this.maxMember = maxMember;
        this.ageLimit = ageLimit;
        this.fee = fee;
    }
}
