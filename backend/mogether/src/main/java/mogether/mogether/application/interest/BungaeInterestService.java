package mogether.mogether.application.interest;

import lombok.RequiredArgsConstructor;
import mogether.mogether.application.bungae.BungaeService;
import mogether.mogether.application.user.UserService;
import mogether.mogether.domain.bungae.Bungae;
import mogether.mogether.domain.interest.bungae.BungaeInterest;
import mogether.mogether.domain.interest.bungae.BungaeInterestRepository;
import mogether.mogether.domain.oauth.AppUser;
import mogether.mogether.domain.user.User;
import mogether.mogether.exception.MogetherException;
import mogether.mogether.web.bungae.dto.BungaeListResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static mogether.mogether.application.user.UserValidator.*;
import static mogether.mogether.exception.ErrorCode.*;

@Transactional
@RequiredArgsConstructor
@Service
public class BungaeInterestService {

    private final BungaeInterestRepository bungaeInterestRepository;
    private final BungaeService bungaeService;
    private final UserService userService;

    public void doInterest(Long bungaeId, AppUser appUser) {
        if(find(bungaeId, appUser.getId()).isPresent()) return;

        Bungae findBungae = bungaeService.findById(bungaeId);
        User findUser = userService.findById(appUser.getId());

        BungaeInterest bungaeInterest = new BungaeInterest(findBungae, findUser);
        bungaeInterestRepository.save(bungaeInterest);
    }

    public void undoInterest(Long bungaeId, AppUser appUser) {
        find(bungaeId, appUser.getId())
                .ifPresentOrElse(
                        bungaeInterestRepository::delete,
                        () -> {
                            throw new MogetherException(INTEREST_NOT_FOUND);
                        });
    }

    @Transactional(readOnly = true)
    public List<BungaeListResponse> readAll(Long userId, AppUser appUser) {
        //requestUser 검증 (마이페이지는 본인만 볼 수 있기 때문)
        validateUser(userId, appUser.getId());

        User findUser = userService.findById(userId);

        List<BungaeInterest> bungaeInterestList = bungaeInterestRepository.findByUserIdFetchJoin(userId);
        List<Bungae> bungaeList = bungaeInterestList.stream()
                .map(BungaeInterest::getBungae)
                .toList();

        return BungaeListResponse.of(bungaeList, findUser);
    }

    private Optional<BungaeInterest> find(Long bungaeId, Long userId) {
        return bungaeInterestRepository
                .findByBungaeIdAndUserId(bungaeId, userId);
    }
}
