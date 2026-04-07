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
-- Table structure for table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur` (
  `type_utilisateur` varchar(50) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `role` varchar(50) NOT NULL,
  `date_creation` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKrma38wvnqfaf66vvmi57c71lo` (`email`),
  CONSTRAINT `utilisateur_chk_1` CHECK ((`type_utilisateur` in (_utf8mb4'Utilisateur',_utf8mb4'ADMIN',_utf8mb4'ETUDIANT')))
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur`
--

LOCK TABLES `utilisateur` WRITE;
/*!40000 ALTER TABLE `utilisateur` DISABLE KEYS */;
INSERT INTO `utilisateur` VALUES ('ETUDIANT',3,'ahmed2@test.com','password123','Belouadheh','Ahmed','ETUDIANT',NULL),('ETUDIANT',4,'bcrypt@test.com','$2a$10$vpW2b4rn8X8VTsRCQJfBaOmAD/hbklEl/DjcSlNawANxV4GNmIEFS','Secure','Test','ETUDIANT',NULL),('ETUDIANT',5,'test.secure@test.com','$2a$10$RV0PU5PWGgI527f0GJoQy.E4h.0FqNqBEEOOt90OB9QiL2TqNGFKy','Test','Secure','ETUDIANT',NULL),('ETUDIANT',6,'logtest@test.com','$2a$10$q7Nr4z6hhiaW8iLVfoetC.t4aWc0vExLQMp8Kxjey6CWtKfCMZ/0C','LogTest','User','ETUDIANT',NULL),('ADMIN',7,'admin@example.com','$2a$10$mXDyRyLud5CgTIDsXsUuQexPNF8gYxi.99LvhQRud65XZWWkJXaWi','Admin','System','ADMIN',NULL),('ETUDIANT',8,'student@test.com','$2a$10$U3oLDx3T6GCK7sFsEzCLyeQ32B9ah5uCJYDzK2QVnyA6Qty2AOsgK','Testeur','Etudiant','ETUDIANT',NULL),('ETUDIANT',9,'etudiant.test@test.com','$2a$10$nPwceTogKeg7Wzq.MJDlQe4UGixE4.9oqLdkFFW/VbFPalljXJGJi','Testeur','Etudiant','ETUDIANT',NULL),('ETUDIANT',10,'test2@example.com','$2a$10$bkLRDnaKXa4dEyUISa6ikuLWYfn2u6C9eDrAMJ5fjFfqtAIPp1JD.','Test','User','ETUDIANT','2026-03-05 17:59:30'),('ETUDIANT',11,'ahmed.test@example.com','$2a$10$V7Z8Qi7D3D24.I4CnQ8SmelyKwjA4NSr.d8aF9/.tpK/0L0Zn7wN6','Ahmed','Test','ETUDIANT','2026-03-05 20:20:51'),('ETUDIANT',12,'refresh.test@example.com','$2a$10$aCNLWwBDtfsTzNDeXCN81.lAI9VOLwjeyFq34II8VMz0WW88.qyaW','Token','Test','ETUDIANT','2026-03-07 12:51:02'),('ETUDIANT',13,'migration.test@example.com','$2a$10$1x7gjjkKxGzDI5D50TENfu1JELBZTwC5ONzinKzGXE/kRc0vUDORG','Migration','Test','ETUDIANT','2026-03-09 14:24:06'),('ETUDIANT',14,'test.ia@example.com','$2a$10$kt.CpAa1hCU6AWVGWsFYAOn5Tqxu6dalkKcHzXBdNlNYtKZuBOVTO','Test','IA','ETUDIANT','2026-03-09 21:14:36'),('ETUDIANT',15,'swagger.test@example.com','$2a$10$XqjvB3UJrXQHkwy4Zw.B2enifbnRC8NgzObquMIVcw7vTagWaG6Hu','Swagger','Test','ETUDIANT','2026-03-10 14:19:14');
/*!40000 ALTER TABLE `utilisateur` ENABLE KEYS */;
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
