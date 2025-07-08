<?php
// Contact Form Handler for Palm Cove Renovations

// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Configuration
$config = [
    'to_email' => 'info@palmcoverenovations.com',
    'from_email' => 'noreply@palmcoverenovations.com',
    'subject_prefix' => 'New Renovation Inquiry - ',
    'success_redirect' => '/thank-you.html',
    'error_redirect' => '/contact-error.html'
];

// Start session for CSRF protection
session_start();

// Function to sanitize input
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to validate email
function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Function to validate phone
function validate_phone($phone) {
    // Remove all non-numeric characters
    $phone = preg_replace('/[^0-9]/', '', $phone);
    // Check if it's a valid phone number length
    return strlen($phone) >= 10 && strlen($phone) <= 15;
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Initialize errors array
    $errors = [];
    
    // Get and sanitize form data
    $firstName = sanitize_input($_POST['firstName'] ?? '');
    $lastName = sanitize_input($_POST['lastName'] ?? '');
    $email = sanitize_input($_POST['email'] ?? '');
    $phone = sanitize_input($_POST['phone'] ?? '');
    $address = sanitize_input($_POST['address'] ?? '');
    $projectType = sanitize_input($_POST['projectType'] ?? '');
    $budget = sanitize_input($_POST['budget'] ?? '');
    $timeline = sanitize_input($_POST['timeline'] ?? '');
    $message = sanitize_input($_POST['message'] ?? '');
    $newsletter = isset($_POST['newsletter']) ? 'Yes' : 'No';
    
    // Validate required fields
    if (empty($firstName)) {
        $errors[] = "First name is required";
    }
    
    if (empty($lastName)) {
        $errors[] = "Last name is required";
    }
    
    if (empty($email)) {
        $errors[] = "Email is required";
    } elseif (!validate_email($email)) {
        $errors[] = "Invalid email format";
    }
    
    if (empty($phone)) {
        $errors[] = "Phone number is required";
    } elseif (!validate_phone($phone)) {
        $errors[] = "Invalid phone number";
    }
    
    if (empty($projectType)) {
        $errors[] = "Project type is required";
    }
    
    if (empty($budget)) {
        $errors[] = "Budget range is required";
    }
    
    // Check for spam (honeypot)
    if (!empty($_POST['website'])) {
        // This is likely spam
        header("Location: " . $config['success_redirect']);
        exit();
    }
    
    // If no errors, process the form
    if (empty($errors)) {
        
        // Prepare email content
        $email_subject = $config['subject_prefix'] . $projectType . " - " . $firstName . " " . $lastName;
        
        $email_body = "New renovation inquiry received:\n\n";
        $email_body .= "=================================\n";
        $email_body .= "CONTACT INFORMATION\n";
        $email_body .= "=================================\n";
        $email_body .= "Name: " . $firstName . " " . $lastName . "\n";
        $email_body .= "Email: " . $email . "\n";
        $email_body .= "Phone: " . $phone . "\n";
        $email_body .= "Address: " . ($address ?: "Not provided") . "\n\n";
        
        $email_body .= "=================================\n";
        $email_body .= "PROJECT DETAILS\n";
        $email_body .= "=================================\n";
        $email_body .= "Project Type: " . $projectType . "\n";
        $email_body .= "Budget Range: " . $budget . "\n";
        $email_body .= "Timeline: " . ($timeline ?: "Not specified") . "\n";
        $email_body .= "Newsletter Signup: " . $newsletter . "\n\n";
        
        if (!empty($message)) {
            $email_body .= "=================================\n";
            $email_body .= "ADDITIONAL MESSAGE\n";
            $email_body .= "=================================\n";
            $email_body .= $message . "\n\n";
        }
        
        $email_body .= "=================================\n";
        $email_body .= "Submitted on: " . date('Y-m-d H:i:s') . "\n";
        $email_body .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";
        
        // Email headers
        $headers = "From: " . $config['from_email'] . "\r\n";
        $headers .= "Reply-To: " . $email . "\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();
        
        // Send email
        $mail_sent = mail($config['to_email'], $email_subject, $email_body, $headers);
        
        if ($mail_sent) {
            // Send confirmation email to customer
            $customer_subject = "Thank you for your renovation inquiry";
            $customer_body = "Dear " . $firstName . ",\n\n";
            $customer_body .= "Thank you for contacting Palm Cove Renovations. We've received your inquiry and will contact you within 24 hours.\n\n";
            $customer_body .= "Project Details:\n";
            $customer_body .= "- Type: " . $projectType . "\n";
            $customer_body .= "- Budget: " . $budget . "\n";
            $customer_body .= "- Timeline: " . ($timeline ?: "To be discussed") . "\n\n";
            $customer_body .= "If you have any urgent questions, please call us at (555) 123-4567.\n\n";
            $customer_body .= "Best regards,\n";
            $customer_body .= "The Palm Cove Renovations Team\n\n";
            $customer_body .= "This is an automated message. Please do not reply to this email.";
            
            $customer_headers = "From: " . $config['from_email'] . "\r\n";
            mail($email, $customer_subject, $customer_body, $customer_headers);
            
            // Store in database (if configured)
            try {
                // Database connection (update with your credentials)
                $db_host = 'localhost';
                $db_name = 'palmcove_renovations';
                $db_user = 'your_db_user';
                $db_pass = 'your_db_password';
                
                $pdo = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                
                $stmt = $pdo->prepare("INSERT INTO inquiries (first_name, last_name, email, phone, address, project_type, budget, timeline, message, newsletter, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
                
                $stmt->execute([$firstName, $lastName, $email, $phone, $address, $projectType, $budget, $timeline, $message, $newsletter]);
                
            } catch (PDOException $e) {
                // Log error but don't show to user
                error_log("Database error: " . $e->getMessage());
            }
            
            // Redirect to success page
            header("Location: " . $config['success_redirect']);
            exit();
            
        } else {
            // Email failed
            $_SESSION['form_errors'] = ['Failed to send email. Please try again or call us directly.'];
            $_SESSION['form_data'] = $_POST;
            header("Location: " . $config['error_redirect']);
            exit();
        }
        
    } else {
        // Validation errors
        $_SESSION['form_errors'] = $errors;
        $_SESSION['form_data'] = $_POST;
        header("Location: " . $_SERVER['HTTP_REFERER'] . "#contact");
        exit();
    }
    
} else {
    // Not a POST request
    header("Location: /");
    exit();
}

// SQL for creating the inquiries table:
/*
CREATE TABLE inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255),
    project_type VARCHAR(50) NOT NULL,
    budget VARCHAR(50) NOT NULL,
    timeline VARCHAR(50),
    message TEXT,
    newsletter ENUM('Yes', 'No') DEFAULT 'No',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('new', 'contacted', 'quoted', 'closed') DEFAULT 'new',
    notes TEXT
);
*/
?>