package com.nexusroadmap.api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI apiInfo() {
        return new OpenAPI()
                .info(new Info()
                        .title("Nexus Roadmap API")
                        .description("Persiste o progresso de estudo, XP/nível e conquistas do roadmap gamificado")
                        .version("v1"));
    }
}
