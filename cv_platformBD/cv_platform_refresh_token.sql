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
-- Table structure for table `refresh_token`
--

DROP TABLE IF EXISTS `refresh_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_token` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `token` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'JWT refresh token string',
  `user_id` bigint NOT NULL COMMENT 'ID utilisateur propriétaire du token',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date création token',
  `expires_at` datetime NOT NULL COMMENT 'Date expiration token',
  `revoked` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Token révoqué (logout/password change)',
  `revoked_at` datetime DEFAULT NULL COMMENT 'Date révocation',
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'IP lors de la création',
  `user_agent` text COLLATE utf8mb4_unicode_ci COMMENT 'User agent (browser/device)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `idx_user_id` (`user_id`) COMMENT 'Recherche par utilisateur',
  KEY `idx_token` (`token`) COMMENT 'Validation token',
  KEY `idx_expires_at` (`expires_at`) COMMENT 'Cleanup automatique',
  KEY `idx_revoked` (`revoked`) COMMENT 'Filter tokens actifs',
  CONSTRAINT `fk_refresh_token_user` FOREIGN KEY (`user_id`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stockage refresh tokens JWT pour authentification durable';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_token`
--

LOCK TABLES `refresh_token` WRITE;
/*!40000 ALTER TABLE `refresh_token` DISABLE KEYS */;
INSERT INTO `refresh_token` VALUES (2,'eyJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInVzZXJJZCI6MTIsInN1YiI6InJlZnJlc2gudGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTc3Mjg4Nzk1NSwiZXhwIjoxNzczNDkyNzU1LCJqdGkiOiJmM2JkOTQ3Yy02NjJmLTQzMzctYTZkNS1iNGE3YzA4Yzg5NmMifQ.ICIE13Ho3QfalstvwrkCmQ2VJPKzkQSUpZ5_g5LBwWw',12,'2026-03-07 12:52:36','2026-03-14 12:52:36',1,'2026-03-07 12:58:33','0:0:0:0:0:0:0:1','PostmanRuntime/7.51.1'),(3,'eyJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInVzZXJJZCI6MTIsInN1YiI6InJlZnJlc2gudGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTc3Mjg4ODYwMSwiZXhwIjoxNzczNDkzNDAxLCJqdGkiOiI2YThlMjM3ZS1jZTdiLTQxMDMtYTc5Zi02ZTUzNmI5MWZjMDIifQ.HHwnmQXcgAbmTdU34VJij3bfg529pF8mBKHW_eDB3Pg',12,'2026-03-07 13:03:21','2026-03-14 13:03:21',1,'2026-03-07 13:05:34','0:0:0:0:0:0:0:1','PostmanRuntime/7.51.1'),(4,'eyJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInVzZXJJZCI6MTIsInN1YiI6InJlZnJlc2gudGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTc3Mjg4ODk3MiwiZXhwIjoxNzczNDkzNzcyLCJqdGkiOiJmOWE2OWE1NC1hN2MyLTQyN2EtODJlNy1mZDQ5ZDM3ZDg4ZjQifQ.Q6RaCOfXV5LQM6lN8hStnO0KkvKJOTNojhL4pB-unJk',12,'2026-03-07 13:09:33','2026-03-14 13:09:33',0,NULL,'0:0:0:0:0:0:0:1','PostmanRuntime/7.51.1'),(5,'eyJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInVzZXJJZCI6MTMsInN1YiI6Im1pZ3JhdGlvbi50ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzczMDY2MzU3LCJleHAiOjE3NzM2NzExNTcsImp0aSI6ImE2YjZiMzBiLTBiYTgtNDM2Ni1iY2YxLTlkNmZiYmI5NmY1MiJ9.wsqktYOMEEOxokSyUAT4kRTBQjnSGAHG10cMiPhVd6k',13,'2026-03-09 14:25:57','2026-03-16 14:25:57',0,NULL,'0:0:0:0:0:0:0:1','PostmanRuntime/7.51.1'),(6,'eyJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInVzZXJJZCI6MTQsInN1YiI6InRlc3QuaWFAZXhhbXBsZS5jb20iLCJpYXQiOjE3NzMwOTA5MTMsImV4cCI6MTc3MzY5NTcxMywianRpIjoiMGQ1YTFjMzMtNTM1Zi00ZjMxLWFjYjYtNDBjYjE0ODUxMGM1In0.zQBHsPwcq_aHkqFK_h0P7novSckLIe9oHcV_oVodxqU',14,'2026-03-09 21:15:14','2026-03-16 21:15:14',0,NULL,'0:0:0:0:0:0:0:1','PostmanRuntime/7.51.1'),(7,'eyJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInVzZXJJZCI6MTQsInN1YiI6InRlc3QuaWFAZXhhbXBsZS5jb20iLCJpYXQiOjE3NzMwOTEyMjksImV4cCI6MTc3MzY5NjAyOSwianRpIjoiOGVjYTZhYjctOWM1ZC00MmU3LWI3OWYtMGJlNjc0NGU2YWQ4In0.nQxGuyChx_aLg9n54L9xOf3nZAzeb8owcV-5nYh5PN4',14,'2026-03-09 21:20:30','2026-03-16 21:20:30',0,NULL,'0:0:0:0:0:0:0:1','PostmanRuntime/7.51.1'),(8,'eyJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInVzZXJJZCI6MTQsInN1YiI6InRlc3QuaWFAZXhhbXBsZS5jb20iLCJpYXQiOjE3NzMxNDg3OTgsImV4cCI6MTc3Mzc1MzU5OCwianRpIjoiNTE0NjUyNzEtNWZiOC00Njc0LTliMDItMmMzM2RmNjY4OGNmIn0.nMaFxMDw1WJN0dV-JeklzKAYtHWRzoetUmEEoNiyAjU',14,'2026-03-10 13:19:58','2026-03-17 13:19:58',0,NULL,'0:0:0:0:0:0:0:1','PostmanRuntime/7.51.1'),(9,'eyJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInVzZXJJZCI6MTUsInN1YiI6InN3YWdnZXIudGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTc3MzE1MjU3NSwiZXhwIjoxNzczNzU3Mzc1LCJqdGkiOiJhNGE4MjE0Zi1jMTY0LTQ2ZWItYTM4Zi0yMmU4MTY3OTcwNDgifQ.SICuW-Yenn50QHsVVpljrsrLGsGZkCtwIJaVTYxpxDo',15,'2026-03-10 14:22:56','2026-03-17 14:22:56',0,NULL,'0:0:0:0:0:0:0:1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36'),(10,'eyJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInVzZXJJZCI6MTUsInN1YiI6InN3YWdnZXIudGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTc3MzE1Mzg0OCwiZXhwIjoxNzczNzU4NjQ4LCJqdGkiOiJmZmU4NDJhNi1jZTI0LTQ1MmMtOTUzZS1mNGU1MWQ3NjYzOTcifQ.mf3_-_ZhW_OrBh7lfc6KOyBLAkfjl2sCABFckL3cWcM',15,'2026-03-10 14:44:08','2026-03-17 14:44:08',0,NULL,'0:0:0:0:0:0:0:1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36');
/*!40000 ALTER TABLE `refresh_token` ENABLE KEYS */;
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
