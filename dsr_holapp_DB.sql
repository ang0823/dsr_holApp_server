-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema dsr_holapp
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema dsr_holapp
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `dsr_holapp` DEFAULT CHARACTER SET latin1 ;
USE `dsr_holapp` ;

-- -----------------------------------------------------
-- Table `dsr_holapp`.`cuenta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dsr_holapp`.`cuenta` (
  `idcuenta` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `apellido_p` VARCHAR(100) NOT NULL,
  `apellido_m` VARCHAR(100) NOT NULL,
  `username` VARCHAR(25) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `status` BINARY(1) NOT NULL DEFAULT '1',
  `esModerador` BINARY(1) NULL DEFAULT NULL,
  PRIMARY KEY (`idcuenta`),
  UNIQUE INDEX `idcuenta_UNIQUE` (`idcuenta` ASC),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 23
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `dsr_holapp`.`amigos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dsr_holapp`.`amigos` (
  `idAmigos` INT(11) NOT NULL AUTO_INCREMENT,
  `idcuenta_propietario` INT(11) NOT NULL,
  `idcuenta_amigo` INT(11) NOT NULL,
  PRIMARY KEY (`idAmigos`),
  UNIQUE INDEX `idAmigos_UNIQUE` (`idAmigos` ASC),
  INDEX `propietario_idx` (`idcuenta_propietario` ASC),
  INDEX `amigo_idx` (`idcuenta_amigo` ASC),
  CONSTRAINT `amigo`
    FOREIGN KEY (`idcuenta_amigo`)
    REFERENCES `dsr_holapp`.`cuenta` (`idcuenta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `propietario`
    FOREIGN KEY (`idcuenta_propietario`)
    REFERENCES `dsr_holapp`.`cuenta` (`idcuenta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `dsr_holapp`.`chat`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dsr_holapp`.`chat` (
  `idchat` INT(11) NOT NULL AUTO_INCREMENT,
  `archivado` BINARY(1) NULL DEFAULT NULL,
  `cuenta_idcuenta` INT(11) NOT NULL,
  PRIMARY KEY (`idchat`, `cuenta_idcuenta`),
  UNIQUE INDEX `idchat_UNIQUE` (`idchat` ASC),
  INDEX `fk_chat_cuenta1_idx` (`cuenta_idcuenta` ASC),
  CONSTRAINT `fk_chat_cuenta1`
    FOREIGN KEY (`cuenta_idcuenta`)
    REFERENCES `dsr_holapp`.`cuenta` (`idcuenta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `dsr_holapp`.`fotografia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dsr_holapp`.`fotografia` (
  `id_fotografia` INT(11) NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(45) NULL DEFAULT NULL,
  `ubicacion` VARCHAR(100) NOT NULL,
  `aprobada` BINARY(1) NOT NULL DEFAULT '0',
  `cuenta_idcuenta` INT(11) NOT NULL,
  PRIMARY KEY (`id_fotografia`, `cuenta_idcuenta`),
  UNIQUE INDEX `id_fotografia_UNIQUE` (`id_fotografia` ASC),
  INDEX `fk_fotografia_cuenta1_idx` (`cuenta_idcuenta` ASC),
  CONSTRAINT `fk_fotografia_cuenta1`
    FOREIGN KEY (`cuenta_idcuenta`)
    REFERENCES `dsr_holapp`.`cuenta` (`idcuenta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `dsr_holapp`.`comentario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dsr_holapp`.`comentario` (
  `idcomentario` INT(11) NOT NULL AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  `hora` TIME NULL DEFAULT NULL,
  `fotografia_id_fotografia` INT(11) NOT NULL,
  PRIMARY KEY (`idcomentario`, `fotografia_id_fotografia`),
  UNIQUE INDEX `idcomentario_UNIQUE` (`idcomentario` ASC),
  INDEX `fk_comentario_fotografia_idx` (`fotografia_id_fotografia` ASC),
  CONSTRAINT `fk_comentario_fotografia`
    FOREIGN KEY (`fotografia_id_fotografia`)
    REFERENCES `dsr_holapp`.`fotografia` (`id_fotografia`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `dsr_holapp`.`favoritas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dsr_holapp`.`favoritas` (
  `idfavoritas` INT(11) NOT NULL AUTO_INCREMENT,
  `cuenta_id` INT(11) NOT NULL,
  `fotografia_id` INT(11) NOT NULL,
  PRIMARY KEY (`idfavoritas`),
  INDEX `id_cuenta_idx` (`cuenta_id` ASC),
  INDEX `fotografia_id_idx` (`fotografia_id` ASC),
  CONSTRAINT `cuenta_id`
    FOREIGN KEY (`cuenta_id`)
    REFERENCES `dsr_holapp`.`cuenta` (`idcuenta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fotografia_id`
    FOREIGN KEY (`fotografia_id`)
    REFERENCES `dsr_holapp`.`fotografia` (`id_fotografia`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `dsr_holapp`.`mensaje`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dsr_holapp`.`mensaje` (
  `idmensaje` INT(11) NOT NULL,
  `fecha` DATE NOT NULL,
  `hora` TIME NOT NULL,
  `contenido` VARCHAR(1000) NOT NULL,
  `chat_idchat` INT(11) NOT NULL,
  `chat_cuenta_idcuenta` INT(11) NOT NULL,
  PRIMARY KEY (`idmensaje`, `chat_idchat`, `chat_cuenta_idcuenta`),
  INDEX `fk_mensaje_chat1_idx` (`chat_idchat` ASC, `chat_cuenta_idcuenta` ASC),
  CONSTRAINT `fk_mensaje_chat1`
    FOREIGN KEY (`chat_idchat` , `chat_cuenta_idcuenta`)
    REFERENCES `dsr_holapp`.`chat` (`idchat` , `cuenta_idcuenta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `dsr_holapp`.`reaciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dsr_holapp`.`reaciones` (
  `id_reacion` INT NOT NULL AUTO_INCREMENT,
  `reaccion` VARCHAR(15) NULL DEFAULT NULL,
  PRIMARY KEY (`id_reacion`),
  UNIQUE INDEX `reaccion_UNIQUE` (`reaccion` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dsr_holapp`.`fotografia_has_reaciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dsr_holapp`.`fotografia_has_reaciones` (
  `fotografia_id_fotografia` INT(11) NOT NULL,
  `reaciones_id_reacion` INT NOT NULL,
  PRIMARY KEY (`fotografia_id_fotografia`, `reaciones_id_reacion`),
  INDEX `fk_fotografia_has_reaciones_reaciones1_idx` (`reaciones_id_reacion` ASC),
  INDEX `fk_fotografia_has_reaciones_fotografia1_idx` (`fotografia_id_fotografia` ASC),
  CONSTRAINT `fk_fotografia_has_reaciones_fotografia1`
    FOREIGN KEY (`fotografia_id_fotografia`)
    REFERENCES `dsr_holapp`.`fotografia` (`id_fotografia`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_fotografia_has_reaciones_reaciones1`
    FOREIGN KEY (`reaciones_id_reacion`)
    REFERENCES `dsr_holapp`.`reaciones` (`id_reacion`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
