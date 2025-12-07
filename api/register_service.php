<?php
include 'config.php';

// Yêu cầu phải đăng nhập (Session key đã đổi thành MaND)
if (!isset($_SESSION['MaND'])) {
    sendResponse(["success" => false, "message" => "Vui lòng đăng nhập để đăng ký dịch vụ."], 401);
}

$maND = $_SESSION['MaND'];
$data = getJsonInput();

// 1. Kiểm tra đầu vào (Tùy chỉnh theo form đăng ký dịch vụ của bạn)
if (empty($data['MaSoThue']) || empty($data['DiaChi'])) {
    sendResponse(["success" => false, "message" => "Vui lòng nhập đầy đủ thông tin dịch vụ (Mã số thuế, Địa chỉ)."], 400);
}

// Bổ sung các trường từ form của bạn
$maSoThue = $data['MaSoThue'];
$diaChi = $data['DiaChi'];
$maGiayXacNhanATVSTP = $data['MaGiayXacNhanATVSTP'] ?? null;
$taiKhoanNganHang = $data['TaiKhoanNganHang'] ?? null;

try {
    // 2. Tạo MaDV mới (Sử dụng hàm tự tạo, thay vì MaND)
    $newMaDV = generateMaND($pdo, 'DV'); 

    // 3. Gọi Stored Procedure Proc_DangKyMoDichVu
    $stmt = $pdo->prepare("CALL Proc_DangKyMoDichVu(?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $newMaDV,
        $maND,
        $maSoThue,
        $diaChi,
        $maGiayXacNhanATVSTP,
        $taiKhoanNganHang
    ]);

    // Lấy kết quả từ Stored Procedure
    $result = $stmt->fetch();
    
    if ($result && isset($result['ThongBao'])) {
        sendResponse([
            "success" => true, 
            "message" => $result['ThongBao'],
            "serviceId" => $newMaDV 
        ]);
    } else {
        // Trường hợp Stored Procedure không trả về đúng kết quả (Lỗi do SP)
         sendResponse(["success" => false, "message" => "Lỗi thực thi Stored Procedure: " . ($result['ThongBao'] ?? 'Không rõ.')], 500);
    }
    

} catch (PDOException $e) {
    // Bắt lỗi khi MaND đã đăng ký hoặc lỗi trùng MaDV/MaSoThue
    sendResponse(["success" => false, "message" => "Lỗi CSDL khi đăng ký dịch vụ: " . $e->getMessage()], 500);
}
?>