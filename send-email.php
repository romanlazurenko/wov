<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Get JSON data from request body
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate required fields
if (empty($data['name']) || empty($data['email']) || empty($data['service'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

// Sanitize input data
$name = htmlspecialchars(strip_tags($data['name']));
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$company = !empty($data['company']) ? htmlspecialchars(strip_tags($data['company'])) : 'N/A';
$service = htmlspecialchars(strip_tags($data['service']));
$message = !empty($data['message']) ? htmlspecialchars(strip_tags($data['message'])) : 'N/A';

// Email configuration
$to = 'info@wov.cz';
$subject = 'Nová konzultační žádost z webu WOV';

// Email body
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

// Email headers
$headers = "From: noreply@wov.cz\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email
$mailSent = mail($to, $subject, $emailBody, $headers);

if ($mailSent) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to send email']);
}
?>

