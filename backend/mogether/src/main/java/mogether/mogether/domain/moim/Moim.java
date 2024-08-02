package mogether.mogether.domain.moim;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mogether.mogether.domain.Address;
import mogether.mogether.domain.Keyword;
import mogether.mogether.domain.interest.MoimInterest;
import mogether.mogether.domain.user.User;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Moim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "moim")
    private List<MoimInterest> moimInterestList = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id")
    private User host;

    private String title;
    private String content;
    private List<String> imageUrls = new ArrayList<>();
    private Keyword keyword;
    private Address address;
    private String descrpition;
    //interests
    private LocalDate createdAt;
    private LocalDate expireAt;
}
