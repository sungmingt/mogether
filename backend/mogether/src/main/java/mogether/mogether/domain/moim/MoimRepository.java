package mogether.mogether.domain.moim;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MoimRepository extends JpaRepository<Moim, Long> {

    //contains / ==
    @Query("SELECT m FROM Moim m"
            + " WHERE (m.title LIKE %:name% or m.content LIKE %:name%)"
            + " AND m.address.city LIKE %:city%"
            + " AND m.address.gu LIKE %:gu%"
    )
    List<Moim> searchByAddress(@Param("name") String name,
                               @Param("city") String city,
                               @Param("gu") String gu
    );

    //todo: 연관된 user 정보 조회 시 추가 쿼리가 안나가는 이유
    List<Moim> findByHostId(Long hostId);
}
