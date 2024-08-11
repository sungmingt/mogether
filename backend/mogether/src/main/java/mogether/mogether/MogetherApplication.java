package mogether.mogether;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableCaching
public class MogetherApplication {

	public static void main(String[] args) {
		SpringApplication.run(MogetherApplication.class, args);
	}
}
