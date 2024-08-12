package mogether.mogether.web.filter.token;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import mogether.mogether.exception.MogetherException;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
//@Component
public class TokenExceptionFilter extends OncePerRequestFilter {

    //토큰 예외처리 필터 -> token 작업 중 발생하는 예외는 filter에서 일어나기 때문 Controller Advice 처리 불가
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        log.info("tokenExceptionFilter 진입 -> authorized request");

        try {
            filterChain.doFilter(request, response);
        } catch (MogetherException e) {
            log.info("tokenExceptionFiilter catch 진입");

            log.error(e.getMessage());
            response.sendError(e.getErrorCode().getStatus(), e.getMessage());
        }
    }
}