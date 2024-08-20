package mogether.mogether.domain.moim;

import mogether.mogether.domain.info.Address;
import mogether.mogether.domain.user.User;
import mogether.mogether.domain.user.UserRepository;
import mogether.mogether.web.moim.dto.MoimListResponse;
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
class MoimRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MoimRepository moimRepository;

    @Autowired
    private MoimUserRepository moimUserRepository;

    private User user;
    private User user2;
    private final Address address1 = new Address("seoul", "gangnam", "details");
    private final Address address2 = new Address("busan", "haeundae", "details");

    @BeforeEach
    void before() {
        userRepository.deleteAll();
        moimRepository.deleteAll();
        moimUserRepository.deleteAll();

        user = new User("kim", "email123@gmail.com", "s3ImageUrl");
        user2 = new User("park", "park123@gmail.com", "s3ImageUrl");

        Moim moim1 = new Moim(user, "title1", "sports", List.of("imageUrl"), address1);
        Moim moim2 = new Moim(user2, "title2", "activity", List.of("imageUrl"), address1);
        Moim moim3 = new Moim(user, "title3", "party", List.of("imageUrl"), address2);
        Moim moim4 = new Moim(user, "title4", "hobby", List.of("imageUrl"), address2);

        MoimUser moimUser1 = new MoimUser(moim1, user);
        MoimUser moimUser2 = new MoimUser(moim2, user2);
        MoimUser moimUser3 = new MoimUser(moim2, user);
        MoimUser moimUser4 = new MoimUser(moim3, user);
        MoimUser moimUser5 = new MoimUser(moim4, user);

        userRepository.save(user);
        userRepository.save(user2);
        moimRepository.save(moim1);
        moimRepository.save(moim2);
        moimRepository.save(moim3);
        moimRepository.save(moim4);

        moimUserRepository.save(moimUser1);
        moimUserRepository.save(moimUser2);
        moimUserRepository.save(moimUser3);
        moimUserRepository.save(moimUser4);
        moimUserRepository.save(moimUser5);
    }

    @DisplayName("유저의 번개 호스팅 목록을 가져온다 - N:1 1개의 쿼리")
    @Test
    void fetchJoinTest() {
        List<Moim> hostingList = moimRepository.findByHostId(user.getId());
        List<MoimListResponse> responseDto = MoimListResponse.of(hostingList, user);

        for (MoimListResponse response : responseDto) {
            System.out.println(response.getHostId());
            System.out.println(response.getHostName());
            System.out.println(response.isJoined());
        }
    }

    @DisplayName("내용, 주소 기반 검색 - 빈 문자열 입력 시 필터 성공")
    @Test
    void searchByAddressTest1() {
        List<Moim> hostingList = moimRepository.searchByAddress(
                "title4", "", ""
        );

        assertThat(hostingList).hasSize(1);
        assertThat(hostingList.get(0).getTitle()).isEqualTo("title4");
    }

    @DisplayName("내용, 주소 기반 검색 - name은 제목과 내용 모두에 적용되어야 한다")
    @Test
    void searchByAddressTest2() {
        List<Moim> hostingList = moimRepository.searchByAddress(
                "hobby", "", ""
        );

        assertThat(hostingList).hasSize(1);
        assertThat(hostingList.get(0).getTitle()).isEqualTo("title4");
    }

    @DisplayName("내용, 주소 기반 검색 - name과 address 조건을 모두 만족시키는 결과만을 출력한다.")
    @Test
    void searchByAddressTest3() {
        List<Moim> hostingList = moimRepository.searchByAddress(
                "title1", "busan", ""
        );

        assertThat(hostingList).isEmpty();
    }
}