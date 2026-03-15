-- -----------------------------------------------------
-- Schema inmorural
-- -----------------------------------------------------
DROP DATABASE inmorural;

CREATE SCHEMA `inmorural` DEFAULT CHARACTER SET utf8;
USE `inmorural`;

-- -----------------------------------------------------
-- Table `inmorural`.`admin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inmorural`.`admin` (
  `idadmin` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(65) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idadmin`),
  INDEX `idx_admin_email` (`email` ASC)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `inmorural`.`imagenes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inmorural`.`imagenes` (
  `idimagenes` INT NOT NULL AUTO_INCREMENT,
  `url` VARCHAR(255) NOT NULL,
  `nombre` VARCHAR(45) NULL DEFAULT NULL,
  `orden` INT NOT NULL,
  PRIMARY KEY (`idimagenes`),
  INDEX `idx_imagenes_orden` (`orden` ASC)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `inmorural`.`tipo_campos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inmorural`.`tipo_campos` (
  `idtipocampos` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idtipocampos`),
  UNIQUE INDEX `idx_tipo_campos_nombre` (`nombre` ASC)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `inmorural`.`consultas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inmorural`.`consultas` (
  `idconsultas` INT NOT NULL AUTO_INCREMENT,
  `nombrecompleto` VARCHAR(45) NOT NULL,
  `telefono` VARCHAR(45) NULL DEFAULT NULL,
  `email` VARCHAR(45) NULL DEFAULT NULL,
  `fecha` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mensaje` TEXT(500) NOT NULL,
  PRIMARY KEY (`idconsultas`),
  INDEX `idx_consultas_fecha` (`fecha` ASC),
  INDEX `idx_consultas_email` (`email` ASC)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `inmorural`.`estadisticas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inmorural`.`estadisticas` (
  `idestadisticas` INT NOT NULL AUTO_INCREMENT,
  `vistas` INT NULL,
  `consultas` INT NULL,
  PRIMARY KEY (`idestadisticas`),
  INDEX `idx_estadisticas_vistas` (`vistas` ASC),
  INDEX `idx_estadisticas_consultas` (`consultas` ASC)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `inmorural`.`propiedades`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inmorural`.`propiedades` (
  `idpropiedades` INT NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(45) NOT NULL,
  `titulo` VARCHAR(85) NULL DEFAULT NULL,
  `alquilerventa` VARCHAR(45) NOT NULL,
  `superficie` VARCHAR(45) NOT NULL,
  `zona` VARCHAR(255) NOT NULL,
  `precio` DECIMAL(10,2) NOT NULL,
  `moneda` VARCHAR(55) NOT NULL,
  `descripcion` VARCHAR(255) NOT NULL,
  `longitud` DECIMAL(10,6) NOT NULL,
  `latitud` DECIMAL(10,6) NOT NULL,
  `ciudad` VARCHAR(65) NOT NULL,
  `provincia` VARCHAR(65) NOT NULL,
  `estado` VARCHAR(45) NULL DEFAULT NULL,
  `fecha` DATETIME NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` DATETIME NULL DEFAULT NULL,
  `campos_idtipocampos` INT NOT NULL,
  `estadisticas_idestadisticas` INT NOT NULL,
  PRIMARY KEY (`idpropiedades`, `campos_idtipocampos`, `estadisticas_idestadisticas`),
  
  -- Índices para búsquedas frecuentes
  UNIQUE INDEX `idx_propiedades_codigo` (`codigo` ASC),
  INDEX `idx_propiedades_titulo` (`titulo` ASC),
  INDEX `idx_propiedades_precio` (`precio` ASC),
  INDEX `idx_propiedades_ciudad` (`ciudad` ASC),
  INDEX `idx_propiedades_provincia` (`provincia` ASC),
  INDEX `idx_propiedades_estado` (`estado` ASC),
  INDEX `idx_propiedades_alquilerventa` (`alquilerventa` ASC),
  INDEX `idx_propiedades_fecha` (`fecha` ASC),
  INDEX `idx_propiedades_deletedAt` (`deletedAt` ASC),
  
  -- Índices compuestos para búsquedas combinadas
  INDEX `idx_propiedades_busqueda` (`provincia` ASC, `ciudad` ASC, `alquilerventa` ASC, `precio` ASC),
  INDEX `idx_propiedades_ubicacion` (`latitud` ASC, `longitud` ASC),
  
  -- Foreign key indexes
  INDEX `fk_propiedades_tipo_campos_idx` (`campos_idtipocampos` ASC),
  INDEX `fk_propiedades_estadisticas_idx` (`estadisticas_idestadisticas` ASC),

  CONSTRAINT `fk_propiedades_tipo_campos`
    FOREIGN KEY (`campos_idtipocampos`)
    REFERENCES `inmorural`.`tipo_campos` (`idtipocampos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_propiedades_estadisticas`
    FOREIGN KEY (`estadisticas_idestadisticas`)
    REFERENCES `inmorural`.`estadisticas` (`idestadisticas`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

ALTER TABLE `inmorural`.`propiedades` 
ADD COLUMN `destacado` TINYINT NOT NULL DEFAULT 0 AFTER `fecha`;

-- -----------------------------------------------------
-- Table `inmorural`.`propiedades_has_imagenes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inmorural`.`propiedades_has_imagenes` (
  `propiedades_idpropiedades` INT NOT NULL,
  `imagenes_idimagenes` INT NOT NULL,
  PRIMARY KEY (`propiedades_idpropiedades`, `imagenes_idimagenes`),
  INDEX `fk_prop_imagenes_imagenes_idx` (`imagenes_idimagenes` ASC),
  INDEX `fk_prop_imagenes_propiedades_idx` (`propiedades_idpropiedades` ASC),
  INDEX `idx_prop_imagenes_prop` (`propiedades_idpropiedades` ASC),
  INDEX `idx_prop_imagenes_img` (`imagenes_idimagenes` ASC),
  CONSTRAINT `fk_prop_imagenes_propiedades`
    FOREIGN KEY (`propiedades_idpropiedades`)
    REFERENCES `inmorural`.`propiedades` (`idpropiedades`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_prop_imagenes_imagenes`
    FOREIGN KEY (`imagenes_idimagenes`)
    REFERENCES `inmorural`.`imagenes` (`idimagenes`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `inmorural`.`propiedades_has_consultas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inmorural`.`propiedades_has_consultas` (
  `propiedades_idpropiedades` INT NOT NULL,
  `propiedades_campos_idtipocampos` INT NOT NULL,
  `consultas_idconsultas` INT NOT NULL,
  PRIMARY KEY (`propiedades_idpropiedades`, `propiedades_campos_idtipocampos`, `consultas_idconsultas`),
  INDEX `fk_prop_consultas_consultas_idx` (`consultas_idconsultas` ASC),
  INDEX `fk_prop_consultas_propiedades_idx` (`propiedades_idpropiedades` ASC, `propiedades_campos_idtipocampos` ASC),
  INDEX `idx_prop_consultas_consulta` (`consultas_idconsultas` ASC),
  CONSTRAINT `fk_prop_consultas_propiedades`
    FOREIGN KEY (`propiedades_idpropiedades`, `propiedades_campos_idtipocampos`)
    REFERENCES `inmorural`.`propiedades` (`idpropiedades`, `campos_idtipocampos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_prop_consultas_consultas`
    FOREIGN KEY (`consultas_idconsultas`)
    REFERENCES `inmorural`.`consultas` (`idconsultas`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `inmorural`.`servicios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inmorural`.`servicios` (
  `idservicios` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(65) NOT NULL,
  PRIMARY KEY (`idservicios`),
  UNIQUE INDEX `idx_servicios_nombre` (`nombre` ASC)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `inmorural`.`propiedades_has_servicios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inmorural`.`propiedades_has_servicios` (
  `propiedades_idpropiedades` INT NOT NULL,
  `propiedades_campos_idtipocampos` INT NOT NULL,
  `propiedades_estadisticas_idestadisticas` INT NOT NULL,
  `servicios_idservicios` INT NOT NULL,
  PRIMARY KEY (`propiedades_idpropiedades`, `propiedades_campos_idtipocampos`, `propiedades_estadisticas_idestadisticas`, `servicios_idservicios`),
  INDEX `fk_prop_servicios_servicios_idx` (`servicios_idservicios` ASC),
  INDEX `fk_prop_servicios_propiedades_idx` (`propiedades_idpropiedades` ASC, `propiedades_campos_idtipocampos` ASC, `propiedades_estadisticas_idestadisticas` ASC),
  INDEX `idx_prop_servicios_servicio` (`servicios_idservicios` ASC),
  INDEX `idx_prop_servicios_prop` (`propiedades_idpropiedades` ASC),
  CONSTRAINT `fk_prop_servicios_propiedades`
    FOREIGN KEY (`propiedades_idpropiedades`, `propiedades_campos_idtipocampos`, `propiedades_estadisticas_idestadisticas`)
    REFERENCES `inmorural`.`propiedades` (`idpropiedades`, `campos_idtipocampos`, `estadisticas_idestadisticas`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_prop_servicios_servicios`
    FOREIGN KEY (`servicios_idservicios`)
    REFERENCES `inmorural`.`servicios` (`idservicios`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;