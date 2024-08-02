package mogether.mogether.domain.bungae;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mogether.mogether.domain.user.User;

import static jakarta.persistence.FetchType.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class BungaeUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "bungae_id")
    private Bungae bungae;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    //todo: 유저의 가입 날짜 필드

    public BungaeUser(Bungae bungae, User user) {
        this.bungae = bungae;
        bungae.getBungaeUserList().add(this);
        this.user = user;
        user.getBungaeJoinList().add(this);
    }
}
