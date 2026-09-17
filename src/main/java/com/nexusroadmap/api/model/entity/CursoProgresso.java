package com.nexusroadmap.api.model.entity;

import com.nexusroadmap.api.model.enumeration.StatusCurso;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class CursoProgresso {

    @Id
    private String cursoId;

    @Enumerated(EnumType.STRING)
    private StatusCurso status = StatusCurso.NOT_STARTED;

    private int studiedMinutes = 0;
}
