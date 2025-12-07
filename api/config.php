<?php
include 'config.php';

$data = getJsonInput();

// 1. Kiểm tra đầu vào
if (empty($data['email']) || empty($data['password'])) {
    sendResponse(["success" => false, "message" => "Vui lòng cung cấp email và mật khẩu."], 400);
}

// BỔ SUNG: Giả định bạn đã thêm trường HoTen (fullName) vào form Đăng ký
$hoTen = $data['fullName'] ?? 'Khách hàng mới'; 
$email = trim($data['email']);
$password = $data['password'];
$sdt = $data['phone'] ?? null;
$cccd = $data['cccd'] ?? null;

// 2. Hash mật khẩu (BẢO MẬT BẮT BUỘC)
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

try {
    // 3. Kiểm tra email đã tồn tại (dùng truy vấn thay vì SP để kiểm tra nhanh)
    $stmt = $pdo->prepare("SELECT MaND FROM NguoiDung WHERE Email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        sendResponse(["success" => false, "message" => "Email đã được đăng ký."], 409);
    }
    
    // 4. Tạo MaND mới (Sử dụng hàm generateId mới)
    $newMaND = generateId($pdo, 'NguoiDung', 'MaND', 'ND'); // Dùng generateId mới

    // 5. Gọi Stored Procedure Proc_DangKyTaiKhoan
    $stmt = $pdo->prepare("CALL Proc_DangKyTaiKhoan(?, ?, ?, ?, ?,?)");
    
    // MatKhau trong DB sẽ là HASHED password
    $stmt->execute([
        $hoTen, 
        $email, 
        $hashedPassword, // TRUYỀN HASHED PASSWORD
        $sdt, 
        $cccd,
        $newMaND // TRUYỀN ID TỰ TẠO
    ]);
    
    // Lấy kết quả từ Stored Procedure
    $result = $stmt->fetch();
    
    if ($result && isset($result['MaNDMoi'])) {
        // 6. Thiết lập Session
        $_SESSION['MaND'] = $newMaND; 

        sendResponse([
            "success" => true, 
            "message" => $result['ThongBao'] ?? "Đăng ký thành công.", 
            "userId" => $newMaND // TRẢ VỀ MaND
        ]);
    } else {
        // Trường hợp Stored Procedure không trả về đúng kết quả (Lỗi do SP)
         sendResponse(["success" => false, "message" => "Lỗi thực thi Stored Procedure: " . ($result['ThongBao'] ?? 'Không rõ.')], 500);
    }

} catch (PDOException $e) {
    sendResponse(["success" => false, "message" => "Lỗi CSDL: " . $e->getMessage()], 500);
}
?>