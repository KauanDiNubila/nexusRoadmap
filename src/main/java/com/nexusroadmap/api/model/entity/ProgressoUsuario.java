package com.nexusroadmap.api.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class ProgressoUsuario {

    @Id
    private Long id = 1L;

    private int level = 1;
    private int xp = 0;
    private int xpToNext = 100;
    private int streakDays = 0;
    private int totalStudiedMinutes = 0;
    private int totalSessions = 0;
}
