package com.nexusroadmap.api.model.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class ErroResponseDTO {

    private LocalDateTime timestamp;
    private int status;
    private String mensagem;
}
