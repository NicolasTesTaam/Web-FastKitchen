<?php

// 1. Cấu hình CORS (Rất quan trọng để JS có thể truy cập)
// Cho phép truy cập từ mọi nguồn gốc (*). Trong môi trường sản xuất, bạn nên giới hạn domain cụ thể.
header("Access-Control-Allow-Origin: *");
// Thiết lập Content-Type là JSON
header("Content-Type: application/json; charset=UTF-8");

// 2. Thiết lập thông tin kết nối Database
$servername = "localhost";
$username = "root"; // Thay đổi nếu bạn đã đặt mật khẩu cho root
$password = "";     // Thay đổi nếu bạn đã đặt mật khẩu
$dbname = "fastkitchen"; // Thay bằng tên cơ sở dữ liệu của bạn

// 3. Kết nối với Cơ sở Dữ liệu sử dụng PDO
try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    // Thiết lập thuộc tính lỗi để PDO ném ngoại lệ (Exception) khi có lỗi
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 4. Chuẩn bị và Thực thi truy vấn SQL
    $stmt = $conn->prepare("SELECT id, name, email FROM users ORDER BY id DESC");
    $stmt->execute();

    // 5. Lấy kết quả và đóng gói
    // fetchAll(PDO::FETCH_ASSOC) trả về một mảng chứa tất cả các hàng,
    // mỗi hàng là một mảng kết hợp (key là tên cột).
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // 6. Trả về phản hồi JSON
    echo json_encode($result, JSON_UNESCAPED_UNICODE);

} catch(PDOException $e) {
    // 7. Xử lý lỗi (nếu kết nối thất bại hoặc truy vấn lỗi)
    http_response_code(500); // Thiết lập mã lỗi HTTP 500 (Internal Server Error)
    echo json_encode(array("message" => "Lỗi kết nối hoặc truy vấn: " . $e->getMessage()), JSON_UNESCAPED_UNICODE);
}

// Đóng kết nối (PDO tự động đóng khi script kết thúc)
$conn = null;

?>