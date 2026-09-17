package com.nexusroadmap.api.controller;

import com.nexusroadmap.api.model.DTO.AtualizarStatusRequestDTO;
import com.nexusroadmap.api.model.DTO.CursoProgressoDTO;
import com.nexusroadmap.api.model.DTO.SessaoEstudoRequestDTO;
import com.nexusroadmap.api.model.DTO.SessaoEstudoResponseDTO;
import com.nexusroadmap.api.service.ProgressoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cursos/{cursoId}")
@RequiredArgsConstructor
@Tag(name = "Cursos", description = "Progresso individual de cada curso do roadmap")
public class CursoController {

    private final ProgressoService progressoService;

    @PatchMapping
    @Operation(summary = "Define manualmente o status de um curso (não concede XP)")
    public ResponseEntity<CursoProgressoDTO> atualizarStatus(
            @PathVariable String cursoId,
            @RequestBody @Valid AtualizarStatusRequestDTO request) {

        return ResponseEntity.ok(progressoService.atualizarStatus(cursoId, request));
    }

    @PostMapping("/sessoes-estudo")
    @Operation(summary = "Registra minutos estudados, concede XP e avalia conquistas automáticas")
    public ResponseEntity<SessaoEstudoResponseDTO> registrarSessaoEstudo(
            @PathVariable String cursoId,
            @RequestBody @Valid SessaoEstudoRequestDTO request) {

        return ResponseEntity.ok(progressoService.registrarSessaoEstudo(cursoId, request));
    }
}
