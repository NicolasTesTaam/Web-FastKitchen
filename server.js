// server.js

const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const port = 3000; // API sẽ chạy trên cổng 3000

// Middleware
app.use(cors()); // Cho phép frontend truy cập API
app.use(express.json());

// ----------------------------------------------------
// THAY THẾ CHUỖI KẾT NỐI (CONNECTION STRING) CỦA BẠN VÀO ĐÂY
// ----------------------------------------------------
const config = {
    user: 'DuccTam',         // Tên người dùng SQL
    password: '12345', // Mật khẩu SQL
    server: 'DUCTAAM\\SQLEXPRESS',           // Địa chỉ Server (hoặc tên instance)
    database: 'FASTKITCHEN',// Tên Database của bạn (chứa bảng DichVuCaNhan)
    options: {
        encrypt: false,            // Đặt false nếu không dùng SSL/TLS
        trustServerCertificate: true, // Quan trọng nếu bạn đang dùng SQL Server cục bộ (localhost)
        port: 1433 // Cổng mặc định của SQL Server
    }
};

// Hàm kết nối và Pool connection
async function connectToDatabase() {
    try {
        await sql.connect(config);
        console.log("✅ Đã kết nối thành công tới SQL Server.");
    } catch (err) {
        console.error("❌ Lỗi kết nối SQL Server:", err);
    }
}

connectToDatabase();
// Định nghĩa Endpoint API
app.get('/api/services', async (req, res) => {
    try {
        // Lấy tất cả dữ liệu từ bảng dịch vụ
        const result = await sql.query`SELECT DichVuID as id, TenDichVu as name, MoTa as desc, 'Nấu cỗ' as category, 4.5 as rating, 1500000 as price FROM dbo.DichVuCaNhan`;
        
        // Chú thích:
        // - Chúng ta ánh xạ tên cột SQL (DichVuID, TenDichVu, MoTa) sang tên thuộc tính JS (id, name, desc).
        // - 'Nấu cỗ', 4.5, 1500000 là dữ liệu giả định cho category, rating, price vì bảng SQL của bạn chưa có các cột này.
        // Bạn cần cập nhật logic lấy Category, Rating, Price nếu Database của bạn có.
        
        res.json(result.recordset);
    } catch (err) {
        console.error("Lỗi khi truy vấn Database:", err);
        res.status(500).send("Lỗi Server: Không thể lấy dữ liệu dịch vụ.");
    }
});


// Khởi động Server
app.listen(port, () => {
    console.log(`🚀 Server API đang chạy tại http://localhost:${port}`);
    console.log(`Endpoint Dịch vụ: http://localhost:${port}/api/services`);
});