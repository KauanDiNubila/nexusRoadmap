package com.nexusroadmap.api.model.DTO;

import com.nexusroadmap.api.model.enumeration.StatusCurso;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AtualizarStatusRequestDTO {

    @NotNull
    private StatusCurso status;

    @NotNull
    @Min(1)
    private Integer duracaoTotalMinutos;
}
