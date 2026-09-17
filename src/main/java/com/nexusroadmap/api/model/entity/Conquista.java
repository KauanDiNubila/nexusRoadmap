package com.nexusroadmap.api.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
public class Conquista {

    @Id
    private String id;

    private String titulo;
    private String descricao;
    private String icone;
    private boolean desbloqueada = false;
    private LocalDate desbloqueadaEm;
}
