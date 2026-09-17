package com.nexusroadmap.api.exception;

import com.nexusroadmap.api.model.DTO.ErroResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroResponseDTO> handleNaoEncontrado(RecursoNaoEncontradoException ex) {
        return construirResposta(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponseDTO> handleValidacao(MethodArgumentNotValidException ex) {
        String mensagem = ex.getBindingResult().getFieldErrors().stream()
                .map(erro -> erro.getField() + ": " + erro.getDefaultMessage())
                .reduce((a, b) -> a + "; " + b)
                .orElse("Dados inválidos");

        return construirResposta(HttpStatus.BAD_REQUEST, mensagem);
    }

    private ResponseEntity<ErroResponseDTO> construirResposta(HttpStatus status, String mensagem) {
        ErroResponseDTO erro = new ErroResponseDTO(LocalDateTime.now(), status.value(), mensagem);
        return ResponseEntity.status(status).body(erro);
    }
}
