package mogether.mogether.application.interest;

import lombok.RequiredArgsConstructor;
import mogether.mogether.application.moim.MoimService;
import mogether.mogether.application.user.UserService;
import mogether.mogether.domain.interest.moim.MoimInterest;
import mogether.mogether.domain.interest.moim.MoimInterestRepository;
import mogether.mogether.domain.moim.Moim;
import mogether.mogether.domain.oauth.AppUser;
import mogether.mogether.domain.user.User;
import mogether.mogether.exception.ErrorCode;
import mogether.mogether.exception.MogetherException;
import mogether.mogether.web.moim.dto.MoimListResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static mogether.mogether.application.user.UserValidator.*;

@Transactional
@RequiredArgsConstructor
@Service
public class MoimInterestService {

    private final MoimInterestRepository moimInterestRepository;
    private final MoimService moimService;
    private final UserService userService;


    public void doInterest(Long moimId, AppUser appUser) {
        Long userId = appUser.getUser().getId();
        if(checkInterestExists(moimId, userId).isPresent()) return;

        Moim findMoim = moimService.findById(moimId);
        User findUser = userService.findById(userId);

        MoimInterest moimInterest = new MoimInterest(findMoim, findUser);
        moimInterestRepository.save(moimInterest);
    }

    public void undoInterest(Long moimId, AppUser appUser) {
        Long userId = appUser.getUser().getId();
        checkInterestExists(moimId, userId)
                .ifPresentOrElse(
                        moimInterestRepository::delete,
                        () -> {
                            throw new MogetherException(ErrorCode.INTEREST_NOT_FOUND);
                        });
    }

    @Transactional(readOnly = true)
    public List<MoimListResponse> readAll(Long userId, AppUser appUser) {
        validateUser(userId, appUser.getId());

        User findUser = userService.findById(userId);
        List<MoimInterest> moimInterestList = moimInterestRepository.findByUserIdFetchJoin(userId);
        List<Moim> moimList = moimInterestList.stream()
                .map(MoimInterest::getMoim)
                .toList();

        return MoimListResponse.of(moimList, findUser);
    }

    private Optional<MoimInterest> checkInterestExists(Long moimId, Long userId) {
        return moimInterestRepository
                .findByMoimIdAndUserId(moimId, userId);
    }

}
