package mogether.mogether.domain.interest.bungae;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BungaeInterestRepository extends JpaRepository<BungaeInterest, Long> {

    List<BungaeInterest> findByUserId(Long userId);

    //todo: 테스트 성공, vlog
    @Query(value = "select i from BungaeInterest i right join fetch i.bungae where i.user.id = :id")
    List<BungaeInterest> findByUserIdFetchJoin(@Param("id") long id);

    Optional<BungaeInterest> findByBungaeIdAndUserId(Long bungaeId, Long userId);
}
