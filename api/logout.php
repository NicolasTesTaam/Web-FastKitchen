<?php
include 'config.php';

// Hủy session
session_unset();
session_destroy();

sendResponse([
    "success" => true, 
    "message" => "Đăng xuất thành công."
]);
?>