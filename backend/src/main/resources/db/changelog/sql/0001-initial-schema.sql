--liquibase formatted sql
--changeset codex:0001-initial-schema
SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE `attendance` (
  `attendance_record_id` varchar(255) NOT NULL,
  `actual_end_time` datetime(6) DEFAULT NULL,
  `actual_start_time` datetime(6) DEFAULT NULL,
  `attendance` varchar(255) DEFAULT NULL,
  `date` date NOT NULL,
  `lc_early_clockout_mins` bigint DEFAULT NULL,
  `lc_late_clockin_mins` bigint DEFAULT NULL,
  `lc_mins` bigint DEFAULT NULL,
  `ot_early_clockin_mins` bigint DEFAULT NULL,
  `ot_late_clockout_mins` bigint DEFAULT NULL,
  `ot_mins` bigint DEFAULT NULL,
  `work_mins` bigint DEFAULT NULL,
  `employee_id` bigint DEFAULT NULL,
  `shift_id` bigint DEFAULT NULL,
  PRIMARY KEY (`attendance_record_id`),
  KEY `FKr7q0h8jfngkyybll6o9r3h9ua` (`employee_id`),
  KEY `FK9gmenkx8eh7vy88vybmrbdyb4` (`shift_id`),
  CONSTRAINT `FK9gmenkx8eh7vy88vybmrbdyb4` FOREIGN KEY (`shift_id`) REFERENCES `shift` (`shift_id`),
  CONSTRAINT `FKr7q0h8jfngkyybll6o9r3h9ua` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `department` (
  `department_id` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  `system_name` varchar(255) NOT NULL,
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `department_shift` (
  `department_shift_recode_id` bigint NOT NULL AUTO_INCREMENT,
  `department_id` bigint NOT NULL,
  `shift_id` bigint NOT NULL,
  PRIMARY KEY (`department_shift_recode_id`),
  KEY `fk_department_shift_department` (`department_id`),
  KEY `fk_department_shift_shift` (`shift_id`),
  CONSTRAINT `fk_department_shift_department` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`),
  CONSTRAINT `fk_department_shift_shift` FOREIGN KEY (`shift_id`) REFERENCES `shift` (`shift_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `employee` (
  `employee_id` bigint NOT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `employee_type` enum('PERMANENT','TEMPORARY') NOT NULL,
  `epf_no` bigint DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `joining_date` date DEFAULT NULL,
  `nic_no` varchar(255) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `short_name` varchar(255) NOT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL,
  `department_id` bigint DEFAULT NULL,
  PRIMARY KEY (`employee_id`),
  UNIQUE KEY `UKoidskighbi7noak5np2orc6k1` (`short_name`),
  KEY `FKbejtwvg9bxus2mffsm3swj3u9` (`department_id`),
  CONSTRAINT `FKbejtwvg9bxus2mffsm3swj3u9` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `employee_monthly_leave_usage` (
  `leave_usage_id` varchar(255) NOT NULL,
  `ab_on_public_holiday` bigint DEFAULT NULL,
  `annual_leaves` bigint DEFAULT NULL,
  `casual` bigint DEFAULT NULL,
  `leave_approval` bit(1) DEFAULT NULL,
  `medical` bigint DEFAULT NULL,
  `month` varchar(255) NOT NULL,
  `monthly_mandatory_leaves` bigint DEFAULT NULL,
  `no_pay_leaves` double DEFAULT NULL,
  `other` bigint DEFAULT NULL,
  `year` varchar(255) NOT NULL,
  `employee_id` bigint DEFAULT NULL,
  PRIMARY KEY (`leave_usage_id`),
  KEY `FKd2iacbf6ntp0gbhksn3842328` (`employee_id`),
  CONSTRAINT `FKd2iacbf6ntp0gbhksn3842328` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `employee_yearly_leave_eligibility` (
  `leave_record_id` varchar(255) NOT NULL,
  `annual` bigint DEFAULT NULL,
  `casual` bigint DEFAULT NULL,
  `medical` bigint DEFAULT NULL,
  `year` varchar(255) NOT NULL,
  `employee_id` bigint DEFAULT NULL,
  PRIMARY KEY (`leave_record_id`),
  KEY `FKhal8xssnp91xgkxs38nvlvsbj` (`employee_id`),
  CONSTRAINT `FKhal8xssnp91xgkxs38nvlvsbj` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `holiday_calendar` (
  `holiday_date` date NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `mandatory_holiday` bit(1) NOT NULL,
  PRIMARY KEY (`holiday_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `monthly_full_salary` (
  `monthly_full_salary_record_id` varchar(255) NOT NULL,
  `arrears` double DEFAULT NULL,
  `attendance_allowance` double DEFAULT NULL,
  `basic` double DEFAULT NULL,
  `bonus` double DEFAULT NULL,
  `epf_company_amount` double DEFAULT NULL,
  `epf_employee_amount` double DEFAULT NULL,
  `epf_total` double DEFAULT NULL,
  `etf_company_amount` double DEFAULT NULL,
  `food_bill` double DEFAULT NULL,
  `gross_pay` double DEFAULT NULL,
  `incentives` double DEFAULT NULL,
  `late_charges` double DEFAULT NULL,
  `month` varchar(255) NOT NULL,
  `month_encouragement_allowance` double DEFAULT NULL,
  `net_salary` double DEFAULT NULL,
  `no_pay_amount` double DEFAULT NULL,
  `ot_1` double DEFAULT NULL,
  `ot_2` double DEFAULT NULL,
  `other_deductions` double DEFAULT NULL,
  `performance_allowance` double DEFAULT NULL,
  `salary_advance` double DEFAULT NULL,
  `total_allowance` double DEFAULT NULL,
  `total_deduction` double DEFAULT NULL,
  `total_for_epf` double DEFAULT NULL,
  `total_monthly_salary` double DEFAULT NULL,
  `transport_allowance` double DEFAULT NULL,
  `year` varchar(255) NOT NULL,
  `employee_id` bigint NOT NULL,
  PRIMARY KEY (`monthly_full_salary_record_id`),
  KEY `FKfbwdfqrxewdrgh21nl9gs1ftp` (`employee_id`),
  CONSTRAINT `FKfbwdfqrxewdrgh21nl9gs1ftp` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `monthly_salary_updates` (
  `monthly_salary_updates_record_id` varchar(255) NOT NULL,
  `arrears` double DEFAULT NULL,
  `bonus` double DEFAULT NULL,
  `food_bill` double DEFAULT NULL,
  `incentives` double DEFAULT NULL,
  `month` varchar(255) NOT NULL,
  `month_encouragement_allowance` double DEFAULT NULL,
  `other_deductions` double DEFAULT NULL,
  `salary_advance` double DEFAULT NULL,
  `year` varchar(255) NOT NULL,
  `employee_id` bigint NOT NULL,
  PRIMARY KEY (`monthly_salary_updates_record_id`),
  KEY `FKi7m2ycbdiohnp8rs7glla76m8` (`employee_id`),
  CONSTRAINT `FKi7m2ycbdiohnp8rs7glla76m8` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `overwritten_attendance_status` (
  `attendance_record_id` varchar(255) NOT NULL,
  `updated_attendance_status` varchar(255) DEFAULT NULL,
  `updated_lc_early_clockout_mins` bigint DEFAULT NULL,
  `updated_lc_late_clockin_mins` bigint DEFAULT NULL,
  `updated_ot_early_clockin_mins` bigint DEFAULT NULL,
  `updated_ot_late_clockout_mins` bigint DEFAULT NULL,
  `updated_total_lc_mins` bigint DEFAULT NULL,
  `updated_total_ot_mins` bigint DEFAULT NULL,
  PRIMARY KEY (`attendance_record_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `overwritten_monthly_attendance_summary` (
  `overwritten_monthly_attendance_record_id` varchar(255) NOT NULL,
  `adjusted_late_time` double DEFAULT NULL,
  `adjusted_ot_hours` double DEFAULT NULL,
  `month` varchar(255) NOT NULL,
  `year` varchar(255) NOT NULL,
  `employee_id` bigint DEFAULT NULL,
  PRIMARY KEY (`overwritten_monthly_attendance_record_id`),
  KEY `FKbeb07892nf369dymfwne9cvj1` (`employee_id`),
  CONSTRAINT `FKbeb07892nf369dymfwne9cvj1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `salary_attendance_portion` (
  `salary_attendance_portion_recode_id` bigint NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`salary_attendance_portion_recode_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `salary_base` (
  `salary_base_recode_id` bigint NOT NULL AUTO_INCREMENT,
  `attendance_allowance` double DEFAULT NULL,
  `basic_salary` double DEFAULT NULL,
  `compulsory_ot_1_amount_per_day` double DEFAULT NULL,
  `compulsory_ot_1_hours_per_day` double DEFAULT NULL,
  `encouragement_allowance` double DEFAULT NULL,
  `late_charges_per_min` double DEFAULT NULL,
  `monthly_total` double DEFAULT NULL,
  `ot_1_per_hour` double DEFAULT NULL,
  `ot_1_rate` double DEFAULT NULL,
  `ot_2_rate` double DEFAULT NULL,
  `ot_2_sat_full_day` double DEFAULT NULL,
  `performance_allowance` double DEFAULT NULL,
  `transport_allowance` double DEFAULT NULL,
  `working_hours` double DEFAULT NULL,
  `employee_id` bigint DEFAULT NULL,
  PRIMARY KEY (`salary_base_recode_id`),
  UNIQUE KEY `UKsa3yci6bn9ipsdv29gmbnfiay` (`employee_id`),
  CONSTRAINT `FK3pbijoiv3c7rwcny4da0eco8i` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salary_base`
--

LOCK TABLES `salary_base` WRITE;
/*!40000 ALTER TABLE `salary_base` DISABLE KEYS */;
INSERT INTO `salary_base` VALUES (27,0,0,0,0,NULL,0,120000,0,1.5,0,0,120000,0,240,1),(28,0,0,0,0,NULL,0,78000,0,0,1.5,0,0,3000,240,3),(29,350,17000,318.75,3,NULL,1.18,49999.6,106.25,1.5,1.5,318.75,10000,215.85,240,5),(30,830,23000,0,0,NULL,1.6,57999.64,191.67,2,1.5,431.25,0,516.14,240,6),(31,300,20000,0,0,NULL,1.39,39000,166.67,2,1.5,375,7300,150,240,8),(32,400,16000,0,0,NULL,1.11,33000.48,133.33,2,1.5,300,3000,138.48,240,10),(33,153.85,16000,0,0,NULL,1.11,20000.1,100,1.5,0,0,0,0,240,11),(34,181.25,17000,318.75,3,NULL,1.18,35000,106.25,1.5,1.5,318.75,5000,0,240,12),(35,146.15,16000,0,0,NULL,1.11,27999.9,113.33,1.7,0,0,3000,200,240,13),(36,100,16000,0,0,NULL,1.11,20000.1,113.33,1.7,0,0,0,53.85,240,14),(37,200,16000,0,0,NULL,1.11,29999.56,113.33,1.7,1.5,300,3000,223.06,240,15),(38,153.85,16000,0,0,NULL,1.11,25000.1,113.33,1.7,0,0,5000,0,240,16),(39,153.85,16000,0,0,NULL,1.11,25000.1,113.33,1.7,0,0,5000,0,240,17),(40,350,17000,318.75,3,NULL,1.18,44999.6,106.25,1.5,1.5,318.75,5000,215.85,240,19),(41,350,16000,0,0,NULL,1.11,40000,0,0,0,0,4500,400,240,20),(42,150,16000,0,NULL,NULL,1.11,27000,0,NULL,1.5,300,4500,100,240,21),(43,400,16000,0,0,NULL,1.11,32000.48,0,0,1.5,300,2000,138.48,240,22),(44,0,0,0,0,NULL,0,33800,0,0,0,0,0,1300,240,23),(45,400,17000,63.75,0.5,NULL,1.42,39499.7,127.5,1.5,1.5,382.5,2000,324.7,200,24),(46,0,0,0,0,NULL,0,33800,0,0,0,0,0,1300,240,26),(47,0,0,0,0,NULL,0,33800,0,0,0,0,0,1300,240,27),(48,450,16000,0,0,NULL,1.11,40960,0,0,0,0,0,510,240,28),(49,153.85,16000,0,0,NULL,1.11,20000.1,100,1.5,0,0,0,0,240,29),(50,830,20000,0,0,NULL,1.39,54999.64,166.67,2,0,0,0,516.14,240,9);
/*!40000 ALTER TABLE `salary_base` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salary_payment`
--

DROP TABLE IF EXISTS `salary_payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salary_payment` (
  `salary_payment_recode_id` bigint NOT NULL AUTO_INCREMENT,
  `count_100` bigint DEFAULT NULL,
  `count_1000` bigint DEFAULT NULL,
  `count_20` bigint DEFAULT NULL,
  `count_50` bigint DEFAULT NULL,
  `count_500` bigint DEFAULT NULL,
  `count_5000` bigint DEFAULT NULL,
  `paid` bit(1) DEFAULT NULL,
  `monthly_full_salary_record_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`salary_payment_recode_id`),
  UNIQUE KEY `UKfr0pcp240uwooh4wmxrmm0s1a` (`monthly_full_salary_record_id`),
  CONSTRAINT `FK4ymk064lnfw1um8v7nxjvh6fd` FOREIGN KEY (`monthly_full_salary_record_id`) REFERENCES `monthly_full_salary` (`monthly_full_salary_record_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `shift` (
  `shift_id` bigint NOT NULL,
  `end_time` time(6) NOT NULL,
  `shift_period` enum('EVENING','MORNING') NOT NULL,
  `shift_type` varchar(255) NOT NULL,
  `start_time` time(6) NOT NULL,
  `department_id` bigint NOT NULL,
  PRIMARY KEY (`shift_id`),
  KEY `FKaov3qiu87c73ejh7bcsyd46sv` (`department_id`),
  CONSTRAINT `FKaov3qiu87c73ejh7bcsyd46sv` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS=1;
