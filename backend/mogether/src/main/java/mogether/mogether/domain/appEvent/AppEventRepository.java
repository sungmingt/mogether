package mogether.mogether.domain.appEvent;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppEventRepository extends JpaRepository<AppEvent, Long> {

    List<AppEvent> findByUserId(Long userId);
}