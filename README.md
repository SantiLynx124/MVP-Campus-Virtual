# 🎓 Campus Virtual - Plataforma Educativa Colaborativa MVP

Prototipo de plataforma web educativa colaborativa orientada a universidades peruanas, con enfoque B2B (licencia institucional).

## 📋 Descripción

Este es un MVP (Minimum Viable Product) diseñado para demostrar el funcionamiento básico del sistema para presentación académica y validación del modelo de negocio. La plataforma permite a estudiantes y docentes colaborar compartiendo materiales educativos, interactuar mediante comentarios y likes, y acceder a clases en modo sincrónico y asincrónico.

## ✨ Funcionalidades Principales

- ✅ **Autenticación de usuarios** usando correo institucional (simulado)
- ✅ **Roles básicos**: Estudiante y Docente
- ✅ **Dashboard principal** con lista de cursos
- ✅ **Sistema colaborativo**:
  - Subir apuntes (solo estudiantes)
  - Dar "me gusta" a materiales
  - Comentarios en materiales
- ✅ **Modo sincrónico y asincrónico**:
  - Sincrónico: sección de clase en vivo (solo UI simulada)
  - Asincrónico: materiales y foros
- ✅ **Diseño moderno y responsive** con Tailwind CSS

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** + **Express** - Servidor REST API
- **JWT** - Autenticación con tokens
- **Multer** - Manejo de archivos
- **JSON** - Almacenamiento de datos (simulado)

### Frontend
- **React 18** - Biblioteca de UI
- **React Router** - Navegación
- **Tailwind CSS** - Estilos
- **Axios** - Cliente HTTP
- **Vite** - Build tool y dev server
- **React Icons** - Iconos

## 📁 Estructura del Proyecto

```
MVP/
├── backend/                 # Servidor Node.js + Express
│   ├── controllers/         # Lógica de negocio
│   ├── routes/              # Definición de rutas
│   ├── middleware/          # Middleware de autenticación
│   ├── utils/               # Utilidades (almacenamiento)
│   ├── data/                # Datos mock (se crean automáticamente)
│   ├── uploads/             # Archivos subidos (se crea automáticamente)
│   └── server.js            # Punto de entrada del servidor
│
├── frontend/                # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/          # Páginas principales
│   │   ├── context/         # Context API (Auth)
│   │   ├── services/        # Servicios API
│   │   └── App.jsx          # Componente raíz
│   └── package.json
│
└── README.md               # Este archivo
```

## 🚀 Instalación y Ejecución

### Prerrequisitos

- **Node.js** (versión 16 o superior)
- **npm** o **yarn**

### Paso 1: Instalar dependencias del backend

```bash
cd backend
npm install
```

### Paso 2: Instalar dependencias del frontend

```bash
cd ../frontend
npm install
```

### Paso 3: Ejecutar el backend

En una terminal, desde la carpeta `backend`:

```bash
npm start
```

O en modo desarrollo (con auto-reload):

```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:5000`

### Paso 4: Ejecutar el frontend

En otra terminal, desde la carpeta `frontend`:

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

## 👤 Usuarios de Prueba

El sistema viene con usuarios predefinidos para pruebas:

### Estudiante
- **Email**: `estudiante@uss.edu.pe`
- **Contraseña**: `123456`

### Docente
- **Email**: `docente@uss.edu.pe`
- **Contraseña**: `123456`

### Otro Estudiante
- **Email**: `ana@uss.edu.pe`
- **Contraseña**: `123456`

## 📚 Uso de la Plataforma

### Para Estudiantes

1. **Iniciar sesión** con un correo institucional (.edu.pe)
2. **Ver cursos** disponibles en el dashboard
3. **Acceder a un curso** para ver materiales compartidos
4. **Subir materiales** (apuntes, PDFs, enlaces)
5. **Dar likes** a materiales útiles
6. **Comentar** en materiales
7. **Acceder a clases en vivo** (modo sincrónico - simulado)

### Para Docentes

