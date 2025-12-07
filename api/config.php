<?php
// BẮT ĐẦU SESSION
session_start();

// Thiết lập Headers cho API
header("Access-Control-Allow-Origin: *"); 
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Credentials: true"); 
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// THÔNG TIN KẾT NỐI DATABASE
$host = "localhost";
$db_name = "fastkitchen"; // ĐÃ CẬP NHẬT TỪ SQL CỦA BẠN
$username = "root"; // THAY ĐỔI
$password = ""; // THAY ĐỔI 

try {
    // Kết nối bằng PDO
    // THÊM 'charset=utf8' để hỗ trợ tiếng Việt (NVARCHAR)
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Thiết lập chế độ fetching là Assoc (key là tên cột)
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Lỗi kết nối CSDL: " . $e->getMessage()], JSON_UNESCAPED_UNICODE);
    exit();
}

/**
 * Hàm lấy dữ liệu JSON từ request body
 */
function getJsonInput() {
    $input = file_get_contents('php://input');
    return json_decode($input, true) ?? [];
}

/**
 * Hàm trả về JSON Response
 */
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    // THÊM JSON_UNESCAPED_UNICODE để hỗ trợ tiếng Việt
    echo json_encode($data, JSON_UNESCAPED_UNICODE); 
    exit();
}

/**
 * Hàm tạo MaND tự động (Vì logic trong SQL phức tạp, ta sẽ tạo ở PHP)
 */
function generateMaND($pdo, $prefix = 'ND') {
    $stmt = $pdo->query("SELECT MAX(SUBSTRING(MaND, 3)) AS max_id FROM NguoiDung WHERE MaND LIKE '$prefix%'");
    $maxId = $stmt->fetchColumn();
    $nextIdNum = intval($maxId) + 1;
    return $prefix . str_pad($nextIdNum, 3, '0', STR_PAD_LEFT);
}

?>