# 📚 E-Learning Platform - Frontend

![React](https://img.shields.io/badge/React-18.x-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8)
![Axios](https://img.shields.io/badge/Axios-1.x-purple)
![License](https://img.shields.io/badge/License-Academic-yellow)

Plataforma de aprendizaje en línea desarrollada con React que permite a estudiantes, docentes y administradores gestionar cursos, evaluaciones y foros de discusión de manera intuitiva y moderna.

## 🎯 Descripción del Proyecto

Este es el frontend de una plataforma e-learning completa que conecta con un backend REST API. La aplicación ofrece una experiencia de usuario fluida y responsive para:

- **🎓 Estudiantes**: Inscribirse en cursos, realizar evaluaciones, participar en foros y descargar certificados
- **👨‍🏫 Docentes**: Crear y gestionar cursos, subir materiales, crear evaluaciones, ver resultados de estudiantes y moderar foros
- **👨‍💼 Administradores**: Gestionar usuarios, monitorear la plataforma y moderar contenido

## ✨ Características Principales

### Para Estudiantes
- ✅ Catálogo de cursos con búsqueda y filtros
- ✅ Inscripción rápida en cursos
- ✅ Visualización de materiales multimedia (videos, PDFs, enlaces)
- ✅ Sistema de evaluaciones con timer
- ✅ Seguimiento de progreso en tiempo real
- ✅ Foros de discusión interactivos
- ✅ Descarga de certificados automáticos

### Para Docentes
- ✅ Creador de cursos con módulos organizados
- ✅ Subida de materiales multimedia
- ✅ Creador de evaluaciones con preguntas de opción múltiple
- ✅ **Panel de resultados de estudiantes** (NUEVO)
- ✅ Moderación de foros
- ✅ Reportes y estadísticas

### Para Administradores
- ✅ Gestión completa de usuarios
- ✅ Dashboard con estadísticas del sistema
- ✅ Moderación global de contenido

## 🚀 Tecnologías Utilizadas

### Core
- **React 18** - Biblioteca principal para UI
- **React Router DOM v6** - Navegación SPA
- **Axios** - Cliente HTTP para API REST
- **Context API** - Manejo de estado global

### Estilos
- **Tailwind CSS 3** - Framework de utilidades CSS
- **PostCSS** - Procesamiento de CSS
- **CSS Modules** - Estilos modulares

### Herramientas de Desarrollo
- **Vite** - Build tool ultra-rápido
- **ESLint** - Linter de JavaScript
- **Prettier** - Formateador de código

## 📁 Estructura del Proyecto

```
elearning-frontend/
├── public/
│   ├── index.html              # HTML principal
│   ├── favicon.ico             # Icono del sitio
│   └── manifest.json           # PWA manifest
│
├── src/
│   ├── api/                    # Configuración de API
│   │   ├── client.js           # Cliente Axios con interceptores
│   │   ├── endpoints.js        # Definición centralizada de endpoints
│   │   └── services/           # Servicios por módulo
│   │       ├── authService.js
│   │       ├── courseService.js
│   │       ├── materialService.js
│   │       ├── evaluationService.js
│   │       ├── forumService.js
│   │       └── progressService.js
│   │
│   ├── components/             # Componentes reutilizables
│   │   ├── MainLayout.jsx      # Layout principal con navbar
│   │   ├── Navbar.jsx          # Barra de navegación
│   │   ├── ProtectedRoute.jsx  # HOC para rutas protegidas
│   │   └── ...
│   │
│   ├── context/                # Context API
│   │   └── AuthContext.jsx     # Contexto de autenticación global
│   │
│   ├── pages/                  # Páginas de la aplicación
│   │   ├── LoginPage.jsx       # Inicio de sesión
│   │   ├── RegisterPage.jsx    # Registro de usuarios
│   │   ├── Dashboard.jsx       # Panel principal
│   │   ├── CourseList.jsx      # Catálogo de cursos
│   │   ├── CourseDetail.jsx    # Detalle de curso con tabs
│   │   ├── EvaluationTaker.jsx # Realizar evaluación
│   │   ├── ForumDetail.jsx     # Foro con mensajes
│   │   ├── ProgressPage.jsx    # Progreso del estudiante
│   │   ├── CertificatesPage.jsx # Certificados obtenidos
│   │   ├── CommunityPage.jsx   # Lista de foros
│   │   ├── ProfilePage.jsx     # Perfil de usuario
│   │   │
│   │   ├── teacher/            # Páginas de docente
│   │   │   ├── TeacherDashboard.jsx
│   │   │   ├── CourseEditor.jsx
│   │   │   ├── EvaluationCreator.jsx
│   │   │   ├── EvaluationResults.jsx  # Panel de resultados (NUEVO)
│   │   │   └── GradingPanel.jsx
│   │   │
│   │   └── admin/              # Páginas de administrador
│   │       ├── AdminDashboard.jsx
│   │       └── UserManagement.jsx
│   │
│   ├── App.js                  # Configuración de rutas
│   ├── App.css                 # Estilos globales
│   ├── index.js                # Punto de entrada
│   └── index.css               # Estilos base + Tailwind
│
├── .gitignore                  # Archivos ignorados por Git
├── package.json                # Dependencias y scripts
├── tailwind.config.js          # Configuración de Tailwind
├── postcss.config.js           # Configuración de PostCSS
└── README.md                   # Este archivo
```

## 🔧 Instalación y Configuración

### Prerrequisitos

- **Node.js** (v14 o superior) - [Descargar](https://nodejs.org/)
- **npm** o **yarn** - Incluido con Node.js
- **Backend corriendo** en `http://localhost:8080` - [Ver repositorio backend](https://github.com/TU_USUARIO/backend-elearning-main)

### Pasos de Instalación

#### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/elearning-frontend.git
cd elearning-frontend
```

#### 2. Instalar dependencias

```bash
npm install
```

#### 3. Configurar la URL del backend

Editar `src/api/client.js` y verificar que la `baseURL` apunte al backend:

```javascript
const client = axios.create({
  baseURL: 'http://localhost:8080/api'
});
```

#### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

✅ Si ves la página de login, ¡todo está funcionando!

### 5. Credenciales de Prueba

Después de configurar el backend, puedes usar estas credenciales:

**Administrador:**
- Email: `admin@test.com`
- Contraseña: `admin123`

**Docente:**
- Email: `docente@gmail.com`
- Contraseña: `docente123`

**Estudiante:**
- Email: `yefa1203jaimes@gmail.com`
- Contraseña: `123456`

## 🎨 Diseño y UX

### Paleta de Colores

- **Primary**: Teal (#14b8a6) - Botones principales, enlaces
- **Success**: Green (#22c55e) - Mensajes de éxito, aprobados
- **Error**: Red (#ef4444) - Errores, reprobados
- **Warning**: Yellow (#eab308) - Advertencias
- **Gray**: Escala de grises para textos y fondos

### Componentes UI

- **Cards**: Tarjetas con sombra para contenido
- **Buttons**: Botones con hover effects y estados disabled
- **Forms**: Inputs con validación visual
- **Modals**: Diálogos para confirmaciones
- **Badges**: Etiquetas de estado (aprobado/reprobado)
- **Progress Bars**: Barras de progreso animadas

## 👥 Roles y Funcionalidades Detalladas

### 🎓 Estudiante

#### Dashboard
- Vista general de cursos inscritos
- Progreso por curso
- Próximas evaluaciones

#### Cursos
- **Catálogo**: Ver todos los cursos disponibles
- **Inscripción**: Inscribirse con un clic
- **Contenido**: Acceder a módulos y materiales
- **Descarga**: Descargar PDFs y otros archivos
- **Progreso**: Marcar materiales como completados

#### Evaluaciones
- **Realizar**: Responder evaluaciones con timer
- **Resultados**: Ver calificación y respuestas correctas
- **Historial**: Ver evaluaciones completadas

#### Foros
- **Participar**: Publicar mensajes en foros
- **Discutir**: Ver y responder mensajes de otros
- **Notificaciones**: Ver nuevos mensajes

#### Certificados
- **Descargar**: Obtener PDF al completar 100% del curso
- **Compartir**: Código de verificación único

### 👨‍🏫 Docente

#### Gestión de Cursos
- **Crear**: Formulario completo para nuevos cursos
- **Editar**: Modificar información de cursos existentes
- **Módulos**: Organizar contenido en módulos
- **Materiales**: Subir videos, PDFs, enlaces

#### Evaluaciones
- **Crear**: Formulario para crear evaluaciones
- **Preguntas**: Agregar preguntas de opción múltiple
- **Configurar**: Establecer duración y fechas límite
- **Resultados**: **Ver quién respondió y sus calificaciones** (NUEVO)

#### Panel de Resultados (NUEVO)
- **Estadísticas**: Total de estudiantes, aprobados, promedio
- **Tabla**: Lista de estudiantes con calificaciones
- **Detalles**: Respuestas correctas/incorrectas por estudiante
- **Exportar**: Descargar resultados (próximamente)

#### Foros
- **Crear**: Crear foros de discusión
- **Moderar**: Eliminar mensajes inapropiados
- **Participar**: Responder preguntas de estudiantes

### 👨‍💼 Administrador

#### Gestión de Usuarios
- **Listar**: Ver todos los usuarios del sistema
- **Editar**: Modificar información de usuarios
- **Roles**: Cambiar roles (estudiante/docente/admin)
- **Desactivar**: Desactivar cuentas

#### Dashboard
- **Estadísticas**: Total de usuarios, cursos, evaluaciones
- **Gráficos**: Visualización de datos
- **Actividad**: Últimas acciones en el sistema

#### Moderación
- **Contenido**: Eliminar contenido inapropiado
- **Reportes**: Ver contenido reportado

## 🔐 Autenticación y Seguridad

### Sistema JWT

1. **Login**: Usuario envía credenciales
2. **Token**: Backend devuelve JWT
3. **Almacenamiento**: Token guardado en `localStorage`
4. **Interceptor**: Axios agrega token automáticamente a cada petición
5. **Expiración**: Redirección automática al login si el token expira

### Rutas Protegidas

```javascript
// Rutas públicas
/login
/register

// Rutas autenticadas
/dashboard          // Todos los usuarios
/courses            // Todos los usuarios
/my-progress        // Estudiantes
/certificates       // Estudiantes

// Rutas de docente
/teacher/dashboard
/teacher/courses/new
/teacher/evaluations/create/:courseId

// Rutas de admin
/admin/dashboard
/admin/users
```

## 📡 Integración con Backend

### Cliente Axios Configurado

```javascript
// src/api/client.js
import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// Interceptor para agregar token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Servicios Disponibles

- **authService**: Login, registro, perfil
- **courseService**: CRUD de cursos, inscripción, módulos
- **materialService**: Subida y descarga de archivos
- **evaluationService**: CRUD de evaluaciones, envío de respuestas, resultados
- **forumService**: CRUD de foros y mensajes
- **progressService**: Seguimiento de progreso

## 🐛 Solución de Problemas Comunes

### Error: "Cannot read property 'map' of undefined"
**Causa**: Datos no cargados aún  
**Solución**: Agregar verificación:
```javascript
{data?.items?.map(...) || [].map(...)}
```

### Error 403 Forbidden
**Causa**: Usuario no inscrito en el curso  
**Solución**: Inscribirse en el curso primero

### Error: "Network Error"
**Causa**: Backend no está corriendo  
**Solución**: Verificar que el backend esté en `http://localhost:8080`

### Página en blanco
**Causa**: Error de JavaScript no capturado  
**Solución**: Abrir DevTools (F12) y revisar la consola

### Estilos no se aplican
**Causa**: Tailwind no compilado  
**Solución**: 
```bash
npm run build:css
npm run dev
```

## 📦 Scripts Disponibles

```bash
# Desarrollo (con recarga automática)
npm run dev
# o
npm start

# Producción
npm run build          # Genera build optimizado

# Preview del build
npm run preview        # Ver build antes de desplegar

# Linting
npm run lint           # Verificar código
npm run lint:fix       # Corregir errores automáticamente
```

## 🚀 Despliegue

### Build de Producción

```bash
npm run build
```

Esto genera una carpeta `build/` con los archivos optimizados.

### Opciones de Despliegue

- **Vercel**: `vercel --prod`
- **Netlify**: Conectar repositorio y configurar build command
- **GitHub Pages**: Usar `gh-pages` package
- **Servidor propio**: Servir carpeta `build/` con nginx o similar

### Variables de Entorno para Producción

Crear archivo `.env.production`:

```env
REACT_APP_API_URL=https://tu-backend.com/api
```

## 🔄 Flujo de Trabajo Git

```bash
# Clonar repositorio
git clone https://github.com/TU_USUARIO/elearning-frontend.git

# Crear rama para nueva funcionalidad
git checkout -b feature/nueva-funcionalidad

# Hacer commits descriptivos
git add .
git commit -m "✨ Agregar funcionalidad X"

# Subir cambios
git push origin feature/nueva-funcionalidad

# Crear Pull Request en GitHub
```

## 🌐 Repositorio Backend

Este frontend requiere el backend para funcionar:

- **Repositorio**: [backend-elearning-main](https://github.com/TU_USUARIO/backend-elearning-main)
- **Puerto**: `http://localhost:8080`
- **Documentación**: Ver README del backend

## 📄 Licencia

Este proyecto es parte de un trabajo académico para la materia de **Tecnología Web - 7° Semestre**.

## 👨‍💻 Autores

- **Equipo de Desarrollo** - Proyecto E-Learning
- **Universidad**: [Tu Universidad]
- **Semestre**: 7° Semestre - 2025

## 🤝 Contribución

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para preguntas, problemas o sugerencias:
- Crear un [Issue en GitHub](https://github.com/TU_USUARIO/elearning-frontend/issues)
- Contactar al equipo de desarrollo

## 🎯 Roadmap

- [x] Sistema de autenticación
- [x] Catálogo de cursos
- [x] Sistema de evaluaciones
- [x] Panel de resultados para docentes
- [x] Foros de discusión
- [x] Seguimiento de progreso
- [x] Descarga de certificados
- [ ] Notificaciones en tiempo real
- [ ] Chat privado entre usuarios
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)
- [ ] Aplicación móvil

---

**Última actualización**: Noviembre 2025  
**Versión**: 1.0.0  
**Estado**: ✅ Producción

