package mogether.mogether;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class MogetherApplication {

	public static void main(String[] args) {
		SpringApplication.run(MogetherApplication.class, args);
	}
}
