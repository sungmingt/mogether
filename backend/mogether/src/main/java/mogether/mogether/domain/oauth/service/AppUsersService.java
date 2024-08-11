package mogether.mogether.domain.oauth.service;

import lombok.RequiredArgsConstructor;
import mogether.mogether.domain.oauth.AppUser;
import mogether.mogether.domain.user.User;
import mogether.mogether.domain.user.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AppUsersService implements UserDetailsService {
//Spring Security에서 유저의 정보를 가져오는 인터페이스이다.
//Spring Security에서 유저의 정보를 불러오기 위해서 구현해야하는 인터페이스

    private final UserRepository userRepository;

    //함수 종료시 @AuthenticationPrincipal 어노테이션이 만들어진다.
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("username : " + username);
        User userEntity = userRepository.findByEmail(username).get();
        if(userEntity != null){
            return new AppUser(userEntity); //User 타입을 인자로 하는 생성자
        }
        return null;
    }
}