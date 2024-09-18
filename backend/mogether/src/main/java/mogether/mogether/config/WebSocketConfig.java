package mogether.mogether.config;

import mogether.mogether.web.chat.WebSocketHandshakeInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

import static mogether.mogether.domain.AllowedOrigins.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry){
        //ws로 도착하는 것은 stomp통신으로 인식하도록 한다 -> ex)ws://api.mo-gether.site/ws
        registry.addEndpoint("/ws")
                .setAllowedOrigins(allowedOrigins);
//                .addInterceptors(new WebSocketHandshakeInterceptor());
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry){
        registry.enableSimpleBroker("/sub"); //메시지 수신 요청 endpoint
        registry.setApplicationDestinationPrefixes("/pub");   //메시지 발신 요청 endpoint
    }
}