package mogether.mogether.domain.bungae;

import mogether.mogether.domain.info.Address;
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
class BungaeRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BungaeRepository bungaeRepository;

    @Autowired
    private BungaeUserRepository bungaeUserRepository;

    private User user;
    private User user2;
    private final Address address1 = new Address("seoul", "gangnam", "details");
    private final Address address2 = new Address("busan", "haeundae", "details");

    @BeforeEach
    void before() {
        userRepository.deleteAll();
        bungaeRepository.deleteAll();
        bungaeUserRepository.deleteAll();

        user = new User("kim", "email123@gmail.com", "s3ImageUrl");
        user2 = new User("park", "park123@gmail.com", "s3ImageUrl");

        Bungae bungae1 = new Bungae(user, "title1", "sports", List.of("imageUrl"), address1);
        Bungae bungae2 = new Bungae(user2, "title2", "activity", List.of("imageUrl"),address1);
        Bungae bungae3 = new Bungae(user, "title3", "party", List.of("imageUrl"), address2);
        Bungae bungae4 = new Bungae(user, "title4", "hobby", List.of("imageUrl"), address2);

        BungaeUser bungaeUser1 = new BungaeUser(bungae1, user);
        BungaeUser bungaeUser2 = new BungaeUser(bungae2, user2);
        BungaeUser bungaeUser3 = new BungaeUser(bungae2, user);
        BungaeUser bungaeUser4 = new BungaeUser(bungae3, user);
        BungaeUser bungaeUser5 = new BungaeUser(bungae4, user);

        userRepository.save(user);
        userRepository.save(user2);
        bungaeRepository.save(bungae1);
        bungaeRepository.save(bungae2);
        bungaeRepository.save(bungae3);
        bungaeRepository.save(bungae4);

        bungaeUserRepository.save(bungaeUser1);
        bungaeUserRepository.save(bungaeUser2);
        bungaeUserRepository.save(bungaeUser3);
        bungaeUserRepository.save(bungaeUser4);
        bungaeUserRepository.save(bungaeUser5);
    }

    @DisplayName("유저의 번개 호스팅 목록을 가져온다 - N:1 1개의 쿼리")
    @Test
    void fetchJoinTest() {
        System.out.println("===========");
        List<Bungae> hostingList = bungaeRepository.findByHostId(user.getId());
        List<BungaeListResponse> responseDto = BungaeListResponse.of(hostingList, user);

        for (BungaeListResponse response : responseDto) {
            System.out.println(response.getHostId());
            System.out.println(response.getHostName());
            System.out.println(response.isJoined());
        }
    }

    @DisplayName("내용, 주소 기반 검색 - 빈 문자열 입력 시 필터 성공")
    @Test
    void searchByAddressTest1() {
        System.out.println("===========");
        List<Bungae> hostingList = bungaeRepository.searchByAddress(
                "title4", "", ""
        );

        assertThat(hostingList).hasSize(1);
        assertThat(hostingList.get(0).getTitle()).isEqualTo("title4");
    }

    @DisplayName("내용, 주소 기반 검색 - name은 제목과 내용 모두에 적용되어야 한다.")
    @Test
    void searchByAddressTest2() {
        System.out.println("===========");
        List<Bungae> hostingList = bungaeRepository.searchByAddress(
                "hobby", "", ""
        );

        assertThat(hostingList).hasSize(1);
        assertThat(hostingList.get(0).getTitle()).isEqualTo("title4");
    }

    @DisplayName("내용, 주소 기반 검색 - name과 address 조건을 모두 만족시키는 결과만을 출력한다.")
    @Test
    void searchByAddressTest3() {
        System.out.println("===========");
        List<Bungae> hostingList = bungaeRepository.searchByAddress(
                "title1", "busan", ""
        );

        assertThat(hostingList).isEmpty();
    }

}