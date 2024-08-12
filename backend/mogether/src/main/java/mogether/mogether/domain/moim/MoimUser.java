package mogether.mogether.domain.moim;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mogether.mogether.domain.bungae.Bungae;
import mogether.mogether.domain.user.User;

import static jakarta.persistence.FetchType.LAZY;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class MoimUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "moim_id")
    private Moim moim;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    //todo: 유저의 가입 날짜 필드

    public MoimUser(Moim moim, User user) {
        this.moim = moim;
        moim.getMoimUserList().add(this);
        this.user = user;
        user.getMoimJoinList().add(this);
    }
}
