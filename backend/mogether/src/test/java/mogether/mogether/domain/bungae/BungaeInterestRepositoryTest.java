package mogether.mogether.domain.bungae;

import mogether.mogether.domain.info.Address;
import mogether.mogether.domain.interest.bungae.BungaeInterest;
import mogether.mogether.domain.interest.bungae.BungaeInterestRepository;
import mogether.mogether.domain.user.User;
import mogether.mogether.domain.user.UserRepository;
import mogether.mogether.web.bungae.dto.BungaeListResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("test")
@DataJpaTest
class BungaeInterestRepositoryTest {

    @Autowired
    private BungaeInterestRepository bungaeInterestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BungaeRepository bungaeRepository;

    private User user;

    @BeforeEach
    void before() {
        user = new User("kim", "email123@gmail.com", "s3ImageUrl");
        Bungae bungae1 = new Bungae(user, "title", "content", List.of("imageUrl"), new Address("seoul", "gangnam", "details"));
        Bungae bungae2 = new Bungae(user, "title", "content", List.of("imageUrl"), new Address("seoul", "gangnam", "details"));
        Bungae bungae3 = new Bungae(user, "title", "content", List.of("imageUrl"), new Address("seoul", "gangnam", "details"));
        Bungae bungae4 = new Bungae(user, "title", "content", List.of("imageUrl"), new Address("seoul", "gangnam", "details"));

        BungaeInterest bungaeInterest1 = new BungaeInterest(bungae1, user);
        BungaeInterest bungaeInterest2 = new BungaeInterest(bungae2, user);
        BungaeInterest bungaeInterest3 = new BungaeInterest(bungae3, user);
        BungaeInterest bungaeInterest4 = new BungaeInterest(bungae4, user);

        userRepository.save(user);
        bungaeRepository.save(bungae1);
        bungaeRepository.save(bungae2);
        bungaeRepository.save(bungae3);
        bungaeRepository.save(bungae4);

        bungaeInterestRepository.save(bungaeInterest1);
        bungaeInterestRepository.save(bungaeInterest2);
        bungaeInterestRepository.save(bungaeInterest3);
        bungaeInterestRepository.save(bungaeInterest4);
    }

    @DisplayName("유저의 관심 번개 목록을 가져온다 - fetch join 성공, 1개의 쿼리")
    @Test
    void fetchJoinTest() {
        //조회
        List<BungaeInterest> bungaeInterestList = bungaeInterestRepository.findByUserIdFetchJoin(user.getId());

        //연관 엔티티 조회 (N+1가 발생하면 안 된다)
        List<Bungae> bungaeList = bungaeInterestList.stream()
                .map(BungaeInterest::getBungae)
                .toList();
        BungaeListResponse.of(bungaeList, user);

        assertThat(bungaeInterestList).hasSize(4);
    }
}
