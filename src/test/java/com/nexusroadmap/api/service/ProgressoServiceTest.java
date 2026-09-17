package com.nexusroadmap.api.service;

import com.nexusroadmap.api.exception.RecursoNaoEncontradoException;
import com.nexusroadmap.api.model.DTO.AtualizarStatusRequestDTO;
import com.nexusroadmap.api.model.DTO.ConquistaDTO;
import com.nexusroadmap.api.model.DTO.CursoProgressoDTO;
import com.nexusroadmap.api.model.DTO.SessaoEstudoRequestDTO;
import com.nexusroadmap.api.model.DTO.SessaoEstudoResponseDTO;
import com.nexusroadmap.api.model.DTO.SnapshotDTO;
import com.nexusroadmap.api.model.enumeration.StatusCurso;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.tuple;

@SpringBootTest
@Transactional
class ProgressoServiceTest {

    @Autowired
    private ProgressoService progressoService;

    private SessaoEstudoRequestDTO sessao(int minutos, int duracaoTotalMinutos) {
        SessaoEstudoRequestDTO dto = new SessaoEstudoRequestDTO();
        dto.setMinutos(minutos);
        dto.setDuracaoTotalMinutos(duracaoTotalMinutos);
        return dto;
    }

    private AtualizarStatusRequestDTO atualizarStatus(StatusCurso status, int duracaoTotalMinutos) {
        AtualizarStatusRequestDTO dto = new AtualizarStatusRequestDTO();
        dto.setStatus(status);
        dto.setDuracaoTotalMinutos(duracaoTotalMinutos);
        return dto;
    }

    @Test
    void registrarSessaoEstudo_concedeXpEAcumulaMinutos() {
        SessaoEstudoResponseDTO resposta = progressoService.registrarSessaoEstudo("curso-x", sessao(25, 300));

        assertThat(resposta.getCurso().getStatus()).isEqualTo(StatusCurso.IN_PROGRESS);
        assertThat(resposta.getCurso().getStudiedMinutes()).isEqualTo(25);
        assertThat(resposta.getUsuario().getXp()).isEqualTo(25);
        assertThat(resposta.getUsuario().getTotalSessions()).isEqualTo(1);
        assertThat(resposta.getUsuario().getTotalStudiedMinutes()).isEqualTo(25);
        assertThat(resposta.isSubiuDeNivel()).isFalse();
    }

    @Test
    void registrarSessaoEstudo_capaMinutosNaDuracaoTotalECompletaOCurso() {
        SessaoEstudoResponseDTO resposta = progressoService.registrarSessaoEstudo("curso-y", sessao(80, 50));

        assertThat(resposta.getCurso().getStudiedMinutes()).isEqualTo(50);
        assertThat(resposta.getCurso().getStatus()).isEqualTo(StatusCurso.COMPLETED);
    }

    @Test
    void registrarSessaoEstudo_desbloqueiaFirstStepAoConcluirPrimeiroCurso() {
        SessaoEstudoResponseDTO resposta = progressoService.registrarSessaoEstudo("curso-z", sessao(50, 50));

        assertThat(resposta.getConquistasDesbloqueadas())
                .extracting(ConquistaDTO::getId)
                .contains("first-step");
    }

    @Test
    void registrarSessaoEstudo_naoDesbloqueiaFirstStepDeNovoQuandoOutroCursoConclui() {
        progressoService.registrarSessaoEstudo("curso-a", sessao(50, 50));
        SessaoEstudoResponseDTO segunda = progressoService.registrarSessaoEstudo("curso-b", sessao(30, 30));

        assertThat(segunda.getConquistasDesbloqueadas())
                .extracting(ConquistaDTO::getId)
                .doesNotContain("first-step");
    }

    @Test
    void registrarSessaoEstudo_sobeDeNivelQuandoXpAtingeOLimite() {
        progressoService.registrarSessaoEstudo("curso-x", sessao(25, 1000));
        progressoService.registrarSessaoEstudo("curso-x", sessao(25, 1000));
        progressoService.registrarSessaoEstudo("curso-x", sessao(25, 1000));
        SessaoEstudoResponseDTO quarta = progressoService.registrarSessaoEstudo("curso-x", sessao(25, 1000));

        assertThat(quarta.isSubiuDeNivel()).isTrue();
        assertThat(quarta.getUsuario().getLevel()).isEqualTo(2);
        assertThat(quarta.getUsuario().getXp()).isEqualTo(0);
        assertThat(quarta.getUsuario().getXpToNext()).isEqualTo(112);
    }

    @Test
    void registrarSessaoEstudo_desbloqueiaDeepWorkNaDecimaSessao() {
        for (int i = 0; i < 9; i++) {
            SessaoEstudoResponseDTO resposta = progressoService.registrarSessaoEstudo("curso-x", sessao(5, 10000));
            assertThat(resposta.getConquistasDesbloqueadas()).extracting(ConquistaDTO::getId).doesNotContain("deep-work");
        }

        SessaoEstudoResponseDTO decima = progressoService.registrarSessaoEstudo("curso-x", sessao(5, 10000));

        assertThat(decima.getConquistasDesbloqueadas()).extracting(ConquistaDTO::getId).contains("deep-work");
    }

    @Test
    void atualizarStatus_completedDefineMinutosComoADuracaoTotal() {
        CursoProgressoDTO resultado = progressoService.atualizarStatus("curso-x", atualizarStatus(StatusCurso.COMPLETED, 120));

        assertThat(resultado.getStatus()).isEqualTo(StatusCurso.COMPLETED);
        assertThat(resultado.getStudiedMinutes()).isEqualTo(120);
    }

    @Test
    void atualizarStatus_notStartedZeraOsMinutosEstudados() {
        progressoService.atualizarStatus("curso-x", atualizarStatus(StatusCurso.IN_PROGRESS, 120));
        CursoProgressoDTO resultado = progressoService.atualizarStatus("curso-x", atualizarStatus(StatusCurso.NOT_STARTED, 120));

        assertThat(resultado.getStudiedMinutes()).isZero();
    }

    @Test
    void atualizarStatus_naoConcedeXp() {
        progressoService.atualizarStatus("curso-x", atualizarStatus(StatusCurso.COMPLETED, 120));

        SnapshotDTO snapshot = progressoService.obterSnapshot();

        assertThat(snapshot.getUsuario().getXp()).isZero();
        assertThat(snapshot.getUsuario().getTotalSessions()).isZero();
    }

    @Test
    void desbloquearConquista_eIdempotente() {
        ConquistaDTO primeira = progressoService.desbloquearConquista("architect");
        ConquistaDTO segunda = progressoService.desbloquearConquista("architect");

        assertThat(primeira.isDesbloqueada()).isTrue();
        assertThat(segunda.isDesbloqueada()).isTrue();
        assertThat(segunda.getDesbloqueadaEm()).isEqualTo(primeira.getDesbloqueadaEm());
    }

    @Test
    void desbloquearConquista_comIdInexistenteLancaExcecao() {
        assertThatThrownBy(() -> progressoService.desbloquearConquista("nao-existe"))
                .isInstanceOf(RecursoNaoEncontradoException.class);
    }

    @Test
    void obterSnapshot_refleteCursosECursosTocados() {
        progressoService.registrarSessaoEstudo("curso-x", sessao(10, 100));

        SnapshotDTO snapshot = progressoService.obterSnapshot();

        assertThat(snapshot.getCursos())
                .extracting(CursoProgressoDTO::getCursoId, CursoProgressoDTO::getStudiedMinutes)
                .contains(tuple("curso-x", 10));
        assertThat(snapshot.getConquistas()).hasSize(8);
    }
}
