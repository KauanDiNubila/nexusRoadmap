package com.nexusroadmap.api.model.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class SnapshotDTO {

    private ProgressoUsuarioDTO usuario;
    private List<CursoProgressoDTO> cursos;
    private List<ConquistaDTO> conquistas;
}
