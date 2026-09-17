package com.nexusroadmap.api.controller;

import com.nexusroadmap.api.model.DTO.SnapshotDTO;
import com.nexusroadmap.api.service.ProgressoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/progresso")
@RequiredArgsConstructor
@Tag(name = "Progresso", description = "Snapshot completo do progresso do usuário")
public class ProgressoController {

    private final ProgressoService progressoService;

    @GetMapping
    @Operation(summary = "Retorna o progresso do usuário, status dos cursos e conquistas")
    public ResponseEntity<SnapshotDTO> obterSnapshot() {
        return ResponseEntity.ok(progressoService.obterSnapshot());
    }
}
