<?php
/**
 * Royal Visa Xpert - Enquiry Form Handler (PHP Version)
 * For cPanel hosting without Node.js support.
 */

// 1. Loading Environment Variables from .env
function loadEnv($path) {
    if (!file_exists($path)) return [];
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $env = [];
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        $env[trim($name)] = trim($value);
    }
    return $env;
}

$envVars = loadEnv(__DIR__ . '/../.env');

// 2. Configuration (Defaults + Override from .env)
$config = [
    'smtp_host' => $envVars['SMTP_HOST'] ?? 'smtp.gmail.com',
    'smtp_port' => intval($envVars['SMTP_PORT'] ?? 587),
    'smtp_user' => $envVars['SMTP_USER'] ?? 'info@rvxtravels.com',
    'smtp_pass' => $envVars['SMTP_PASS'] ?? 'Shakilkutchi@123',
    'mail_from' => $envVars['SMTP_USER'] ?? 'info@rvxtravels.com',
    'mail_to'   => $envVars['MAIL_TO'] ?? 'info@rvxtravels.com'
];

// 2. Headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight (OPTIONS) requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 3. Receive and parse JSON data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(['error' => 'Invalid data submission']);
    exit;
}

// 4. Honeypot check (anti-bot)
if (!empty($data['company'])) {
    echo json_encode(['error' => 'Invalid submission detected']);
    exit;
}

// 5. Validation
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$destination = trim($data['destination'] ?? '');
$visaType = trim($data['visaType'] ?? '');
$message = trim($data['message'] ?? '');

if (empty($name) || empty($destination) || empty($visaType)) {
    echo json_encode(['error' => 'Please fill all required fields']);
    exit;
}

// 6. Build Email Content
$subject = "New Visa Enquiry: $destination ($visaType)";
$email_body = "
<h2>New Visa Enquiry Received</h2>
<p><strong>Name:</strong> $name</p>
<p><strong>Email:</strong> $email</p>
<p><strong>Destination:</strong> $destination</p>
<p><strong>Visa Type:</strong> $visaType</p>
<p><strong>Message:</strong><br>$message</p>
<hr>
<p><small>Sent from Royal Visa Xpert Website</small></p>
";

// 7. Send Email
// Note: This uses standard PHP mail(). For most cPanel servers, this will work.
// If your server requires SMTP authentication, you'll need PHPMailer (recommended).
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: Royal Visa Xpert <" . $config['mail_from'] . ">" . "\r\n";
$headers .= "Reply-To: $email" . "\r\n";

if (mail($config['mail_to'], $subject, $email_body, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Enquiry sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send enquiry. Please try again later.']);
}
?>
