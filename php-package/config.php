<?php
/**
 * منظومة مدرستي الذكية (DigiClasse)
 * ملف الإعدادات والربط مع قاعدة البيانات و WhatsApp Cloud API
 */

// إعدادات الاتصال بقاعدة بيانات MySQL
define('DB_HOST', 'localhost');
define('DB_NAME', 'digiclasse_school_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// إعدادات المنظومة
define('APP_NAME', 'مدرستي الذكية - DigiClasse');
define('APP_URL', 'https://ecole.digiclasse.com');
define('TIMEZONE', 'Africa/Casablanca');
date_default_timezone_set(TIMEZONE);

// إعدادات WhatsApp Cloud API الرسمية (Meta Developer)
define('WHATSAPP_API_VERSION', 'v19.0');
define('WHATSAPP_PHONE_NUMBER_ID', 'YOUR_PHONE_NUMBER_ID');
define('WHATSAPP_ACCESS_TOKEN', 'YOUR_PERMANENT_ACCESS_TOKEN');
define('WHATSAPP_API_URL', 'https://graph.facebook.com/' . WHATSAPP_API_VERSION . '/' . WHATSAPP_PHONE_NUMBER_ID . '/messages');

/**
 * دالة إنشاء اتصال آمن PDO مع قاعدة البيانات
 */
function getDbConnection() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (\PDOException $e) {
            die(json_encode([
                'success' => false,
                'error' => 'تعذر الاتصال بقاعدة البيانات: ' . $e->getMessage()
            ], JSON_UNESCAPED_UNICODE));
        }
    }
    return $pdo;
}
