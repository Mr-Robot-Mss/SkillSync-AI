# SkillSync AI - Notification Service

Microservicio encargado de administrar notificaciones del usuario.

## Responsabilidades

- Listar notificaciones
- Crear notificaciones
- Marcar como leídas
- Eliminar notificaciones
- Health check

## Ejecutar

```bash
uvicorn app.main:app --reload --port 8006