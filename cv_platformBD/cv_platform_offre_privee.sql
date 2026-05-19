-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: cv_platform
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '997e0106-1000-11f1-bdb3-7cd30a80ae89:1-89';

--
-- Table structure for table `offre_privee`
--

DROP TABLE IF EXISTS `offre_privee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offre_privee` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `competences` text,
  `date_creation` datetime(6) NOT NULL,
  `date_envoi` datetime(6) DEFAULT NULL,
  `date_expiration` datetime(6) NOT NULL,
  `date_lecture` datetime(6) DEFAULT NULL,
  `description` text NOT NULL,
  `entreprise` varchar(150) NOT NULL,
  `localisation` varchar(100) NOT NULL,
  `niveau_experience` varchar(50) DEFAULT NULL,
  `raison_desactivation` text,
  `salaire_max` double DEFAULT NULL,
  `salaire_min` double DEFAULT NULL,
  `titre` varchar(200) NOT NULL,
  `type_contrat` varchar(50) NOT NULL,
  `vue` bit(1) NOT NULL,
  `destinataire_id` bigint NOT NULL,
  `emetteur_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_destinataire_active` (`destinataire_id`,`active`),
  KEY `idx_date_expiration` (`date_expiration`),
  KEY `idx_active_vue` (`active`,`vue`),
  KEY `FKk5t16mkacu3ad525eyderfdi0` (`emetteur_id`),
  CONSTRAINT `FK4ed0exwjb7kcj7k6b84y30q5s` FOREIGN KEY (`destinataire_id`) REFERENCES `etudiant` (`id`),
  CONSTRAINT `FKk5t16mkacu3ad525eyderfdi0` FOREIGN KEY (`emetteur_id`) REFERENCES `utilisateur` (`id`),
  CONSTRAINT `offre_privee_chk_1` CHECK ((`salaire_max` >= 0)),
  CONSTRAINT `offre_privee_chk_2` CHECK ((`salaire_min` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offre_privee`
--

LOCK TABLES `offre_privee` WRITE;
/*!40000 ALTER TABLE `offre_privee` DISABLE KEYS */;
INSERT INTO `offre_privee` VALUES (1,_binary '','Java, Spring Boot, MySQL, Git','2026-03-03 19:56:18.664840','2026-03-03 19:56:18.664840','2026-12-31 22:59:59.000000',NULL,'Nous avons analysé votre profil et nous vous proposons cette offre exclusive. Vous travaillerez sur des architectures microservices avec Spring Boot 3 et Java 17.','TechCorp Morocco','Oujda','Junior',NULL,13000,9000,'Développeur Java Spring Boot - Mission Ahmed','CDI',_binary '\0',3,7),(2,_binary '',NULL,'2026-03-03 20:14:44.697149','2026-03-03 20:14:44.697149','2026-12-31 22:59:59.000000',NULL,'Description test qui fait plus de 50 caractères pour valider','Test Corp','Oujda',NULL,NULL,NULL,NULL,'Test Offre','CDI',_binary '\0',3,7),(3,_binary '','Java, Spring Boot, MySQL','2026-03-03 20:34:10.922347','2026-03-03 20:34:10.922347','2026-12-31 22:59:59.000000',NULL,'Nous recherchons un développeur Java passionné pour rejoindre notre équipe. Mission sur un projet stratégique avec technologies modernes.','TechCorp Morocco','Oujda','Junior',NULL,13000,9000,'Développeur Java Spring Boot','CDI',_binary '\0',3,7),(4,_binary '','Java, Spring, React','2026-03-03 20:40:17.268182','2026-03-03 20:40:17.268182','2026-12-31 22:59:59.000000','2026-03-03 20:44:19.265105','Nous recherchons un stagiaire talentueux pour travailler sur notre nouvelle plateforme de gestion.','Maroc Tech Solution','Oujda','Débutant',NULL,6000,4000,'Stage PFE - Développeur Fullstack','CDI',_binary '',8,8),(5,_binary '','Java, Spring Boot, MySQL','2026-03-04 11:16:32.299103','2026-03-04 11:16:32.299103','2026-12-31 22:59:59.000000',NULL,'Nous recherchons un stagiaire pour travailler sur une plateforme RH.','Maroc Tech Solution','Oujda','Débutant',NULL,4000,3000,'Stage PFE - Développeur Java/Spring','Stage',_binary '\0',3,7),(6,_binary '','Java, Spring Boot, MySQL','2026-03-04 11:19:52.112209','2026-03-04 11:19:52.112209','2026-12-31 22:59:59.000000',NULL,'Nous recherchons un stagiaire pour travailler sur une plateforme RH.','Maroc Tech Solution','Oujda','Débutant',NULL,4000,3000,'Stage PFE - Développeur Java/Spring','Stage',_binary '\0',3,7);
/*!40000 ALTER TABLE `offre_privee` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-27 19:42:39
