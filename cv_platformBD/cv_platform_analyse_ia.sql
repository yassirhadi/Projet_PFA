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
-- Table structure for table `analyse_ia`
--

DROP TABLE IF EXISTS `analyse_ia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `analyse_ia` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `competences_manquantes` text,
  `competences_trouvees` text,
  `date_analyse` datetime(6) NOT NULL,
  `message_erreur` text,
  `points_ameliorer` text,
  `points_forts` text,
  `score` double NOT NULL,
  `statut` enum('EN_COURS','ERREUR','TERMINEE') NOT NULL,
  `cv_id` bigint NOT NULL,
  `offre_emploi_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKju1etq0q0eq2gid4chy90b9h2` (`cv_id`),
  KEY `FKiqn7shfrhftovyya4xjtk138i` (`offre_emploi_id`),
  CONSTRAINT `FKiqn7shfrhftovyya4xjtk138i` FOREIGN KEY (`offre_emploi_id`) REFERENCES `offre_emploi` (`id`),
  CONSTRAINT `FKju1etq0q0eq2gid4chy90b9h2` FOREIGN KEY (`cv_id`) REFERENCES `cv` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `analyse_ia`
--

LOCK TABLES `analyse_ia` WRITE;
/*!40000 ALTER TABLE `analyse_ia` DISABLE KEYS */;
INSERT INTO `analyse_ia` VALUES (1,'[\"Docker\",\"Kubernetes\",\"Microservices\",\"AWS\"]','[\"Java\",\"Spring Boot\",\"MySQL\",\"Git\",\"RESTful APIs\"]','2026-03-02 21:32:19.394900',NULL,'[\"Acquérir des compétences en conteneurisation\",\"Se former sur les architectures cloud\"]','[\"Expérience solide en développement backend Java\",\"Bonne maîtrise des frameworks Spring\",\"Compétences en bases de données relationnelles\"]',92.65181712976288,'TERMINEE',2,1);
/*!40000 ALTER TABLE `analyse_ia` ENABLE KEYS */;
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

-- Dump completed on 2026-03-27 19:42:40
