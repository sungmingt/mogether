package mogether.mogether.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mogether.mogether.domain.chat.ChatMessage;
import mogether.mogether.domain.chat.ChatMessageRepository;
import mogether.mogether.domain.chat.RedisChatMessageRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Component
public class ChatMessageScheduler {

    private final ChatMessageRepository chatMessageRepository;
    private final RedisChatMessageRepository redisChatMessageRepository;

    @Transactional
    @Scheduled(cron = "0 0 4 * * *") //매일 4AM Redis-MySQL 동기화 작업
    public void applyToRDB() {
        //Redis -> RDB 반영
        List<ChatMessage> chatMessages = redisChatMessageRepository.findAll();
        chatMessageRepository.saveAll(chatMessages);

        //RDB -> Redis 동기화
        redisChatMessageRepository.clearAll();
        List<ChatMessage> recentMessages = chatMessageRepository.findAll();
        redisChatMessageRepository.saveAllToRedis(recentMessages);
    }
}
