package mogether.mogether.domain.bungae;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BungaeUserRepository extends JpaRepository<BungaeUser, Long> {

    Optional<BungaeUser> findByBungaeIdAndUserId(Long bungaeId, Long userId);

    List<BungaeUser> findByUserId(Long userId);
}
