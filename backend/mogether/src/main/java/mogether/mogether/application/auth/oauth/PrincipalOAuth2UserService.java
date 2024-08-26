package mogether.mogether.application.auth.oauth;

import lombok.RequiredArgsConstructor;
import mogether.mogether.domain.oauth.OAuth2UserInfo;
import mogether.mogether.domain.oauth.AppUser;
import mogether.mogether.domain.user.User;
import mogether.mogether.domain.user.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class PrincipalOAuth2UserService extends DefaultOAuth2UserService {
    //loadUser는 스프링 시큐리티 OAuth2LoginAuthenticationFilter에서 시작된 OAuth2 인증 과정 중에 호출된다.
    //호출되는 시점은 ATK를 OAuth2 제공자로부터 받았을 때이며, 이때 유저의 정보를 리소스 서버로부터 받아오는 작업울 한다.

    private final UserRepository userRepository;

    @Transactional
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // 1. 유저 정보(attributes) 가져오기
        Map<String, Object> oAuth2UserAttributes = super.loadUser(userRequest).getAttributes();

        // 2. resistrationId 가져오기 (third-party id, google)
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        // 3. userNameAttributeName 가져오기 (구글 : sub, 네이버 : id 이며, 이것의 value가 providerId)
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails()
                .getUserInfoEndpoint().getUserNameAttributeName();

        // 4. 유저 정보 dto 생성
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfo.of(registrationId, oAuth2UserAttributes);

        // 5. 회원가입 또는 로그인
        User user = saveOrCreateUser(oAuth2UserInfo);

        // 6. OAuth2User로 반환
        return new AppUser(user, oAuth2UserAttributes, userNameAttributeName);
    }

    private User saveOrCreateUser(OAuth2UserInfo oAuth2UserInfo) {
        User findUser = userRepository.findByEmail(oAuth2UserInfo.getEmail())
                .orElse(oAuth2UserInfo.toEntity());
        return userRepository.save(findUser);
    }
}