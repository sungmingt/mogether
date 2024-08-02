package mogether.mogether.domain.interest;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mogether.mogether.domain.bungae.Bungae;
import mogether.mogether.domain.user.User;

import static jakarta.persistence.FetchType.LAZY;

@Getter
@NoArgsConstructor
@Entity
public class BungaeInterest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "bungae_id")
    private Bungae bungae;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public BungaeInterest(Bungae bungae, User user) {
        this.bungae = bungae;
        bungae.getBungaeInterestList().add(this);
        this.user = user;
        user.getBungaeInterestList().add(this);
    }
}
