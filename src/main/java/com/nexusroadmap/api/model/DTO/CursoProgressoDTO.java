package com.nexusroadmap.api.model.DTO;

import com.nexusroadmap.api.model.entity.CursoProgresso;
import com.nexusroadmap.api.model.enumeration.StatusCurso;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CursoProgressoDTO {

    private String cursoId;
    private StatusCurso status;
    private int studiedMinutes;

    public static CursoProgressoDTO de(CursoProgresso curso) {
        return new CursoProgressoDTO(curso.getCursoId(), curso.getStatus(), curso.getStudiedMinutes());
    }
}
