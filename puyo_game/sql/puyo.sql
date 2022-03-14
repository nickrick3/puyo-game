-- Progettazione Web 
DROP DATABASE if exists puyo; 
CREATE DATABASE puyo; 
USE puyo; 
-- MySQL dump 10.13  Distrib 5.6.20, for Win32 (x86)
--
-- Host: localhost    Database: puyo
-- ------------------------------------------------------
-- Server version	5.6.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `scores`
--

DROP TABLE IF EXISTS `scores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `scores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `player` varchar(20) NOT NULL,
  `score` int(11) NOT NULL,
  `time` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `playerForeignKey` (`player`),
  CONSTRAINT `playerForeignKey` FOREIGN KEY (`player`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scores`
--

LOCK TABLES `scores` WRITE;
/*!40000 ALTER TABLE `scores` DISABLE KEYS */;
INSERT INTO `scores` VALUES (1,'NickRick',155,12900,'2021-10-23 15:32:22'),(2,'NickRick',55,9600,'2021-10-23 15:39:24'),(3,'NickRick',60,9680,'2021-10-23 15:39:37'),(4,'NickRick',120,11420,'2021-10-23 15:39:50'),(5,'NickRick',30,7800,'2021-10-23 15:42:06'),(6,'NickRick',130,11280,'2021-10-23 15:42:21'),(7,'NickRick',125,12680,'2021-10-23 15:42:35'),(8,'NickRick',80,9400,'2021-10-23 15:42:46'),(9,'NickRick',65,9620,'2021-10-23 15:42:58'),(10,'NickRick',50,8400,'2021-10-23 15:43:08'),(11,'NickRick',75,9820,'2021-10-23 15:43:52'),(12,'NickRick',45,8820,'2021-10-23 15:44:04'),(13,'NickRick',120,13060,'2021-10-23 15:44:19'),(14,'NickRick',790,220000,'2021-10-23 15:48:01'),(15,'NickRick',35,7940,'2021-10-23 15:48:29'),(16,'NickRick',90,9860,'2021-10-23 15:48:41'),(17,'prova3',65,9540,'2021-10-23 16:03:10'),(18,'NickRick',75,8900,'2021-10-24 16:17:29'),(19,'NickRick',145,12280,'2021-10-24 17:39:56'),(20,'NickRick',95,11040,'2021-10-24 17:41:41'),(21,'NickRick',40,8100,'2021-10-24 17:46:00'),(22,'NickRick',35,7900,'2021-10-24 17:47:11'),(23,'NickRick',20,7400,'2021-10-24 17:50:06'),(24,'NickRick',40,6420,'2021-10-24 17:51:28'),(25,'NickRick',40,6800,'2021-10-24 17:51:47'),(26,'NickRick',85,10300,'2021-10-24 17:52:39'),(27,'NickRick',20,6840,'2021-10-24 17:52:51'),(28,'NickRick',35,7900,'2021-10-25 10:07:45'),(29,'test',70,12300,'2021-10-26 13:05:22'),(30,'test',55,7480,'2021-10-26 13:05:39'),(31,'acqua',130,27080,'2021-10-26 15:53:53'),(32,'acqua',55,12940,'2021-10-26 15:54:12'),(33,'fuoco',10,6880,'2021-10-26 15:55:38'),(34,'fuoco',30,7160,'2021-10-26 15:55:48');
/*!40000 ALTER TABLE `scores` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `puyo`.`update_stats`
AFTER INSERT ON `puyo`.`scores`
FOR EACH ROW
BEGIN
DECLARE old_highscore INT;
DECLARE old_best_time INT;

SELECT highscore
INTO old_highscore
FROM users
WHERE username = new.player;

SELECT best_time
INTO old_best_time
FROM users
WHERE username = new.player;

IF new.score > old_highscore THEN
	UPDATE users
	SET highscore = new.score
	WHERE username = new.player;
END IF;

IF new.time > old_best_time THEN
	UPDATE users
	SET best_time = new.time
	WHERE username = new.player;
END IF;

UPDATE users
SET avgscore = (
	SELECT FLOOR(AVG(score))
    FROM scores
    WHERE player = new.player)
WHERE username = new.player;

UPDATE users
SET avgtime = (
	SELECT FLOOR(AVG(time))
    FROM scores
    WHERE player = new.player)
WHERE username = new.player;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `username` varchar(20) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avgscore` int(11) DEFAULT '0',
  `avgtime` int(11) DEFAULT '0',
  `highscore` int(11) DEFAULT '0',
  `best_time` int(11) DEFAULT '0',
  PRIMARY KEY (`username`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('acqua','acqu@mail.com','$2y$10$pMRT8dvp6Of8UpOYJUS.weCuDe/4h/7msj5Y4X34DfeSRbeSfSAjC',92,20010,130,27080),('fuoco','emailfalsa@mail.ru','$2y$10$pP9os65I59bhWHtLpNBH0.O2pw0lj1Z72K5CE1npyhiN0H8/VeCDa',20,7020,30,7160),('NickRick','nik.rik@gmail.com','$2y$10$d8PTh9VXr9rBZN8fl.Ayq.hGuDiOGybDn3sOX/JZMj/wMxzmr6uyu',98,17265,790,220000),('prova3','prova3@virgilio.it','$2y$10$s7wj68TXk3bWHbOShpFO4OGEBkcGhuc1hVl.0bJGpdZhOwiU044s2',65,9540,65,9540),('test','testmail@mail.com','$2y$10$NdbXfyBLyXwRryHHNOlFwOhofoJyGLLwqrgOtXscb2tk0LXwvjlEW',62,9890,70,12300);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-10-26 17:59:05
