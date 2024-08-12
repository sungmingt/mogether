package mogether.mogether.domain.bungae;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BungaeRepository extends JpaRepository<Bungae, Long> {

    //contains / ==
    @Query("SELECT b FROM Bungae b"
            + " WHERE (b.title LIKE %:name% or b.content LIKE %:name%)"
            + " AND b.address.city LIKE %:city%"
            + " AND b.address.gu LIKE %:gu%"
    )
    List<Bungae> searchByAddress(@Param("name") String name,
                                 @Param("city") String city,
                                 @Param("gu") String gu
    );

    //todo: 연관된 user 정보 조회 시 추가 쿼리가 안나가는 이유
    List<Bungae> findByHostId(Long hostId);
}
