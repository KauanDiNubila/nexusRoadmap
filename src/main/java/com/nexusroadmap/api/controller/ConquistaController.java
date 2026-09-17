package com.nexusroadmap.api.controller;

import com.nexusroadmap.api.model.DTO.ConquistaDTO;
import com.nexusroadmap.api.service.ProgressoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/conquistas/{conquistaId}")
@RequiredArgsConstructor
@Tag(name = "Conquistas", description = "Desbloqueio de conquistas que dependem de contexto só conhecido pelo frontend (ex: categoria inteira concluída)")
public class ConquistaController {

    private final ProgressoService progressoService;

    @PostMapping("/desbloquear")
    @Operation(summary = "Desbloqueia uma conquista (idempotente)")
    public ResponseEntity<ConquistaDTO> desbloquear(@PathVariable String conquistaId) {
        return ResponseEntity.ok(progressoService.desbloquearConquista(conquistaId));
    }
}
