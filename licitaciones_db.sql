-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-10-2022 a las 00:21:33
-- Versión del servidor: 10.4.17-MariaDB
-- Versión de PHP: 8.0.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `licitaciones_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `docs_licitaciones`
--

CREATE TABLE `docs_licitaciones` (
  `idDocLi` int(11) NOT NULL AUTO_INCREMENT=1,
  `idUsuario` int(11) DEFAULT NULL,
  `idLicitacion` int(11) DEFAULT NULL,
  `nombreDoc` varchar(300) DEFAULT NULL,
  `documento` varchar(200) DEFAULT NULL,
  `publicado` int(11) NOT NULL DEFAULT 0,
  `fechaCreacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `docs_licitaciones`
--

INSERT INTO `docs_licitaciones` (`idDocLi`, `idUsuario`, `idLicitacion`, `nombreDoc`, `documento`, `publicado`, `fechaCreacion`) VALUES
(1, 1, 1, 'Documento 1', '1_1_1659394957_error.jpg', 1, '2022-08-01 18:02:37'),
(2, 1, 1, 'Documento 2', '1_1_1659396382_gdl_corona.png', 1, '2022-08-01 18:26:22'),
(3, 1, 2, 'Documento 1 licitacion 2', '1_2_1659455693_aurora_evidencia.png', 1, '2022-08-02 10:54:53'),
(4, 1, 3, 'Documento 1 de licitacion 4', '1_3_1664557891_evidenciaFeria_virtual.png', 1, '2022-09-30 12:11:31'),
(5, 1, 1, 'Sintesis informativa', '1_1_1664576176_rafael.png', 1, '2022-09-30 17:16:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `licitaciones`
--

CREATE TABLE `licitaciones` (
  `idLicitacion` int(11) NOT NULL,
  `idUnAd` int(11) DEFAULT NULL,
  `idUsuario` int(11) DEFAULT NULL,
  `licitacion` text DEFAULT NULL,
  `activo` int(11) NOT NULL DEFAULT 0,
  `fechaCreacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `licitaciones`
--

INSERT INTO `licitaciones` (`idLicitacion`, `idUnAd`, `idUsuario`, `licitacion`, `activo`, `fechaCreacion`) VALUES
(1, 1, 1, 'prb Licitacion', 1, '2022-08-01 12:48:20'),
(2, 1, 1, 'prb Licitacion 2', 1, '2022-08-02 10:54:29'),
(3, 1, 1, 'prb Licitacion 4', 1, '2022-09-30 12:10:25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `idRol` int(11) NOT NULL,
  `rol` varchar(70) DEFAULT NULL,
  `activo` int(11) NOT NULL DEFAULT 0,
  `fechaCreacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`idRol`, `rol`, `activo`, `fechaCreacion`) VALUES
(1, 'Administrador', 1, '2022-07-29 17:33:13'),
(2, 'Responsable Unidad Amdinistrativa', 1, '2022-07-29 17:33:13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unidad_admin`
--

CREATE TABLE `unidad_admin` (
  `idUniAd` int(11) NOT NULL,
  `unidadAdmin` varchar(500) DEFAULT NULL,
  `activo` int(11) NOT NULL DEFAULT 0,
  `fechaCreacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `unidad_admin`
--

INSERT INTO `unidad_admin` (`idUniAd`, `unidadAdmin`, `activo`, `fechaCreacion`) VALUES
(1, 'SCT - UTIC - CDMX insurgentes sur', 1, '2022-07-29 17:34:12');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `idUsuario` int(11) NOT NULL,
  `idRol` int(11) DEFAULT NULL,
  `idUnAd` int(11) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apPaterno` varchar(100) DEFAULT NULL,
  `apMaterno` varchar(100) DEFAULT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `password` varchar(150) DEFAULT NULL,
  `activo` int(11) NOT NULL DEFAULT 0,
  `fechaCreacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`idUsuario`, `idRol`, `idUnAd`, `nombre`, `apPaterno`, `apMaterno`, `correo`, `password`, `activo`, `fechaCreacion`) VALUES
(1, 1, 1, 'Iracema', 'Miron', 'Ramirez', 'iracema.miron@sct.gob.mx', '12345', 1, '2022-07-29 17:35:18');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `docs_licitaciones`
--
ALTER TABLE `docs_licitaciones`
  ADD PRIMARY KEY (`idDocLi`);

--
-- Indices de la tabla `licitaciones`
--
ALTER TABLE `licitaciones`
  ADD PRIMARY KEY (`idLicitacion`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`idRol`);

--
-- Indices de la tabla `unidad_admin`
--
ALTER TABLE `unidad_admin`
  ADD PRIMARY KEY (`idUniAd`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`idUsuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `docs_licitaciones`
--
ALTER TABLE `docs_licitaciones`
  MODIFY `idDocLi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `licitaciones`
--
ALTER TABLE `licitaciones`
  MODIFY `idLicitacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `idRol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `unidad_admin`
--
ALTER TABLE `unidad_admin`
  MODIFY `idUniAd` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `idUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
