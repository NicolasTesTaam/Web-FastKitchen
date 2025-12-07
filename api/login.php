<?php
include 'config.php';

$data = getJsonInput();

if (empty($data['email']) || empty($data['password'])) {
    sendResponse(["success" => false, "message" => "Vui lòng cung cấp email và mật khẩu."], 400);
}

$email = trim($data['email']);
$password = $data['password'];

try {
    // 1. Lấy MaND và MatKhau (HASH) từ CSDL
    $stmt = $pdo->prepare("SELECT MaND, MatKhau FROM NguoiDung WHERE Email = ? AND TrangThai = N'Mở'");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        // Kiểm tra tài khoản bị khóa hoặc không tồn tại
        $statusStmt = $pdo->prepare("SELECT 1 FROM NguoiDung WHERE Email = ? AND TrangThai = N'Khóa'");
        $statusStmt->execute([$email]);
        if ($statusStmt->fetch()) {
             sendResponse(["success" => false, "message" => "Tài khoản này đã bị khóa."], 401);
        }
        sendResponse(["success" => false, "message" => "Email hoặc mật khẩu không đúng."], 401); 
    }

    // 2. Kiểm tra mật khẩu đã hash (BẢO MẬT BẮT BUỘC)
    if (password_verify($password, $user['MatKhau'])) {
        
        $maND = $user['MaND'];
        
        // 3. THIẾT LẬP SESSION
        $_SESSION['MaND'] = $maND;
        
        // 4. Kiểm tra trạng thái đăng ký dịch vụ trong bảng Dichvucanhan
        $serviceStmt = $pdo->prepare("SELECT MaDV FROM Dichvucanhan WHERE MaND = ?");
        $serviceStmt->execute([$maND]);
        $service = $serviceStmt->fetch();
        
        $isServiceRegistered = $service !== false;
        $maDV = $isServiceRegistered ? $service['MaDV'] : null;

        // BỎ QUA GỌI Proc_DangNhap vì đã xử lý xác thực an toàn hơn ở PHP.
        // BỔ SUNG: Bạn có thể gọi Proc_GhiNhanHoatDong ở đây nếu muốn log lại
        
        sendResponse([
            "success" => true, 
            "message" => "Đăng nhập thành công.",
            "userId" => $maND,
            "isServiceRegistered" => $isServiceRegistered,
            "serviceId" => $maDV 
        ]);

    } else {
        sendResponse(["success" => false, "message" => "Email hoặc mật khẩu không đúng."], 401);
    }
} catch (PDOException $e) {
    sendResponse(["success" => false, "message" => "Lỗi CSDL khi đăng nhập: " . $e->getMessage()], 500);
}
?>