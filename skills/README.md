# Skills de StreetBoss

> Skills específicos y reutilizables del proyecto StreetBoss.

## Estructura de Carpetas

| Carpeta | Descripción |
|---|---|
| `globales/` | Skills reutilizables que pueden aplicarse al proyecto sin contener reglas exclusivas de StreetBoss. |
| `proyecto/` | Skills específicos de StreetBoss. |

## Estructura de un Skill

Cada skill debe usar su propia carpeta con esta estructura:

```
nombre-del-skill/
├── SKILL.md        → Instrucciones principales (obligatorio)
├── README.md       → Documentación del skill
├── examples/       → Ejemplos de uso
├── scripts/        → Scripts auxiliares
└── tests/          → Pruebas
```

## Reglas

1. `SKILL.md` es obligatorio en cada skill.
2. Los skills deben ser autocontenidos y documentados.
3. No crear skills vacíos o placeholder.
4. Los skills globales también pueden ubicarse en `~/Proyectos/07_SKILLS/`.

---

> 📌 Esta carpeta está vacía inicialmente. Los skills se crearán conforme se necesiten.
