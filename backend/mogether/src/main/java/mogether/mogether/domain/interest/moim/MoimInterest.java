package mogether.mogether.domain.interest.moim;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mogether.mogether.domain.moim.Moim;
import mogether.mogether.domain.user.User;

import static jakarta.persistence.FetchType.LAZY;

@Getter
@NoArgsConstructor
@Entity
public class MoimInterest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "moim_id")
    private Moim moim;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public MoimInterest(Moim moim, User user) {
        this.moim = moim;
        moim.getMoimInterestList().add(this);
        this.user = user;
        user.getMoimInterestList().add(this);
    }
}