package com.nexusroadmap.api.config;

import com.nexusroadmap.api.model.entity.Conquista;
import com.nexusroadmap.api.model.entity.ProgressoUsuario;
import com.nexusroadmap.api.model.repository.ConquistaRepository;
import com.nexusroadmap.api.model.repository.ProgressoUsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProgressoUsuarioRepository progressoUsuarioRepository;
    private final ConquistaRepository conquistaRepository;

    @Override
    public void run(String... args) {
        if (progressoUsuarioRepository.findById(1L).isEmpty()) {
            progressoUsuarioRepository.save(new ProgressoUsuario());
        }

        if (conquistaRepository.count() == 0) {
            conquistaRepository.saveAll(catalogo());
        }
    }

    private List<Conquista> catalogo() {
        return List.of(
                conquista("first-step", "First Step", "Concluiu o primeiro curso.", "footprints"),
                conquista("deep-work", "Deep Work", "Completou 10 sessões de Pomodoro.", "timer"),
                conquista("architect", "Architect", "Concluiu uma categoria inteira do roadmap.", "landmark"),
                conquista("night-owl", "Night Owl", "Estudou depois das 22:00.", "moon"),
                conquista("hundred-hours", "100 Hours", "Acumulou 100 horas de estudo.", "hourglass"),
                conquista("streak-30", "Unbroken", "Manteve uma sequência de 30 dias.", "flame"),
                conquista("polyglot", "Polyglot", "Progrediu em 3 categorias diferentes na mesma semana.", "languages"),
                conquista("full-stack", "Full Stack", "Concluiu tecnologias de Backend e Frontend.", "layers")
        );
    }

    private Conquista conquista(String id, String titulo, String descricao, String icone) {
        Conquista conquista = new Conquista();
        conquista.setId(id);
        conquista.setTitulo(titulo);
        conquista.setDescricao(descricao);
        conquista.setIcone(icone);
        return conquista;
    }
}
