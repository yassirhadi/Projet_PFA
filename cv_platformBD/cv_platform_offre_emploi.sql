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
-- Table structure for table `offre_emploi`
--

DROP TABLE IF EXISTS `offre_emploi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offre_emploi` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) DEFAULT NULL,
  `competences` text,
  `date_expiration` datetime(6) DEFAULT NULL,
  `date_publication` datetime(6) NOT NULL,
  `description` text,
  `entreprise` varchar(255) NOT NULL,
  `localisation` varchar(255) DEFAULT NULL,
  `niveau_experience` varchar(255) DEFAULT NULL,
  `salaire_max` double DEFAULT NULL,
  `salaire_min` double DEFAULT NULL,
  `titre` varchar(255) NOT NULL,
  `type_contrat` varchar(255) DEFAULT NULL,
  `etudiant_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6fqb1e3kghhj6ogtuwtqa1npl` (`etudiant_id`),
  CONSTRAINT `FK6fqb1e3kghhj6ogtuwtqa1npl` FOREIGN KEY (`etudiant_id`) REFERENCES `etudiant` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offre_emploi`
--

LOCK TABLES `offre_emploi` WRITE;
/*!40000 ALTER TABLE `offre_emploi` DISABLE KEYS */;
INSERT INTO `offre_emploi` VALUES (1,_binary '','Java,Spring Boot,React,MySQL',NULL,'2026-02-24 20:20:26.248082','Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe dynamique.','TechCorp','Casablanca','Confirmé',15000,10000,'Développeur Full Stack Senior','CDI',3),(2,_binary '\0','Python,TensorFlow,Pandas',NULL,'2026-02-24 20:21:17.600096','Analyse de données et machine learning.','DataLab','Rabat','Junior',9000,6000,'Data Scientist','CDD',3);
/*!40000 ALTER TABLE `offre_emploi` ENABLE KEYS */;
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
