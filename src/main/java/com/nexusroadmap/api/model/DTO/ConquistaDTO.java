package com.nexusroadmap.api.model.DTO;

import com.nexusroadmap.api.model.entity.Conquista;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class ConquistaDTO {

    private String id;
    private String titulo;
    private String descricao;
    private String icone;
    private boolean desbloqueada;
    private LocalDate desbloqueadaEm;

    public static ConquistaDTO de(Conquista conquista) {
        return new ConquistaDTO(
                conquista.getId(),
                conquista.getTitulo(),
                conquista.getDescricao(),
                conquista.getIcone(),
                conquista.isDesbloqueada(),
                conquista.getDesbloqueadaEm()
        );
    }
}
