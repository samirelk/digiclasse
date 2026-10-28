<?php
/**
 * منظومة مدرستي الذكية - وحدة إرسال إشعارات واتساب السحابية
 * WhatsApp Cloud API (Meta) - PHP 8.1+
 */

require_once __DIR__ . '/config.php';

/**
 * إرسال إشعار فوري لولي أمر التلميذ عبر WhatsApp Cloud API
 *
 * @param string $guardianPhone رقم هاتف ولي الأمر (بالصيغة الدولية مثل 2126XXXXXXXX)
 * @param string $studentName اسم التلميذ
 * @param string $type نوع الغياب أو التأخر
 * @param int $delayMinutes عدد دقائق التأخر (إن وجد)
 * @param string $date تاريخ التسجيل
 * @return array نتيجة الإرسال
 */
function sendAbsenceWhatsAppNotification($guardianPhone, $studentName, $type, $delayMinutes = 0, $date = null) {
    if (!$date) {
        $date = date('Y-m-d H:i');
    }

    // تنظيف رقم الهاتف وإضافة الرمز الدولي المغربي إن لزم الأمر
    $phone = preg_replace('/[^0-9]/', '', $guardianPhone);
    if (str_starts_with($phone, '0')) {
        $phone = '212' . substr($phone, 1);
    }

    $messageBody = "السلام عليكم ورحمة الله وبركاته،\n";
    $messageBody .= "إشعار إداري عاجل من الحراسة العامة لمؤسستكم التعليمية:\n";
    $messageBody .= "نحيطكم علماً بأن التلميذ(ة): *{$studentName}*\n";

    if ($type === 'تأخر_بالدقائق') {
        $messageBody .= "قد التحق بالفصل متأخراً بـ: *{$delayMinutes} دقيقة*\n";
    } else {
        $messageBody .= "سُجلت له حالة: *غياب غير مبرر*\n";
    }

    $messageBody .= "التاريخ والتوقيت: {$date}\n";
    $messageBody .= "نرجو منكم التواصل مع إدارة المؤسسة أو تبرير الغياب عبر المنظومة السحابية.\n";
    $messageBody .= "مع تحيات إدارة المؤسسة.";

    $payload = [
        'messaging_product' => 'whatsapp',
        'recipient_type' => 'individual',
        'to' => $phone,
        'type' => 'text',
        'text' => [
            'preview_url' => false,
            'body' => $messageBody
        ]
    ];

    $ch = curl_init(WHATSAPP_API_URL);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . WHATSAPP_ACCESS_TOKEN,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) {
        return [
            'success' => false,
            'error' => 'cURL Error: ' . $curlError,
            'http_code' => $httpCode
        ];
    }

    $responseData = json_decode($response, true);
    $isSuccess = ($httpCode >= 200 && $httpCode < 300);

    return [
        'success' => $isSuccess,
        'http_code' => $httpCode,
        'data' => $responseData,
        'sent_to' => $phone
    ];
}
