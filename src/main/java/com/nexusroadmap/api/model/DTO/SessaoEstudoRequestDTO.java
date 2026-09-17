package com.nexusroadmap.api.model.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SessaoEstudoRequestDTO {

    @NotNull
    @Min(1)
    private Integer minutos;

    @NotNull
    @Min(1)
    private Integer duracaoTotalMinutos;
}
