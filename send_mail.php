<?php
// Включаем отображение ошибок для отладки
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Подключаем PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/PHPMailer/src/Exception.php';
require 'vendor/PHPMailer/src/PHPMailer.php';
require 'vendor/PHPMailer/src/SMTP.php';

// Устанавливаем заголовки
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Обработка preflight запросов
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Проверяем метод запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['error' => 'Method not allowed']));
}

try {
    // Получаем данные из POST запроса
    $rawData = file_get_contents('php://input');
    if (!$rawData) {
        throw new Exception('No data received');
    }

    $data = json_decode($rawData, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON data: ' . json_last_error_msg());
    }

    // Проверяем наличие обязательных полей
    if (empty($data['name']) || empty($data['phone'])) {
        throw new Exception('Missing required fields');
    }

    // Очищаем и валидируем данные
    $name = htmlspecialchars(strip_tags($data['name']));
    $phone = htmlspecialchars(strip_tags($data['phone']));
    $productInfo = isset($data['productInfo']) ? htmlspecialchars(strip_tags($data['productInfo'])) : 'Не указано';

    // Создаем экземпляр PHPMailer
    $mail = new PHPMailer(true);

    // Настройки SMTP
    $mail->isSMTP();
    $mail->Host = 'smtp.mail.ru';
    $mail->SMTPAuth = true;
    $mail->Username = 'rbru-metrika@yandex.ru'; // Ваш email для отправки
    $mail->Password = 'ваш_пароль_приложения'; // Пароль приложения Mail.ru
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    $mail->CharSet = 'UTF-8';

    // Настройки письма
    $mail->setFrom('rbru-metrika@yandex.ru', 'Заявка с сайта');
    $mail->addAddress('rbru-metrika@yandex.ru'); // Изменено на указанный адрес
    $mail->Subject = 'Новая заявка с сайта';

    // Формируем текст письма
    $message = "Получена новая заявка:\n\n";
    $message .= "Имя: {$name}\n";
    $message .= "Телефон: {$phone}\n";
    $message .= "Товар: {$productInfo}\n";
    $message .= "\nДата и время: " . date('Y-m-d H:i:s') . "\n";

    $mail->Body = $message;

    // Отправляем письмо
    $mail->send();

    // Возвращаем успешный ответ
    echo json_encode([
        'success' => true,
        'message' => 'Заявка успешно отправлена'
    ]);

} catch (Exception $e) {
    error_log('Mail Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
} 