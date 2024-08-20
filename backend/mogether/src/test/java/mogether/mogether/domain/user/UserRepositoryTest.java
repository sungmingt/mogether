package mogether.mogether.domain.user;

import mogether.mogether.domain.info.Address;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

@ActiveProfiles("test")
@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    private User user;
    private User user2;
    private final Address address1 = new Address("seoul", "gangnam", "details");
    private final Address address2 = new Address("busan", "haeundae", "details");

    @BeforeEach
    void before() {
        userRepository.deleteAll();
        user = new User("kim", "kim123@gmail.com", "s3ImageUrl");
        user2 = new User("park", "park123@gmail.com", "s3ImageUrl");

        userRepository.save(user);
        userRepository.save(user2);
    }

    @DisplayName("이메일로 유저를 조회한다 - 성공")
    @Test
    void findByEmailTest() {
        Optional<User> findUser = userRepository.findByEmail(user.getEmail());

        assertThat(findUser).isPresent();
        assertThat(findUser.get().getNickname()).isEqualTo(user.getNickname());
    }

    @DisplayName("이메일이 존재하는지 확인한다 - 성공")
    @Test
    void existsByEmailTest() {
        Optional<User> findUser = userRepository.findByEmail(user.getEmail());
        assertThat(findUser).isPresent();
    }

    @DisplayName("이메일이 존재하는지 확인한다 2 - 성공")
    @Test
    void existsByEmailTest2() {
        Optional<User> findUser = userRepository.findByEmail("randomEmail123@gmail.com");
        assertThat(findUser).isEmpty();
    }
}