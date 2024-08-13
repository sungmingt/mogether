package mogether.mogether.domain.oauth;

import lombok.Data;
import mogether.mogether.domain.user.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

@Data
public class AppUser implements OAuth2User, UserDetails {
    //OAuth2UserService의 processOAuth2User() 에서 리턴하는 인증 객체는 OAuth2User 인터페이스이다.

    //SecurityContext에 들어갈 수 있는 객체는 Authentication 타입뿐이다.
    //Authentication에서 Principal에 들어갈 수 있는 객체는 UserDetails, OAuth2User 등이 있다.
    //UserDetails : 회원가입 프로세스를 직접 구현한 경우 ex)formLogin
    //OAuth2User : 소셜로그인 구현시
    //-> 따라서 이 클래스를 직접 구현한 후, 따로 후처리를 해줘야 한다.

    //todo: oauth2 통합 테스트 후 user가 아닌 id만 갖도록, 또는 id 필드를 별도로 갖도록 refactoring
    private Long id;
    private User user;
    private Map<String, Object> attributes;
    private String attributeKey;

    //일반 로그인
    public AppUser(User user) {
        this.user = user;  //임시 (테스트 후 user 삭제)
        this.id = user.getId();
    }

    //OAuth 로그인
    public AppUser(User user, Map<String, Object> attributes, String attributeKey) {
        this.id = user.getId();
        this.user = user;  //임시 (테스트 후 user 삭제)
        this.attributes = attributes;
        this.attributeKey = attributeKey;
    }

    @Override
    public String getName() {
        return attributes.get(attributeKey).toString();
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(
                new SimpleGrantedAuthority("role"));
    }

    @Override
    public String getPassword() {
        return "user.getPassword()";
    }

    @Override
    public String getUsername() {
        return "user.getNickname()";
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
