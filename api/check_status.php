<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse(["success" => false, "message" => "Phương thức không hợp lệ."], 405);
}

// Session key đã được đổi thành MaND
if (isset($_SESSION['MaND'])) { 
    $maND = $_SESSION['MaND'];
    
    try {
        // Kiểm tra trạng thái đăng ký dịch vụ của người dùng hiện tại
        $serviceStmt = $pdo->prepare("SELECT MaDV FROM Dichvucanhan WHERE MaND = ?");
        $serviceStmt->execute([$maND]);
        $service = $serviceStmt->fetch();
        
        $isServiceRegistered = $service !== false;
        $maDV = $isServiceRegistered ? $service['MaDV'] : null;

        sendResponse([
            "isLoggedIn" => true,
            "userId" => $maND, // TRẢ VỀ MaND
            "isServiceRegistered" => $isServiceRegistered,
            "serviceId" => $maDV 
        ]);
    } catch (PDOException $e) {
        // Trong trường hợp lỗi CSDL, coi như chưa đăng nhập
        sendResponse(["isLoggedIn" => false, "message" => "Lỗi CSDL."], 500);
    }
} else {
    sendResponse([
        "isLoggedIn" => false
    ]);
}
?>