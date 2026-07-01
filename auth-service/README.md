# 🔐 SkillSync AI - Auth Service

## 📖 Descripción

Auth Service es el microservicio encargado de la autenticación y autorización de usuarios dentro de la plataforma SkillSync AI.

Actualmente proporciona funcionalidades de registro, inicio de sesión y administración básica de usuarios. En futuras versiones incorporará JWT, Refresh Tokens, recuperación de contraseña, OAuth2 y control de permisos basado en roles.

---

## 🎯 Responsabilidades

- Registro de usuarios
- Inicio de sesión
- Gestión de usuarios
- Control de roles
- Emisión de tokens (fase futura)
- Seguridad y autenticación

---

## 🏗 Arquitectura

```txt
auth-service/

app/
│
├── main.py
│
├── routers/
│   └── auth.py
│
├── schemas/
│   └── auth.py
│
├── services/
│   └── auth_service.py
│
├── data/
│   └── users_store.py
│
└── core/
    └── config.py
```

---

## 🚀 Tecnologías

- Python 3.13
- FastAPI
- Uvicorn
- Pydantic
- REST API

---

## ⚙️ Instalación

### Crear entorno virtual

```bash
python -m venv venv
```

### Activar entorno virtual

#### Windows

```bash
venv\Scripts\activate
```

#### Linux / Mac

```bash
source venv/bin/activate
```

### Instalar dependencias

```bash
pip install -r requirements.txt
```

---

## ▶️ Ejecución

```bash
uvicorn app.main:app --reload --port 8001
```

---

## 📚 Swagger

```txt
http://127.0.0.1:8001/docs
```

---

## 🔌 Endpoints

### Verificar servicio

```http
GET /api/auth/
```

Respuesta:

```json
{
  "message": "Auth API funcionando"
}
```

---

### Registrar usuario

```http
POST /api/auth/register
```

Body:

```json
{
  "name": "Massimo",
  "email": "massimo@email.com",
  "password": "123456"
}
```

Respuesta:

```json
{
  "message": "Usuario creado correctamente"
}
```

---

### Iniciar sesión

```http
POST /api/auth/login
```

Body:

```json
{
  "email": "admin@skillsync.ai",
  "password": "123456"
}
```

Respuesta:

```json
{
  "token": "uuid-token",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@skillsync.ai",
    "role": "admin"
  }
}
```

---

### Obtener usuarios

```http
GET /api/auth/users
```

Respuesta:

```json
[
  {
    "id": 1,
    "name": "Admin",
    "email": "admin@skillsync.ai",
    "role": "admin"
  }
]
```

---

## ❤️ Health Check

```http
GET /api/health
```

Respuesta:

```json
{
  "status": "OK",
  "service": "auth-service"
}
```

---

## 🗺 Roadmap

### MVP Actual

- Registro
- Login
- Gestión de usuarios
- Swagger
- Health Check

### Próximas versiones

- PostgreSQL
- JWT Authentication
- Refresh Tokens
- Roles y permisos
- Recuperación de contraseña
- OAuth2
- Login con Google
- Login con GitHub

---

## 📌 Estado

| Item | Estado |
|--------|--------|
| Arquitectura | ✅ |
| FastAPI | ✅ |
| Swagger | ✅ |
| Login | ✅ |
| Register | ✅ |
| Health Check | ✅ |
| PostgreSQL | 🔜 |
| JWT | 🔜 |
| Docker | 🔜 |

---

## 📦 Versión

```txt
Version: 1.0.0
Estado: MVP Funcional
```

Microservicio listo para integración con PostgreSQL, JWT y Docker.