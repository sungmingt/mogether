package mogether.mogether.domain.interest.moim;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MoimInterestRepository extends JpaRepository<MoimInterest, Long> {

    List<MoimInterest> findByUserId(Long userId);

    //todo: 테스트 성공, vlog
    @Query(value = "select i from MoimInterest i right join fetch i.moim where i.user.id = :id")
    List<MoimInterest> findByUserIdFetchJoin(@Param("id") long id);

    Optional<MoimInterest> findByMoimIdAndUserId(Long moimId, Long userId);
}