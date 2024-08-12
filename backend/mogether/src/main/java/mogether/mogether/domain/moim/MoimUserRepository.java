package mogether.mogether.domain.moim;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MoimUserRepository extends JpaRepository<MoimUser, Long> {

    Optional<MoimUser> findByMoimIdAndUserId(Long moimId, Long userId);
}
