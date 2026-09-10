package cn.bugstack;

import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@Configurable
@EnableScheduling
@ComponentScan(basePackages = {
        "cn.bugstack.domain",
        "cn.bugstack.infrastructure",
        "cn.bugstack.trigger",
        "cn.bugstack.config"
})
public class Application {

    public static void main(String[] args){
        SpringApplication.run(Application.class);
    }

}
