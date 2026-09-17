package com.nexusroadmap.api.service;

import com.nexusroadmap.api.exception.RecursoNaoEncontradoException;
import com.nexusroadmap.api.model.DTO.AtualizarStatusRequestDTO;
import com.nexusroadmap.api.model.DTO.ConquistaDTO;
import com.nexusroadmap.api.model.DTO.CursoProgressoDTO;
import com.nexusroadmap.api.model.DTO.ProgressoUsuarioDTO;
import com.nexusroadmap.api.model.DTO.SessaoEstudoRequestDTO;
import com.nexusroadmap.api.model.DTO.SessaoEstudoResponseDTO;
import com.nexusroadmap.api.model.DTO.SnapshotDTO;
import com.nexusroadmap.api.model.entity.Conquista;
import com.nexusroadmap.api.model.entity.CursoProgresso;
import com.nexusroadmap.api.model.entity.ProgressoUsuario;
import com.nexusroadmap.api.model.enumeration.StatusCurso;
import com.nexusroadmap.api.model.repository.ConquistaRepository;
import com.nexusroadmap.api.model.repository.CursoProgressoRepository;
import com.nexusroadmap.api.model.repository.ProgressoUsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgressoService {

    private static final int XP_POR_SESSAO = 25;
    private static final double FATOR_CRESCIMENTO_NIVEL = 1.12;
    private static final int MINUTOS_PARA_CEM_HORAS = 6000;
    private static final int SESSOES_PARA_DEEP_WORK = 10;
    private static final int HORA_NIGHT_OWL = 22;

    private final CursoProgressoRepository cursoProgressoRepository;
    private final ProgressoUsuarioRepository progressoUsuarioRepository;
    private final ConquistaRepository conquistaRepository;

    public SnapshotDTO obterSnapshot() {
        ProgressoUsuario usuario = buscarUsuario();
        List<CursoProgressoDTO> cursos = cursoProgressoRepository.findAll().stream()
                .map(CursoProgressoDTO::de)
                .toList();
        List<ConquistaDTO> conquistas = conquistaRepository.findAll().stream()
                .map(ConquistaDTO::de)
                .toList();

        return new SnapshotDTO(ProgressoUsuarioDTO.de(usuario), cursos, conquistas);
    }

    @Transactional
    public CursoProgressoDTO atualizarStatus(String cursoId, AtualizarStatusRequestDTO request) {
        CursoProgresso curso = buscarOuCriarCurso(cursoId);
        StatusCurso status = request.getStatus();
        int duracaoTotalMinutos = request.getDuracaoTotalMinutos();

        int studiedMinutes = switch (status) {
            case COMPLETED -> duracaoTotalMinutos;
            case NOT_STARTED -> 0;
            case IN_PROGRESS -> Math.max(curso.getStudiedMinutes(), Math.round(duracaoTotalMinutos * 0.15f));
        };

        curso.setStatus(status);
        curso.setStudiedMinutes(studiedMinutes);
        cursoProgressoRepository.save(curso);

        return CursoProgressoDTO.de(curso);
    }

    @Transactional
    public SessaoEstudoResponseDTO registrarSessaoEstudo(String cursoId, SessaoEstudoRequestDTO request) {
        CursoProgresso curso = buscarOuCriarCurso(cursoId);
        int duracaoTotalMinutos = request.getDuracaoTotalMinutos();
        int minutos = request.getMinutos();

        boolean estavaCompleto = curso.getStatus() == StatusCurso.COMPLETED;
        curso.setStudiedMinutes(Math.min(duracaoTotalMinutos, curso.getStudiedMinutes() + minutos));
        curso.setStatus(curso.getStudiedMinutes() >= duracaoTotalMinutos ? StatusCurso.COMPLETED : StatusCurso.IN_PROGRESS);
        cursoProgressoRepository.save(curso);
        boolean concluiuAgora = !estavaCompleto && curso.getStatus() == StatusCurso.COMPLETED;

        ProgressoUsuario usuario = buscarUsuario();
        boolean subiuDeNivel = aplicarXp(usuario, minutos);
        progressoUsuarioRepository.save(usuario);

        List<ConquistaDTO> desbloqueadas = avaliarConquistasAutomaticas(usuario, concluiuAgora);

        return new SessaoEstudoResponseDTO(
                CursoProgressoDTO.de(curso),
                ProgressoUsuarioDTO.de(usuario),
                subiuDeNivel,
                desbloqueadas
        );
    }

    @Transactional
    public ConquistaDTO desbloquearConquista(String conquistaId) {
        Conquista conquista = conquistaRepository.findById(conquistaId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Conquista não encontrada"));

        if (!conquista.isDesbloqueada()) {
            conquista.setDesbloqueada(true);
            conquista.setDesbloqueadaEm(LocalDate.now());
            conquistaRepository.save(conquista);
        }

        return ConquistaDTO.de(conquista);
    }

    private boolean aplicarXp(ProgressoUsuario usuario, int minutosEstudados) {
        boolean subiuDeNivel = false;
        int xp = usuario.getXp() + XP_POR_SESSAO;
        int xpToNext = usuario.getXpToNext();
        int level = usuario.getLevel();

        while (xp >= xpToNext) {
            xp -= xpToNext;
            level += 1;
            xpToNext = Math.round(xpToNext * (float) FATOR_CRESCIMENTO_NIVEL);
            subiuDeNivel = true;
        }

        usuario.setXp(xp);
        usuario.setXpToNext(xpToNext);
        usuario.setLevel(level);
        usuario.setTotalStudiedMinutes(usuario.getTotalStudiedMinutes() + minutosEstudados);
        usuario.setTotalSessions(usuario.getTotalSessions() + 1);

        return subiuDeNivel;
    }

    private List<ConquistaDTO> avaliarConquistasAutomaticas(ProgressoUsuario usuario, boolean concluiuCursoAgora) {
        List<ConquistaDTO> desbloqueadas = new ArrayList<>();

        if (concluiuCursoAgora) {
            desbloquearSeElegivel("first-step").ifPresent(desbloqueadas::add);
        }
        if (usuario.getTotalSessions() >= SESSOES_PARA_DEEP_WORK) {
            desbloquearSeElegivel("deep-work").ifPresent(desbloqueadas::add);
        }
        if (usuario.getTotalStudiedMinutes() >= MINUTOS_PARA_CEM_HORAS) {
            desbloquearSeElegivel("hundred-hours").ifPresent(desbloqueadas::add);
        }
        if (LocalDateTime.now().getHour() >= HORA_NIGHT_OWL) {
            desbloquearSeElegivel("night-owl").ifPresent(desbloqueadas::add);
        }

        return desbloqueadas;
    }

    private java.util.Optional<ConquistaDTO> desbloquearSeElegivel(String conquistaId) {
        return conquistaRepository.findById(conquistaId)
                .filter(conquista -> !conquista.isDesbloqueada())
                .map(conquista -> {
                    conquista.setDesbloqueada(true);
                    conquista.setDesbloqueadaEm(LocalDate.now());
                    conquistaRepository.save(conquista);
                    return ConquistaDTO.de(conquista);
                });
    }

    private CursoProgresso buscarOuCriarCurso(String cursoId) {
        return cursoProgressoRepository.findById(cursoId).orElseGet(() -> {
            CursoProgresso novo = new CursoProgresso();
            novo.setCursoId(cursoId);
            return novo;
        });
    }

    private ProgressoUsuario buscarUsuario() {
        return progressoUsuarioRepository.findById(1L)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Progresso do usuário não inicializado"));
    }
}
