package mogether.mogether.domain.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import mogether.mogether.domain.Address;
import mogether.mogether.domain.bungae.Bungae;
import mogether.mogether.domain.bungae.BungaeUser;
import mogether.mogether.domain.interest.BungaeInterest;
import mogether.mogether.domain.interest.MoimInterest;
import mogether.mogether.domain.moim.Moim;

import java.util.ArrayList;
import java.util.List;

import static jakarta.persistence.CascadeType.ALL;
import static jakarta.persistence.FetchType.LAZY;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "Users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = LAZY, cascade = ALL, orphanRemoval = true)
    @JoinColumn(name = "image_id")
    private ProfileImage profileImage;

    @OneToMany(mappedBy = "host", cascade = ALL)
    private List<Bungae> bungaeHostList = new ArrayList<>();

    @OneToMany(mappedBy = "host", cascade = ALL)
    private List<Moim> moimHostList = new ArrayList<>();

    @OneToMany(mappedBy = "user") //todo: orphan, cascade 설정
    private List<BungaeUser> bungaeJoinList = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<BungaeInterest> bungaeInterestList = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<MoimInterest> moimInterestList = new ArrayList<>();

    private String imageUrl;

    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private SocialType socialType;
    private String providerId;
//    private String provider; //////
    private String name;
    private String nickname;

    @Embedded
    private Address address;
    private int age;
    @Enumerated(EnumType.STRING)
    private Gender gender;
    private String intro;
    private String phoneNumber;

    public void setProfileImage(ProfileImage ProfileImage) {
        this.profileImage = ProfileImage;
    }

    public void setImageUrl(String fileUrl) {
        this.imageUrl = fileUrl;
    }

    public void update(String name, String nickname, Address address, int age, Gender gender, String intro, String phoneNumber) {
        this.name = name;
        this.nickname = nickname;
        this.address = address;
        this.age = age;
        this.gender = gender;
        this.intro = intro;
        this.phoneNumber = phoneNumber;
    }

    public void updatePassword(String newPassword) {
        this.password = newPassword;
    }

    public User(String email, String password, String name, String nickname, Address address, int age, Gender gender, String intro, String phoneNumber) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.nickname = nickname;
        this.age = age;
        this.intro = intro;
        this.gender = gender;
        this.address = address;
        this.phoneNumber = phoneNumber;
    }
}