1. **Iniciar sesión** con un correo institucional
2. **Ver cursos** asignados
3. **Ver materiales** compartidos por estudiantes
4. **Interactuar** mediante likes y comentarios
5. **Acceder a clases en vivo** para dictar

## 🔐 Autenticación

- La autenticación usa **JWT (JSON Web Tokens)**
- Los tokens se almacenan en `localStorage`
- El token expira en 7 días
- Se valida que el correo termine en `.edu.pe` (simulado)

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/me` - Obtener usuario actual

### Cursos
- `GET /api/courses` - Listar todos los cursos
- `GET /api/courses/:id` - Obtener curso por ID

### Materiales
- `GET /api/materials/course/:courseId` - Materiales de un curso
- `POST /api/materials/upload` - Subir material (solo estudiantes)
- `POST /api/materials/:materialId/like` - Dar like
- `DELETE /api/materials/:materialId/like` - Quitar like

### Comentarios
- `GET /api/comments/material/:materialId` - Comentarios de un material
- `POST /api/comments` - Crear comentario

## 🗄️ Almacenamiento de Datos

El proyecto usa archivos JSON para simular una base de datos:

- `backend/data/users.json` - Usuarios registrados
- `backend/data/courses.json` - Cursos disponibles
- `backend/data/materials.json` - Materiales compartidos
- `backend/data/comments.json` - Comentarios

Estos archivos se crean automáticamente al iniciar el servidor con datos iniciales.

## 🎨 Características de Diseño

- **Diseño responsive** - Funciona en móviles, tablets y desktop
- **Interfaz moderna** - Usa Tailwind CSS con paleta de colores personalizada
- **Animaciones suaves** - Transiciones y efectos hover
- **Iconos** - React Icons para una mejor UX
- **Feedback visual** - Loading states, mensajes de error/success

## ⚠️ Limitaciones del MVP

Este es un prototipo académico, por lo tanto:

- ❌ No usa base de datos real (solo JSON)
- ❌ Las contraseñas NO están hasheadas (solo para demo)
- ❌ La autenticación de correo institucional es simulada
- ❌ Las clases en vivo son solo UI (no hay WebRTC real)
- ❌ No hay validación avanzada de archivos
- ❌ No hay sistema de notificaciones
- ❌ No hay búsqueda avanzada

## 🔮 Próximos Pasos (Para Producción)

- [ ] Integrar base de datos real (PostgreSQL/MongoDB)
- [ ] Implementar hash de contraseñas con bcrypt
- [ ] Integrar servicio de video en vivo (WebRTC/Zoom/Meet)
- [ ] Agregar sistema de notificaciones
- [ ] Implementar búsqueda avanzada
- [ ] Agregar tests unitarios e integración
- [ ] Implementar paginación
- [ ] Agregar sistema de permisos más granular
- [ ] Implementar recuperación de contraseña
- [ ] Agregar analytics y métricas

## 📝 Notas Importantes

- Este proyecto es solo para **fines académicos y de demostración**
- No usar en producción sin las mejoras de seguridad necesarias
- Los datos se almacenan localmente y se pierden al reiniciar (en el MVP)
- El servidor debe estar corriendo antes de usar el frontend

## 👨‍💻 Desarrollo

### Estructura de Código

El código está organizado siguiendo buenas prácticas:

- **Separación de responsabilidades** - Controllers, Routes, Services
- **Componentes reutilizables** - React components modulares
- **Comentarios explicativos** - Código documentado
- **Nombres descriptivos** - Variables y funciones claras

### Modificar Datos Mock

Los datos iniciales se pueden modificar en:
- `backend/utils/userStorage.js` - Usuarios iniciales
- `backend/utils/dataStorage.js` - Cursos y materiales iniciales

## 📄 Licencia

Este proyecto es un MVP académico. Libre para uso educativo.

## 🤝 Contribuciones

Este es un proyecto de demostración. Para mejoras o sugerencias, puedes crear issues o pull requests.

---

**Desarrollado como MVP para validación de modelo de negocio Campus Virtual B2B**

