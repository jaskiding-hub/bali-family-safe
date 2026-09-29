-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: bali_family_safe_tours
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_users`
--

DROP TABLE IF EXISTS `admin_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `admin_users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_users`
--

LOCK TABLES `admin_users` WRITE;
/*!40000 ALTER TABLE `admin_users` DISABLE KEYS */;
INSERT INTO `admin_users` VALUES (1,'Bagas','admin@bfs.test','$2y$12$urVntgziA1zSBOkTV6lUPuWr8fSb.JRohO4YNY0GbCKl7pPKjlTpK','2026-09-10 06:07:25');
/*!40000 ALTER TABLE `admin_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `airports`
--

DROP TABLE IF EXISTS `airports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `airports` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `destinasi` varchar(255) NOT NULL,
  `price_regular` decimal(10,2) NOT NULL,
  `price_luxury` decimal(10,2) NOT NULL,
  `type` enum('Pick-Up','Drop-Off') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `airports`
--

LOCK TABLES `airports` WRITE;
/*!40000 ALTER TABLE `airports` DISABLE KEYS */;
INSERT INTO `airports` VALUES (1,'Ubud',350000.00,750000.00,'Pick-Up','2026-09-09 22:07:26','2026-09-09 22:07:26'),(2,'Ubud',350000.00,750000.00,'Drop-Off','2026-09-09 22:07:26','2026-09-09 22:07:26'),(3,'Seminyak',250000.00,550000.00,'Pick-Up','2026-09-09 22:07:26','2026-09-09 22:07:26'),(4,'Nusa Dua',300000.00,650000.00,'Pick-Up','2026-09-09 22:07:26','2026-09-09 22:07:26'),(5,'Jimbaran & Uluwatu',300000.00,650000.00,'Pick-Up','2026-09-09 22:07:26','2026-09-09 22:07:26'),(6,'Kuta / Legian',200000.00,450000.00,'Pick-Up','2026-09-09 22:07:31','2026-09-09 22:07:31'),(7,'Kuta / Legian',175000.00,400000.00,'Drop-Off','2026-09-09 22:07:31','2026-09-09 22:07:31'),(8,'Seminyak / Kerobokan',250000.00,550000.00,'Pick-Up','2026-09-09 22:07:31','2026-09-09 22:07:31'),(9,'Seminyak / Kerobokan',225000.00,500000.00,'Drop-Off','2026-09-09 22:07:31','2026-09-09 22:07:31'),(10,'Sanur',250000.00,550000.00,'Pick-Up','2026-09-09 22:07:31','2026-09-09 22:07:31'),(11,'Sanur',225000.00,500000.00,'Drop-Off','2026-09-09 22:07:31','2026-09-09 22:07:31'),(12,'Nusa Dua / Benoa',250000.00,550000.00,'Pick-Up','2026-09-09 22:07:31','2026-09-09 22:07:31'),(13,'Nusa Dua / Benoa',225000.00,500000.00,'Drop-Off','2026-09-09 22:07:31','2026-09-09 22:07:31'),(14,'Jimbaran / Uluwatu',300000.00,600000.00,'Pick-Up','2026-09-09 22:07:31','2026-09-09 22:07:31'),(15,'Jimbaran / Uluwatu',275000.00,550000.00,'Drop-Off','2026-09-09 22:07:31','2026-09-09 22:07:31'),(16,'Canggu / Pererenan',350000.00,700000.00,'Pick-Up','2026-09-09 22:07:31','2026-09-09 22:07:31'),(17,'Canggu / Pererenan',300000.00,650000.00,'Drop-Off','2026-09-09 22:07:31','2026-09-09 22:07:31'),(18,'Ubud Central',450000.00,850000.00,'Pick-Up','2026-09-09 22:07:31','2026-09-09 22:07:31'),(19,'Ubud Central',400000.00,800000.00,'Drop-Off','2026-09-09 22:07:31','2026-09-09 22:07:31'),(20,'DPS Airport',250000.00,450000.00,'Pick-Up','2026-09-09 22:07:32','2026-09-09 22:07:32'),(21,'DPS Airport',250000.00,450000.00,'Drop-Off','2026-09-09 22:07:32','2026-09-09 22:07:32');
/*!40000 ALTER TABLE `airports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_child_seats`
--

DROP TABLE IF EXISTS `booking_child_seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_child_seats` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `booking_id` bigint(20) unsigned NOT NULL,
  `child_seat_type_id` bigint(20) unsigned NOT NULL,
  `quantity` int(10) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `booking_child_seats_booking_id_foreign` (`booking_id`),
  KEY `booking_child_seats_child_seat_type_id_foreign` (`child_seat_type_id`),
  CONSTRAINT `booking_child_seats_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `booking_child_seats_child_seat_type_id_foreign` FOREIGN KEY (`child_seat_type_id`) REFERENCES `child_seat_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_child_seats`
--

LOCK TABLES `booking_child_seats` WRITE;
/*!40000 ALTER TABLE `booking_child_seats` DISABLE KEYS */;
INSERT INTO `booking_child_seats` VALUES (1,5,4,2),(2,6,5,1),(3,7,3,1),(4,7,4,1),(5,9,4,1),(6,10,3,1);
/*!40000 ALTER TABLE `booking_child_seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `booking_code` varchar(255) NOT NULL,
  `booking_type` enum('Airport Transfer','Hotel Transfer','Day Tour') NOT NULL,
  `transfer_direction` enum('Pick-Up','Drop-Off') DEFAULT NULL,
  `status` enum('Pending','Confirmed','Assigned','On Going','Completed','Cancelled') NOT NULL DEFAULT 'Pending',
  `guest_name` varchar(255) NOT NULL,
  `whatsapp_number` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `flight_number` varchar(255) DEFAULT NULL,
  `adults` int(10) unsigned NOT NULL DEFAULT 1,
  `children` int(10) unsigned NOT NULL DEFAULT 0,
  `pickup_hotel_id` bigint(20) unsigned DEFAULT NULL,
  `dropoff_hotel_id` bigint(20) unsigned DEFAULT NULL,
  `airport_id` bigint(20) unsigned DEFAULT NULL,
  `hotel_transfer_price_list_id` bigint(20) unsigned DEFAULT NULL,
  `booking_date` date NOT NULL,
  `pickup_time` time NOT NULL,
  `notes` text DEFAULT NULL,
  `total_fee` decimal(12,2) DEFAULT NULL,
  `vehicle_id` bigint(20) unsigned NOT NULL,
  `vehicle_unit_id` bigint(20) unsigned DEFAULT NULL,
  `driver_id` bigint(20) unsigned DEFAULT NULL,
  `package_id` bigint(20) unsigned DEFAULT NULL,
  `created_by_admin_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `bookings_booking_code_unique` (`booking_code`),
  KEY `bookings_vehicle_id_foreign` (`vehicle_id`),
  KEY `bookings_vehicle_unit_id_foreign` (`vehicle_unit_id`),
  KEY `bookings_driver_id_foreign` (`driver_id`),
  KEY `bookings_package_id_foreign` (`package_id`),
  KEY `bookings_created_by_admin_id_foreign` (`created_by_admin_id`),
  KEY `bookings_pickup_hotel_id_foreign` (`pickup_hotel_id`),
  KEY `bookings_dropoff_hotel_id_foreign` (`dropoff_hotel_id`),
  KEY `bookings_airport_id_foreign` (`airport_id`),
  KEY `bookings_hotel_transfer_price_list_id_foreign` (`hotel_transfer_price_list_id`),
  CONSTRAINT `bookings_airport_id_foreign` FOREIGN KEY (`airport_id`) REFERENCES `airports` (`id`) ON DELETE SET NULL,
  CONSTRAINT `bookings_created_by_admin_id_foreign` FOREIGN KEY (`created_by_admin_id`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `bookings_driver_id_foreign` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `bookings_dropoff_hotel_id_foreign` FOREIGN KEY (`dropoff_hotel_id`) REFERENCES `hotels` (`id`) ON DELETE SET NULL,
  CONSTRAINT `bookings_hotel_transfer_price_list_id_foreign` FOREIGN KEY (`hotel_transfer_price_list_id`) REFERENCES `hotel_transfer_price_lists` (`id`) ON DELETE SET NULL,
  CONSTRAINT `bookings_package_id_foreign` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE SET NULL,
  CONSTRAINT `bookings_pickup_hotel_id_foreign` FOREIGN KEY (`pickup_hotel_id`) REFERENCES `hotels` (`id`) ON DELETE SET NULL,
  CONSTRAINT `bookings_vehicle_id_foreign` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`),
  CONSTRAINT `bookings_vehicle_unit_id_foreign` FOREIGN KEY (`vehicle_unit_id`) REFERENCES `vehicle_units` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,'BFS-DRV-101','Airport Transfer','Pick-Up','On Going','Sarah Jenkins','+61 812 3456 7890','sarah.jenkins@example.com','GA-402',4,1,NULL,1,1,NULL,'2026-09-10','09:30:00','Tamu membawa 3 koper besar. Hubungi via WA saat pesawat landing. Requested 1x Toddler Seat.',450000.00,1,1,1,NULL,NULL,'2026-09-09 22:07:28'),(2,'BFS-DRV-102','Day Tour',NULL,'Assigned','Michael Chen & Family','+65 9123 4567','michael.chen@example.com',NULL,4,0,2,NULL,NULL,NULL,'2026-09-10','14:30:00','Rute: GWK -> Pantai Melasti -> Sunset di Pura Uluwatu -> Dinner Jimbaran.',850000.00,1,1,1,1,NULL,'2026-09-09 22:07:28'),(3,'BFS-DRV-201','Airport Transfer','Pick-Up','On Going','Sarah Jenkins','+61 812 3456 7890','sarah.jenkins@example.com','GA-402',4,1,NULL,1,1,NULL,'2026-09-10','09:30:00','Tamu membawa 3 koper besar. Hubungi via WA saat pesawat landing. Requested 1x Toddler Seat.',450000.00,1,1,2,NULL,NULL,'2026-09-09 22:07:28'),(4,'BFS-DRV-202','Day Tour',NULL,'Assigned','Michael Chen & Family','+65 9123 4567','michael.chen@example.com',NULL,4,0,2,NULL,NULL,NULL,'2026-09-10','14:30:00','Rute: GWK -> Pantai Melasti -> Sunset di Pura Uluwatu -> Dinner Jimbaran.',850000.00,1,1,2,1,NULL,'2026-09-09 22:07:28'),(5,'BFS-2026-001','Airport Transfer','Pick-Up','On Going','Smith Family','+61 412 345 678','smith.family@example.com','GA 881',2,2,NULL,17,20,NULL,'2026-09-10','09:30:00',NULL,450000.00,3,NULL,3,NULL,NULL,'2026-09-09 22:07:32'),(6,'BFS-2026-002','Hotel Transfer',NULL,'Assigned','John Doe','+1 555 123 4567','johndoe@example.com',NULL,2,1,10,12,NULL,NULL,'2026-09-10','11:00:00',NULL,350000.00,3,NULL,4,NULL,NULL,'2026-09-09 22:07:32'),(7,'BFS-2026-003','Day Tour',NULL,'Confirmed','Jackson Family Group','+44 7700 900077','jackson.uk@example.com',NULL,6,4,16,19,NULL,NULL,'2026-09-10','08:30:00',NULL,1400000.00,7,NULL,7,4,NULL,'2026-09-09 22:07:32'),(8,'BFS-2026-004','Airport Transfer','Drop-Off','Pending','Liam Wilson','+65 9123 4567','liam.sg@example.com','SQ 947',2,0,12,NULL,21,NULL,'2026-09-10','17:00:00',NULL,500000.00,5,NULL,NULL,NULL,NULL,'2026-09-09 22:07:32'),(9,'BFS-2026-005','Airport Transfer','Pick-Up','Completed','Emma Watson','+1 310 555 9988','emma.w@example.com','QF 43',3,1,NULL,14,20,NULL,'2026-09-08','14:00:00',NULL,300000.00,3,NULL,3,NULL,NULL,'2026-09-09 22:07:32'),(10,'BFS-2026-006','Hotel Transfer',NULL,'Assigned','Sophie Martin','+33 612 345 678','sophie.m@example.com',NULL,2,1,8,17,NULL,NULL,'2026-09-12','10:00:00',NULL,450000.00,3,5,5,NULL,NULL,'2026-09-09 22:07:32');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `child_seat_types`
--

DROP TABLE IF EXISTS `child_seat_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `child_seat_types` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `age_range` varchar(255) NOT NULL,
  `weight_range` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `child_seat_types`
--

LOCK TABLES `child_seat_types` WRITE;
/*!40000 ALTER TABLE `child_seat_types` DISABLE KEYS */;
INSERT INTO `child_seat_types` VALUES (1,'Infant Seat','0-1 tahun','0-13 kg',NULL,NULL),(2,'Booster Seat','4-10 tahun','15-36 kg',NULL,NULL),(3,'Infant Capsule (0-1 yr)','0-1 yr','0-9 kg','Rear facing capsule',NULL),(4,'Toddler Seat (1-4 yrs)','1-4 yrs','9-18 kg','Forward facing 5-point harness',NULL),(5,'Booster Seat (4-7 yrs)','4-7 yrs','15-36 kg','High back booster',NULL);
/*!40000 ALTER TABLE `child_seat_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drivers`
--

DROP TABLE IF EXISTS `drivers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drivers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `vehicle_unit_id` bigint(20) unsigned DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `whatsapp_number` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `license_number` varchar(255) NOT NULL,
  `license_expiry_date` date NOT NULL,
  `status` enum('Active','On Leave') NOT NULL DEFAULT 'Active',
  `is_online` tinyint(1) NOT NULL DEFAULT 0,
  `profile_photo_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `drivers_email_unique` (`email`),
  UNIQUE KEY `drivers_username_unique` (`username`),
  KEY `drivers_vehicle_unit_id_foreign` (`vehicle_unit_id`),
  CONSTRAINT `drivers_vehicle_unit_id_foreign` FOREIGN KEY (`vehicle_unit_id`) REFERENCES `vehicle_units` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drivers`
--

LOCK TABLES `drivers` WRITE;
/*!40000 ALTER TABLE `drivers` DISABLE KEYS */;
INSERT INTO `drivers` VALUES (1,1,'Wayan Arta','driver_bali','08123456789','driver@transport.com','$2y$12$Rlpf.0OOlgVARX6v75jTd.Ay/Z/mEVm/M5O.V/KppU4ky5nzPsivC','SIM-12345','2028-12-31','Active',0,NULL,'2026-09-09 22:07:27',NULL),(2,1,'Wayan Driver','driver_bfs','08123456789','driver@bfs.test','$2y$12$TzUl7GIKUxxHtb4jE65kPOaTh8MYYEJeBhBhm7mnz6mhwZUbclNN6','SIM-12345','2028-12-31','Active',0,NULL,'2026-09-09 22:07:28',NULL),(3,3,'Wayan Sudira',NULL,'081234567891','wayan@bfs.test','$2y$12$NyqWsi4371qXc5k0fq5O2.RWkPEF6ZdyCji5rWMiszF85hHRTsKRK','SIM-98711','2028-12-31','Active',0,NULL,'2026-09-09 22:07:28',NULL),(4,4,'Made Suartana',NULL,'081234567892','made@bfs.test','$2y$12$eKMzLcPTRgx9gKDXNCDNO.qENyGUcldwGYMWlWFeR1qW4wvHMl/HW','SIM-98712','2029-05-15','Active',0,NULL,'2026-09-09 22:07:29',NULL),(5,5,'Nyoman Arnawa',NULL,'081234567893','nyoman@bfs.test','$2y$12$OuWV1sOWs8Skd4M8an9SWeKSLM4DQHAeIb3AdmPd9Muey3UCCGAx6','SIM-98713','2027-08-20','Active',0,NULL,'2026-09-09 22:07:29',NULL),(6,6,'Ketut Arianta',NULL,'081234567894','ketut@bfs.test','$2y$12$unY0RTjHs8jqMj3d.6on3usqmz1uDdEekQA4r7h6ykqGLj9hNAvGa','SIM-98714','2028-02-10','Active',0,NULL,'2026-09-09 22:07:30',NULL),(7,7,'Putu Gede',NULL,'081234567895','putu@bfs.test','$2y$12$Fs6Lsff3sl9eEj26oagmfua6uM0Kj080XrbnuWSe3xZpcWfI2h5Zq','SIM-98715','2029-11-25','Active',0,NULL,'2026-09-09 22:07:31',NULL);
/*!40000 ALTER TABLE `drivers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faqs`
--

DROP TABLE IF EXISTS `faqs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faqs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `question` varchar(255) NOT NULL,
  `answer` text NOT NULL,
  `display_order` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faqs`
--

LOCK TABLES `faqs` WRITE;
/*!40000 ALTER TABLE `faqs` DISABLE KEYS */;
INSERT INTO `faqs` VALUES (1,'Kenapa wkwkw','Karena wkwkw',1);
/*!40000 ALTER TABLE `faqs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery_images`
--

DROP TABLE IF EXISTS `gallery_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gallery_images` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `display_order` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery_images`
--

LOCK TABLES `gallery_images` WRITE;
/*!40000 ALTER TABLE `gallery_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `gallery_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotel_airport`
--

DROP TABLE IF EXISTS `hotel_airport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotel_airport` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `hotel_id` bigint(20) unsigned NOT NULL,
  `airport_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `hotel_airport_hotel_id_foreign` (`hotel_id`),
  KEY `hotel_airport_airport_id_foreign` (`airport_id`),
  CONSTRAINT `hotel_airport_airport_id_foreign` FOREIGN KEY (`airport_id`) REFERENCES `airports` (`id`) ON DELETE CASCADE,
  CONSTRAINT `hotel_airport_hotel_id_foreign` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotel_airport`
--

LOCK TABLES `hotel_airport` WRITE;
/*!40000 ALTER TABLE `hotel_airport` DISABLE KEYS */;
INSERT INTO `hotel_airport` VALUES (1,1,1,NULL,NULL),(2,2,1,NULL,NULL),(3,1,2,NULL,NULL),(4,2,2,NULL,NULL),(5,3,3,NULL,NULL),(6,5,3,NULL,NULL),(7,4,4,NULL,NULL),(8,6,5,NULL,NULL),(9,7,5,NULL,NULL),(10,8,10,NULL,NULL),(11,8,11,NULL,NULL),(12,9,10,NULL,NULL),(13,9,11,NULL,NULL),(14,10,8,NULL,NULL),(15,10,9,NULL,NULL),(16,11,8,NULL,NULL),(17,11,9,NULL,NULL),(18,12,12,NULL,NULL),(19,12,13,NULL,NULL),(20,13,12,NULL,NULL),(21,13,13,NULL,NULL),(22,14,14,NULL,NULL),(23,14,15,NULL,NULL),(24,15,14,NULL,NULL),(25,15,15,NULL,NULL),(26,16,16,NULL,NULL),(27,16,17,NULL,NULL),(28,17,18,NULL,NULL),(29,17,19,NULL,NULL),(30,2,18,NULL,NULL),(31,2,19,NULL,NULL),(32,18,18,NULL,NULL),(33,18,19,NULL,NULL);
/*!40000 ALTER TABLE `hotel_airport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotel_transfer_price_lists`
--

DROP TABLE IF EXISTS `hotel_transfer_price_lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotel_transfer_price_lists` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `hotel_id_pickup` bigint(20) unsigned NOT NULL,
  `hotel_id_dropoff` bigint(20) unsigned NOT NULL,
  `regular_price` decimal(10,2) NOT NULL,
  `luxury_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `hotel_transfer_price_lists_hotel_id_pickup_foreign` (`hotel_id_pickup`),
  KEY `hotel_transfer_price_lists_hotel_id_dropoff_foreign` (`hotel_id_dropoff`),
  CONSTRAINT `hotel_transfer_price_lists_hotel_id_dropoff_foreign` FOREIGN KEY (`hotel_id_dropoff`) REFERENCES `hotels` (`id`),
  CONSTRAINT `hotel_transfer_price_lists_hotel_id_pickup_foreign` FOREIGN KEY (`hotel_id_pickup`) REFERENCES `hotels` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotel_transfer_price_lists`
--

LOCK TABLES `hotel_transfer_price_lists` WRITE;
/*!40000 ALTER TABLE `hotel_transfer_price_lists` DISABLE KEYS */;
INSERT INTO `hotel_transfer_price_lists` VALUES (1,1,3,400000.00,850000.00,'2026-09-09 22:07:26','2026-09-09 22:07:26'),(2,3,4,350000.00,700000.00,'2026-09-09 22:07:26','2026-09-09 22:07:26'),(3,2,6,450000.00,900000.00,'2026-09-09 22:07:26','2026-09-09 22:07:26'),(4,3,7,400000.00,800000.00,'2026-09-09 22:07:26','2026-09-09 22:07:26'),(5,8,17,450000.00,850000.00,'2026-09-09 22:07:31','2026-09-09 22:07:31'),(6,10,12,350000.00,650000.00,'2026-09-09 22:07:31','2026-09-09 22:07:31'),(7,14,17,500000.00,900000.00,'2026-09-09 22:07:31','2026-09-09 22:07:31'),(8,16,17,450000.00,800000.00,'2026-09-09 22:07:31','2026-09-09 22:07:31'),(9,8,10,300000.00,550000.00,'2026-09-09 22:07:31','2026-09-09 22:07:31'),(10,12,14,250000.00,500000.00,'2026-09-09 22:07:31','2026-09-09 22:07:31'),(11,2,14,500000.00,900000.00,'2026-09-09 22:07:31','2026-09-09 22:07:31'),(12,11,15,400000.00,750000.00,'2026-09-09 22:07:31','2026-09-09 22:07:31');
/*!40000 ALTER TABLE `hotel_transfer_price_lists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotels`
--

DROP TABLE IF EXISTS `hotels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotels` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nama_hotel` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotels`
--

LOCK TABLES `hotels` WRITE;
/*!40000 ALTER TABLE `hotels` DISABLE KEYS */;
INSERT INTO `hotels` VALUES (1,'The Kayon Jungle Resort, Ubud','2026-09-09 22:07:25','2026-09-09 22:07:25'),(2,'Padma Resort Ubud','2026-09-09 22:07:25','2026-09-09 22:07:25'),(3,'W Bali Seminyak','2026-09-09 22:07:25','2026-09-09 22:07:25'),(4,'Grand Hyatt Nusa Dua','2026-09-09 22:07:25','2026-09-09 22:07:25'),(5,'Alila Seminyak','2026-09-09 22:07:25','2026-09-09 22:07:25'),(6,'Ayana Resort Jimbaran','2026-09-09 22:07:26','2026-09-09 22:07:26'),(7,'Uluwatu Cliff Resort','2026-09-09 22:07:26','2026-09-09 22:07:26'),(8,'Maya Sanur Resort & Spa','2026-09-09 22:07:31','2026-09-09 22:07:31'),(9,'Andaz Bali - Sanur','2026-09-09 22:07:31','2026-09-09 22:07:31'),(10,'W Bali - Seminyak','2026-09-09 22:07:31','2026-09-09 22:07:31'),(11,'The Seminyak Beach Resort & Spa','2026-09-09 22:07:31','2026-09-09 22:07:31'),(12,'Grand Hyatt Bali - Nusa Dua','2026-09-09 22:07:31','2026-09-09 22:07:31'),(13,'The Mulia Bali','2026-09-09 22:07:31','2026-09-09 22:07:31'),(14,'AYANA Resort Bali - Jimbaran','2026-09-09 22:07:31','2026-09-09 22:07:31'),(15,'Bulgari Resort Bali - Uluwatu','2026-09-09 22:07:31','2026-09-09 22:07:31'),(16,'COMO Uma Canggu','2026-09-09 22:07:31','2026-09-09 22:07:31'),(17,'Mandapa, a Ritz-Carlton Reserve - Ubud','2026-09-09 22:07:31','2026-09-09 22:07:31'),(18,'Alila Ubud','2026-09-09 22:07:31','2026-09-09 22:07:31'),(19,'Ubud Cultural & Waterfall Tour','2026-09-09 22:07:32','2026-09-09 22:07:32');
/*!40000 ALTER TABLE `hotels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_sessions_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_09_01_051517_create_vehicles_table',1),(5,'2026_09_01_051518_create_admin_users_table',1),(6,'2026_09_01_051518_create_child_seat_types_table',1),(7,'2026_09_01_051519_create_services_table',1),(8,'2026_09_01_051519_create_site_features_table',1),(9,'2026_09_01_051519_create_site_settings_table',1),(10,'2026_09_01_051520_create_faqs_table',1),(11,'2026_09_01_051520_create_gallery_images_table',1),(12,'2026_09_01_051520_create_packages_table',1),(13,'2026_09_01_052216_create_vehicle_features_table',1),(14,'2026_09_01_052216_create_vehicle_units_table',1),(15,'2026_09_01_052217_create_package_highlights_table',1),(16,'2026_09_01_052217_create_service_features_table',1),(17,'2026_09_01_052218_create_drivers_table',1),(18,'2026_09_01_052218_create_package_tags_table',1),(19,'2026_09_01_052218_create_team_members_table',1),(20,'2026_09_01_052219_create_bookings_table',1),(21,'2026_09_01_052220_create_testimonials_table',1),(22,'2026_09_01_052220_create_trip_expenses_table',1),(23,'2026_09_01_052221_create_booking_child_seats_table',1),(24,'2026_09_04_000003_add_username_to_drivers_table',1),(25,'2026_09_08_000001_create_hotels_table',1),(26,'2026_09_08_000002_create_airports_table',1),(27,'2026_09_08_000003_create_hotel_airport_table',1),(28,'2026_09_08_000004_create_hotel_transfer_price_lists_table',1),(29,'2026_09_08_000005_add_pricing_columns_to_packages_table',1),(30,'2026_09_08_040131_set_default_duration_type_on_packages_table',1),(31,'2026_09_09_100005_alter_bookings_for_hotel_system',1),(32,'2026_09_09_100006_alter_packages_table',1),(33,'2026_09_09_100007_alter_trip_expenses_table',1),(34,'2026_09_09_100008_add_is_online_to_drivers_table',1),(35,'2026_09_10_064127_change_package_type_to_string_in_packages_table',2),(36,'2026_09_16_100000_add_is_approved_to_testimonials_table',2);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `package_highlights`
--

DROP TABLE IF EXISTS `package_highlights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `package_highlights` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `package_id` bigint(20) unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `display_order` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `package_highlights_package_id_foreign` (`package_id`),
  CONSTRAINT `package_highlights_package_id_foreign` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `package_highlights`
--

LOCK TABLES `package_highlights` WRITE;
/*!40000 ALTER TABLE `package_highlights` DISABLE KEYS */;
/*!40000 ALTER TABLE `package_highlights` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `package_tags`
--

DROP TABLE IF EXISTS `package_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `package_tags` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `package_id` bigint(20) unsigned NOT NULL,
  `tag_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `package_tags_package_id_foreign` (`package_id`),
  CONSTRAINT `package_tags_package_id_foreign` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `package_tags`
--

LOCK TABLES `package_tags` WRITE;
/*!40000 ALTER TABLE `package_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `package_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `packages`
--

DROP TABLE IF EXISTS `packages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `packages` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `hero_image` varchar(255) DEFAULT NULL,
  `package_type` varchar(100) DEFAULT NULL,
  `duration_type` enum('Half Day','Full Day') NOT NULL DEFAULT 'Full Day',
  `regular_price` decimal(10,2) DEFAULT NULL,
  `luxury_price` decimal(10,2) DEFAULT NULL,
  `big_van_price` decimal(10,2) DEFAULT NULL,
  `display_order` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `packages_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `packages`
--

LOCK TABLES `packages` WRITE;
/*!40000 ALTER TABLE `packages` DISABLE KEYS */;
INSERT INTO `packages` VALUES (1,'Ubud Day Tour','ubud-day-tour','Sawah, air terjun, dan budaya Ubud',NULL,NULL,'Ubud','Full Day',750000.00,1400000.00,1200000.00,1,'2026-09-09 22:07:26'),(2,'South Bali Sunset Tour','south-bali-sunset-tour','Pantai Melasti, Pura Uluwatu, dan Dinner Jimbaran',NULL,NULL,'South Bali','Half Day',650000.00,1250000.00,1050000.00,2,'2026-09-09 22:07:26'),(3,'East Bali Heritage Tour','east-bali-heritage-tour','Gerbang Surga Lempuyang dan Tirta Gangga',NULL,NULL,'East Bali','Full Day',850000.00,1550000.00,1350000.00,3,'2026-09-09 22:07:26'),(4,'Ubud Cultural & Waterfall Tour','ubud-cultural-waterfall-tour','Tegalalang rice terrace, Monkey Forest, and Tegenungan waterfall',NULL,NULL,'Ubud','Full Day',950000.00,1600000.00,1400000.00,1,'2026-09-09 22:07:26'),(5,'Bedugul & Tanah Lot Sunset Tour','bedugul-tanah-lot-sunset-tour','Ulun Danu Beratan temple, Handara Gate, and iconic Tanah Lot sunset',NULL,NULL,'Ubud','Full Day',1000000.00,1750000.00,1500000.00,2,'2026-09-09 22:07:26'),(6,'Uluwatu Cliff & Kecak Dance Tour','uluwatu-cliff-kecak-dance-tour','Padang Padang beach, dramatic cliff temple, and sunset Kecak dance',NULL,NULL,'South Bali','Half Day',600000.00,1100000.00,950000.00,3,'2026-09-09 22:07:26'),(7,'Denpasar Heritage & Food Tour','denpasar-heritage-food-tour','Bajra Sandhi monument, Badung traditional market, and authentic Balinese culinary',NULL,NULL,'South Bali','Half Day',500000.00,950000.00,850000.00,4,'2026-09-09 22:07:26'),(8,'East Bali & Lempuyang Temple Tour','east-bali-lempuyang-temple-tour','Gate of Heaven Lempuyang, Tirta Gangga water palace, and Virgin Beach',NULL,NULL,'East Bali','Full Day',1200000.00,2000000.00,1800000.00,8,'2026-09-09 22:07:26');
/*!40000 ALTER TABLE `packages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_features`
--

DROP TABLE IF EXISTS `service_features`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_features` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `service_id` bigint(20) unsigned NOT NULL,
  `feature_text` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `service_features_service_id_foreign` (`service_id`),
  CONSTRAINT `service_features_service_id_foreign` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_features`
--

LOCK TABLES `service_features` WRITE;
/*!40000 ALTER TABLE `service_features` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_features` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `short_description` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `long_description` text DEFAULT NULL,
  `display_order` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'Airport Transfer',NULL,NULL,'Jemput & antar bandara tepat waktu','transfer',NULL,1);
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('cOWMKzSlHedtFARN0illQBse1u94aDD09fCKNwz0',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiRWxaVlZVYnhqd1ZTeTczWHBETWI1QnhjZnhDdnpHZFEwREJGRWdwOSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcHJpY2luZy9ob3RlbHMiO3M6NToicm91dGUiO3M6MTQ6InByaWNpbmcuaG90ZWxzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1790064634),('fu1n7tA9M0qepe42ZBMuz6C7iLQm8uhQYwj0AJKI',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','YTo0OntzOjY6Il90b2tlbiI7czo0MDoiVXhhU2VhdHkwS1dDeEM2Y294QlZqaWtsSjdkNlQwcDdEUkpLZnlFaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7czo0OiJob21lIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MjoibG9naW5fYWRtaW5fNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxO30=',1789543808),('nJHZFZ9Q0aP3OL80mVxMeQN3V3K7MZ30yjOWDGrT',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiSXdZU1VZR0RORHpmNkdpNER6cXVEUExDbjRkTUJlYTZzTFdDZ2JHViI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvcHJpY2luZy9ob3RlbHMiO3M6NToicm91dGUiO3M6MTQ6InByaWNpbmcuaG90ZWxzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1789632766),('O6AwewkwSX5PSgtPDqgMGNy57B4Ndol543SLEZNb',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiWnJBTE55TUhPeWxyY1p4MExKaFZhaEdjZ3diUVVxMTFPdjY1MEJheSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcHJpY2luZy9ob3RlbHMiO3M6NToicm91dGUiO3M6MTQ6InByaWNpbmcuaG90ZWxzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1790320927);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_features`
--

DROP TABLE IF EXISTS `site_features`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_features` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `section` varchar(255) NOT NULL,
  `display_order` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_features`
--

LOCK TABLES `site_features` WRITE;
/*!40000 ALTER TABLE `site_features` DISABLE KEYS */;
/*!40000 ALTER TABLE `site_features` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_settings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `hero_headline` varchar(255) DEFAULT NULL,
  `hero_subheadline` varchar(255) DEFAULT NULL,
  `hero_background_image` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `whatsapp_number` varchar(255) DEFAULT NULL,
  `instagram_url` varchar(255) DEFAULT NULL,
  `facebook_url` varchar(255) DEFAULT NULL,
  `google_maps_embed` text DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_settings`
--

LOCK TABLES `site_settings` WRITE;
/*!40000 ALTER TABLE `site_settings` DISABLE KEYS */;
INSERT INTO `site_settings` VALUES (1,'Family-Safe Tours Around Bali',NULL,NULL,'hello@balifamilysafe.test','628123456789',NULL,NULL,NULL,'2026-09-09 22:07:26');
/*!40000 ALTER TABLE `site_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_members`
--

DROP TABLE IF EXISTS `team_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_members` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `driver_id` bigint(20) unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `role_title` varchar(255) NOT NULL,
  `bio` text DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `years_experience` varchar(255) DEFAULT NULL,
  `languages` varchar(255) DEFAULT NULL,
  `specialty_route` varchar(255) DEFAULT NULL,
  `is_founder` tinyint(1) NOT NULL DEFAULT 0,
  `display_order` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `team_members_driver_id_foreign` (`driver_id`),
  CONSTRAINT `team_members_driver_id_foreign` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_members`
--

LOCK TABLES `team_members` WRITE;
/*!40000 ALTER TABLE `team_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `team_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testimonials`
--

DROP TABLE IF EXISTS `testimonials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `testimonials` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `booking_id` bigint(20) unsigned DEFAULT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_origin` varchar(255) DEFAULT NULL,
  `rating` tinyint(3) unsigned NOT NULL,
  `quote` text NOT NULL,
  `is_approved` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `testimonials_booking_id_foreign` (`booking_id`),
  CONSTRAINT `testimonials_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testimonials`
--

LOCK TABLES `testimonials` WRITE;
/*!40000 ALTER TABLE `testimonials` DISABLE KEYS */;
/*!40000 ALTER TABLE `testimonials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trip_expenses`
--

DROP TABLE IF EXISTS `trip_expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trip_expenses` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `booking_id` bigint(20) unsigned NOT NULL,
  `driver_id` bigint(20) unsigned NOT NULL,
  `expense_name` varchar(255) NOT NULL,
  `expense_type` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `receipt_photo_url` varchar(255) DEFAULT NULL,
  `receipt_path` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `trip_expenses_driver_id_foreign` (`driver_id`),
  KEY `trip_expenses_booking_id_foreign` (`booking_id`),
  CONSTRAINT `trip_expenses_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `trip_expenses_driver_id_foreign` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trip_expenses`
--

LOCK TABLES `trip_expenses` WRITE;
/*!40000 ALTER TABLE `trip_expenses` DISABLE KEYS */;
INSERT INTO `trip_expenses` VALUES (1,1,1,'Airport Parking & Toll','Parking & Toll',50000.00,NULL,NULL,'Parkir bandara kedatangan internasional + Tol Bali Mandara','2026-09-09 22:07:28','2026-09-09 22:07:28'),(2,2,1,'BBM Pertamax','Fuel',250000.00,NULL,NULL,'Isi BBM Pertamax SPBU Sunset Road','2026-09-09 22:07:28','2026-09-09 22:07:28'),(3,3,2,'Airport Parking & Toll','Parking & Toll',50000.00,NULL,NULL,'Parkir bandara kedatangan internasional + Tol Bali Mandara','2026-09-09 22:07:28','2026-09-09 22:07:28'),(4,4,2,'BBM Pertamax','Fuel',250000.00,NULL,NULL,'Isi BBM Pertamax SPBU Sunset Road','2026-09-09 22:07:28','2026-09-09 22:07:28'),(5,9,3,'BBM & Tol Bali Mandara',NULL,125000.00,NULL,NULL,NULL,'2026-09-09 22:07:32','2026-09-09 22:07:32');
/*!40000 ALTER TABLE `trip_expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle_features`
--

DROP TABLE IF EXISTS `vehicle_features`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle_features` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `vehicle_id` bigint(20) unsigned NOT NULL,
  `feature_type` enum('specification','amenity') NOT NULL,
  `label` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `vehicle_features_vehicle_id_foreign` (`vehicle_id`),
  CONSTRAINT `vehicle_features_vehicle_id_foreign` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle_features`
--

LOCK TABLES `vehicle_features` WRITE;
/*!40000 ALTER TABLE `vehicle_features` DISABLE KEYS */;
INSERT INTO `vehicle_features` VALUES (1,1,'amenity','AC'),(2,2,'amenity','AC');
/*!40000 ALTER TABLE `vehicle_features` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle_units`
--

DROP TABLE IF EXISTS `vehicle_units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle_units` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `vehicle_id` bigint(20) unsigned NOT NULL,
  `plate_number` varchar(255) NOT NULL,
  `status` enum('Available','In Use','Maintenance') NOT NULL DEFAULT 'Available',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `vehicle_units_vehicle_id_foreign` (`vehicle_id`),
  CONSTRAINT `vehicle_units_vehicle_id_foreign` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle_units`
--

LOCK TABLES `vehicle_units` WRITE;
/*!40000 ALTER TABLE `vehicle_units` DISABLE KEYS */;
INSERT INTO `vehicle_units` VALUES (1,1,'DK 5294 XX','Available','2026-09-09 22:07:26',NULL),(2,2,'DK 8237 XX','Available','2026-09-09 22:07:26',NULL),(3,3,'DK 1822 AB','Available','2026-09-09 22:07:28',NULL),(4,6,'DK 2455 BC','Available','2026-09-09 22:07:28',NULL),(5,5,'DK 3990 CD','Available','2026-09-09 22:07:28',NULL),(6,4,'DK 7781 DE','Available','2026-09-09 22:07:28',NULL),(7,7,'DK 8892 EF','Available','2026-09-09 22:07:28',NULL);
/*!40000 ALTER TABLE `vehicle_units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `category` enum('Regular Family SUV','Luxury Touring Van','Family Minibus') NOT NULL,
  `name` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `daily_rate` decimal(10,2) NOT NULL,
  `passenger_capacity` int(10) unsigned NOT NULL,
  `luggage_capacity` int(10) unsigned NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `is_popular` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
INSERT INTO `vehicles` VALUES (1,'Regular Family SUV','Toyota Fortuner','2023',800000.00,6,4,NULL,1,'2026-09-09 22:07:26','2026-09-09 22:07:26',NULL),(2,'Luxury Touring Van','Toyota Alphard','2023',1500000.00,6,5,NULL,1,'2026-09-09 22:07:26','2026-09-09 22:07:26',NULL),(3,'Regular Family SUV','Toyota Innova Zenix','2024',750000.00,6,4,NULL,1,'2026-09-09 22:07:28','2026-09-09 22:07:28',NULL),(4,'Regular Family SUV','Toyota Fortuner VRZ','2023',850000.00,6,4,NULL,0,'2026-09-09 22:07:28','2026-09-09 22:07:28',NULL),(5,'Luxury Touring Van','Toyota Alphard VIP','2024',2000000.00,5,5,NULL,1,'2026-09-09 22:07:28','2026-09-09 22:07:28',NULL),(6,'Luxury Touring Van','Toyota HiAce Premio Luxury','2024',1400000.00,8,6,NULL,0,'2026-09-09 22:07:28','2026-09-09 22:07:28',NULL),(7,'Family Minibus','Toyota HiAce Commuter (Big Van)','2023',1200000.00,12,10,NULL,1,'2026-09-09 22:07:28','2026-09-09 22:07:28',NULL);
/*!40000 ALTER TABLE `vehicles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-28 13:59:27
