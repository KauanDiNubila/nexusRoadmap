package com.nexusroadmap.api.model.DTO;

import com.nexusroadmap.api.model.entity.ProgressoUsuario;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ProgressoUsuarioDTO {

    private int level;
    private int xp;
    private int xpToNext;
    private int streakDays;
    private int totalStudiedMinutes;
    private int totalSessions;

    public static ProgressoUsuarioDTO de(ProgressoUsuario usuario) {
        return new ProgressoUsuarioDTO(
                usuario.getLevel(),
                usuario.getXp(),
                usuario.getXpToNext(),
                usuario.getStreakDays(),
                usuario.getTotalStudiedMinutes(),
                usuario.getTotalSessions()
        );
    }
}
