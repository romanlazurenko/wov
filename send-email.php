<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Set UTF-8 encoding
mb_internal_encoding('UTF-8');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Get JSON data from request body
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate required fields (only name and email are required)
$missingFields = [];
if (empty($data['name'])) {
    $missingFields[] = 'name';
}
if (empty($data['email'])) {
    $missingFields[] = 'email';
}

if (!empty($missingFields)) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'error' => 'Missing required fields: ' . implode(', ', $missingFields),
        'missing_fields' => $missingFields
    ]);
    exit;
}

// Sanitize input data
$name = htmlspecialchars(strip_tags($data['name']), ENT_QUOTES, 'UTF-8');
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$company = !empty($data['company']) ? htmlspecialchars(strip_tags($data['company']), ENT_QUOTES, 'UTF-8') : 'N/A';
$service = !empty($data['service']) ? htmlspecialchars(strip_tags($data['service']), ENT_QUOTES, 'UTF-8') : 'N/A';
$message = !empty($data['message']) ? htmlspecialchars(strip_tags($data['message']), ENT_QUOTES, 'UTF-8') : 'N/A';

// Email configuration
$to = 'info@wov.cz';
$subject = 'Nová konzultační žádost z webu WOV';

// Email body with UTF-8 encoding
$emailBody = "Nová konzultační žádost byla odeslána z webu WOV.\n\n";
$emailBody .= "Detaily:\n";
$emailBody .= "==================\n\n";
$emailBody .= "Jméno: $name\n";
$emailBody .= "Email: $email\n";
$emailBody .= "Společnost: $company\n";
$emailBody .= "Služba: $service\n";
$emailBody .= "Zpráva:\n$message\n\n";
$emailBody .= "==================\n";
$emailBody .= "Tento email byl automaticky vygenerován z kontaktního formuláře na webu WOV.";

// Email headers with proper UTF-8 encoding
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";
$headers .= "From: noreply@wov.cz\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// Encode subject with UTF-8 (using mb_encode_mimeheader if available, otherwise use base64)
if (function_exists('mb_encode_mimeheader')) {
    $encodedSubject = mb_encode_mimeheader($subject, 'UTF-8', 'Q');
} else {
    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
}

// Send email
$mailSent = mail($to, $encodedSubject, $emailBody, $headers);

if ($mailSent) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to send email']);
}
?>

