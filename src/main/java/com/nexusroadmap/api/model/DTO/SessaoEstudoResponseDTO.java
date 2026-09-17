package com.nexusroadmap.api.model.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class SessaoEstudoResponseDTO {

    private CursoProgressoDTO curso;
    private ProgressoUsuarioDTO usuario;
    private boolean subiuDeNivel;
    private List<ConquistaDTO> conquistasDesbloqueadas;
}
