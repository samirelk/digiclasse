-- ========================================================
-- منظومة مدرستي الذكية - DigiClasse.com
-- قاعدة بيانات تدبير المقاعد، الغياب بالدقائق، وإشعارات واتساب
-- المتطلبات: MySQL 5.7+ أو MariaDB 10.3+ / PHP 8.1+
-- الترميز: utf8mb4_unicode_ci
-- ========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. جدول إعدادات المؤسسة والربط السحابي
CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `school_name` VARCHAR(255) NOT NULL,
  `school_code` VARCHAR(50) DEFAULT NULL,
  `subdomain` VARCHAR(100) DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT 'الناضور',
  `directorate` VARCHAR(150) DEFAULT NULL,
  `director_name` VARCHAR(150) DEFAULT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `whatsapp_business_phone` VARCHAR(30) DEFAULT NULL,
  `whatsapp_token` TEXT DEFAULT NULL,
  `whatsapp_phone_number_id` VARCHAR(100) DEFAULT NULL,
  `whatsapp_template_name` VARCHAR(100) DEFAULT 'absence_notification',
  `academic_year` VARCHAR(20) DEFAULT '2024-2025',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. جدول المستخدمين (المدير، الحراس العامون، الأساتذة)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(60) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `role` ENUM('admin', 'general_supervisor', 'teacher', 'staff') NOT NULL DEFAULT 'general_supervisor',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `last_login` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. جدول الأقسام والمستويات الدراسية
CREATE TABLE IF NOT EXISTS `classrooms` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `level` ENUM('ابتدائي', 'إعدادي', 'تأهيلي', 'مشترك') NOT NULL DEFAULT 'إعدادي',
  `room_number` VARCHAR(50) DEFAULT 'القاعة 1',
  `capacity` INT DEFAULT 36,
  `grid_rows` INT DEFAULT 6,
  `grid_cols` INT DEFAULT 6,
  `academic_year` VARCHAR(20) DEFAULT '2024-2025',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. جدول التلاميذ
CREATE TABLE IF NOT EXISTS `students` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `massar_code` VARCHAR(20) NOT NULL UNIQUE,
  `full_name` VARCHAR(150) NOT NULL,
  `classroom_id` INT NOT NULL,
  `gender` ENUM('ذكر', 'أنثى') NOT NULL DEFAULT 'ذكر',
  `birth_date` DATE DEFAULT NULL,
  `guardian_name` VARCHAR(150) NOT NULL,
  `guardian_relation` VARCHAR(50) DEFAULT 'الأب',
  `guardian_phone` VARCHAR(30) NOT NULL,
  `guardian_whatsapp` VARCHAR(30) NOT NULL,
  `seat_row` INT DEFAULT NULL,
  `seat_col` INT DEFAULT NULL,
  `status` ENUM('متمدرس', 'مفصول', 'منتقل') NOT NULL DEFAULT 'متمدرس',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`classroom_id`) REFERENCES `classrooms`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. جدول الحصص والمواد والأساتذة
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `classroom_id` INT NOT NULL,
  `teacher_id` INT DEFAULT NULL,
  `subject_name` VARCHAR(100) NOT NULL,
  `session_date` DATE NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`classroom_id`) REFERENCES `classrooms`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`teacher_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. جدول تسجيل الغياب والتأخر بالدقائق
CREATE TABLE IF NOT EXISTS `attendances` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `session_id` INT DEFAULT NULL,
  `recorded_by_user_id` INT DEFAULT NULL,
  `date` DATE NOT NULL,
  `type` ENUM('غياب_كامل', 'تأخر_بالدقائق', 'مغادرة_مبكرة') NOT NULL DEFAULT 'غياب_كامل',
  `delay_minutes` INT DEFAULT 0,
  `is_justified` BOOLEAN DEFAULT FALSE,
  `justification_reason` TEXT DEFAULT NULL,
  `justification_date` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`recorded_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. جدول إشعارات واتساب السحابية وسجل التسليم (WhatsApp Cloud API Logs)
CREATE TABLE IF NOT EXISTS `whatsapp_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `attendance_id` INT NOT NULL,
  `recipient_phone` VARCHAR(30) NOT NULL,
  `message_text` TEXT NOT NULL,
  `whatsapp_message_id` VARCHAR(100) DEFAULT NULL,
  `status` ENUM('pending', 'sent', 'delivered', 'read', 'failed') NOT NULL DEFAULT 'pending',
  `error_details` TEXT DEFAULT NULL,
  `sent_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `delivered_at` DATETIME DEFAULT NULL,
  `read_at` DATETIME DEFAULT NULL,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`attendance_id`) REFERENCES `attendances`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- إدخال مستخدم المدير الافتراضي (كلمة المرور: admin123)
-- كلمة المرور مشفرة بواسطة bcrypt
INSERT INTO `users` (`username`, `password_hash`, `full_name`, `role`, `status`)
VALUES ('admin', '$2y$10$e84Yd6fU0hP8YyH3Lzq8k.4X8r9V3sY6Fw6E2Q1T7m5P4k3L2J9uG', 'مدير المؤسسة', 'admin', 'active')
ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);

SET FOREIGN_KEY_CHECKS = 1;
