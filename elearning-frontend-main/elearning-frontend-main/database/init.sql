-- =====================================================
-- Script de Inicialización - Base de Datos E-Learning
-- =====================================================
-- INSTRUCCIONES:
-- 1. Abre MySQL Workbench o terminal MySQL
-- 2. Ejecuta este script completo
-- 3. Login: admin@elearning.com / 123456
-- =====================================================

CREATE DATABASE IF NOT EXISTS elearning_db;
USE elearning_db;

-- Usuarios
CREATE TABLE Usuarios (
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('estudiante', 'docente', 'admin') DEFAULT 'estudiante',
    avatar VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Cursos
CREATE TABLE Cursos (
    idCurso INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    idDocente INT NOT NULL,
    imagen VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idDocente) REFERENCES Usuarios(idUsuario) ON DELETE CASCADE
);

-- Inscripciones
CREATE TABLE Inscripciones (
    idInscripcion INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NOT NULL,
    idCurso INT NOT NULL,
    fechaInscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progreso DECIMAL(5,2) DEFAULT 0.00,
    completado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario) ON DELETE CASCADE,
    FOREIGN KEY (idCurso) REFERENCES Cursos(idCurso) ON DELETE CASCADE,
    UNIQUE KEY (idUsuario, idCurso)
);

-- Materiales
CREATE TABLE Materiales (
    idMaterial INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    tipo ENUM('video', 'documento', 'imagen', 'otro') NOT NULL,
    url VARCHAR(500) NOT NULL,
    idCurso INT NOT NULL,
    orden INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idCurso) REFERENCES Cursos(idCurso) ON DELETE CASCADE
);

-- Evaluaciones
CREATE TABLE Evaluaciones (
    idEvaluacion INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    idCurso INT NOT NULL,
    duracion INT,
    fechaLimite DATETIME,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idCurso) REFERENCES Cursos(idCurso) ON DELETE CASCADE
);

-- Preguntas
CREATE TABLE Preguntas (
    idPregunta INT AUTO_INCREMENT PRIMARY KEY,
    pregunta TEXT NOT NULL,
    idEvaluacion INT NOT NULL,
    tipo ENUM('multiple', 'abierta') DEFAULT 'multiple',
    orden INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idEvaluacion) REFERENCES Evaluaciones(idEvaluacion) ON DELETE CASCADE
);

-- Opciones
CREATE TABLE Opciones (
    idOpcion INT AUTO_INCREMENT PRIMARY KEY,
    texto VARCHAR(500) NOT NULL,
    idPregunta INT NOT NULL,
    esCorrecta BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idPregunta) REFERENCES Preguntas(idPregunta) ON DELETE CASCADE
);

-- RespuestasEstudiantes
CREATE TABLE RespuestasEstudiantes (
    idRespuesta INT AUTO_INCREMENT PRIMARY KEY,
    idPregunta INT NOT NULL,
    idUsuario INT NOT NULL,
    idOpcionSeleccionada INT,
    respuestaTexto TEXT,
    correcta BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idPregunta) REFERENCES Preguntas(idPregunta) ON DELETE CASCADE,
    FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario) ON DELETE CASCADE,
    FOREIGN KEY (idOpcionSeleccionada) REFERENCES Opciones(idOpcion) ON DELETE SET NULL
);

-- ResultadosEvaluaciones
CREATE TABLE ResultadosEvaluaciones (
    idResultado INT AUTO_INCREMENT PRIMARY KEY,
    idEvaluacion INT NOT NULL,
    idUsuario INT NOT NULL,
    calificacion DECIMAL(5,2) NOT NULL,
    correctas INT DEFAULT 0,
    total INT DEFAULT 0,
    fechaRealizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idEvaluacion) REFERENCES Evaluaciones(idEvaluacion) ON DELETE CASCADE,
    FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario) ON DELETE CASCADE,
    UNIQUE KEY (idEvaluacion, idUsuario)
);

-- Foros
CREATE TABLE Foros (
    idForo INT AUTO_INCREMENT PRIMARY KEY,
    tema VARCHAR(200) NOT NULL,
    descripcion TEXT,
    idCurso INT NOT NULL,
    idCreador INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idCurso) REFERENCES Cursos(idCurso) ON DELETE CASCADE,
    FOREIGN KEY (idCreador) REFERENCES Usuarios(idUsuario) ON DELETE CASCADE
);

-- MensajesForo
CREATE TABLE MensajesForo (
    idMensaje INT AUTO_INCREMENT PRIMARY KEY,
    contenido TEXT NOT NULL,
    idForo INT NOT NULL,
    idUsuario INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idForo) REFERENCES Foros(idForo) ON DELETE CASCADE,
    FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario) ON DELETE CASCADE
);

-- ProgresoMateriales
CREATE TABLE ProgresoMateriales (
    idProgreso INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NOT NULL,
    idMaterial INT NOT NULL,
    visto BOOLEAN DEFAULT FALSE,
    fechaVisto TIMESTAMP NULL,
    FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario) ON DELETE CASCADE,
    FOREIGN KEY (idMaterial) REFERENCES Materiales(idMaterial) ON DELETE CASCADE,
    UNIQUE KEY (idUsuario, idMaterial)
);

-- Certificados
CREATE TABLE Certificados (
    idCertificado INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NOT NULL,
    idCurso INT NOT NULL,
    fechaEmision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    codigoVerificacion VARCHAR(100) UNIQUE,
    FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario) ON DELETE CASCADE,
    FOREIGN KEY (idCurso) REFERENCES Cursos(idCurso) ON DELETE CASCADE,
    UNIQUE KEY (idUsuario, idCurso)
);

-- Usuario Admin (CAMBIAR CONTRASEÑA DESPUÉS DEL PRIMER LOGIN)
INSERT INTO Usuarios (nombre, email, password, rol) VALUES
('Administrador', 'admin@elearning.com', '$2a$12$guuBTPs.68usPu9h8vwGkuuOhRdRbsHPun1/1GMZwBqwNFChKoOsy', 'admin');


SELECT 'Base de datos creada exitosamente' AS Status;