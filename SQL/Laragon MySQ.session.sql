CREATE DATABASE FASTKITCHEN
GO
USE FASTKITCHEN
GO

SELECT * from NguoiDung
------------------------------------
-- 1. CẤU TRÚC BẢNG (TABLE STRUCTURE)
------------------------------------

-- Bảng NguoiDung 
CREATE TABLE NguoiDung (
    MaND VARCHAR(10) PRIMARY KEY,
    HoTen NVARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    MatKhau VARCHAR(255) NOT NULL, 
    SDT VARCHAR(20) UNIQUE,
    CCCD VARCHAR(20) UNIQUE,
    VaiTro NVARCHAR(50),
    TrangThai NVARCHAR(10) DEFAULT N'Mở' NOT NULL,
    CONSTRAINT CHK_NguoiDung_TrangThai CHECK (TrangThai IN (N'Mở', N'Khóa'))
);

-- Bảng Mon 
CREATE TABLE Mon (
    MaMon VARCHAR(10) PRIMARY KEY,
    TenMon NVARCHAR(100) NOT NULL,
    LoaiMon NVARCHAR(50),
    GiaTien DECIMAL(18, 2) DEFAULT 0 NOT NULL
);

-- Bảng Dichvucanhan 
CREATE TABLE Dichvucanhan (
    MaDV VARCHAR(10) PRIMARY KEY,
    MaND VARCHAR(10) UNIQUE NOT NULL, 
    MaSoThue VARCHAR(15) UNIQUE NOT NULL,
    DiaChi NVARCHAR(255),
    MaGiayXacNhanATVSTP VARCHAR(20) UNIQUE,
    TaiKhoanNganHang VARCHAR(50),
    FOREIGN KEY (MaND) REFERENCES NguoiDung(MaND)
);

-- Bảng Menu 
CREATE TABLE Menu (
    MaMenu VARCHAR(10) PRIMARY KEY,
    TenMenu NVARCHAR(100) NOT NULL,
    MaMonKhaiVi VARCHAR(10) NOT NULL,
    MaMon2 VARCHAR(10) NOT NULL,
    MaMon3 VARCHAR(10) NOT NULL,
    MaMon4 VARCHAR(10) NOT NULL,
    MaMonTrangMieng VARCHAR(10) NOT NULL,
    MoTa NVARCHAR(500), 
    FOREIGN KEY (MaMonKhaiVi) REFERENCES Mon(MaMon),
    FOREIGN KEY (MaMon2) REFERENCES Mon(MaMon),
    FOREIGN KEY (MaMon3) REFERENCES Mon(MaMon),
    FOREIGN KEY (MaMon4) REFERENCES Mon(MaMon),
    FOREIGN KEY (MaMonTrangMieng) REFERENCES Mon(MaMon)
);

-- Bảng DonHang 
CREATE TABLE DonHang (
    MaDH VARCHAR(10) PRIMARY KEY,
    MaDV VARCHAR(10) NOT NULL,
    NgayDat DATETIME NOT NULL,
    TrangThai NVARCHAR(50),
    TongTien DECIMAL(18, 2) NOT NULL,
    FOREIGN KEY (MaDV) REFERENCES Dichvucanhan(MaDV)
);

-- Bảng HoaDon 
CREATE TABLE HoaDon (
    MaHD VARCHAR(10) PRIMARY KEY,
    MaDH VARCHAR(10) UNIQUE NOT NULL,
    NgayLap DATETIME NOT NULL,
    TongTien DECIMAL(18, 2) NOT NULL,
    PhuongThucThanhToan NVARCHAR(50),
    FOREIGN KEY (MaDH) REFERENCES DonHang(MaDH)
);

-- Bảng LichHoatDong_DV (Tên bảng được giữ nguyên như trong file gốc)
CREATE TABLE LichHoatDong_DV (
    MaHD VARCHAR(15) PRIMARY KEY,
    MaDV VARCHAR(10) NOT NULL,
    ThoiGian DATETIME DEFAULT GETDATE() NOT NULL,
    LoaiHoatDong NVARCHAR(50) NOT NULL,
    MoTaChiTiet NVARCHAR(255),
    FOREIGN KEY (MaDV) REFERENCES Dichvucanhan(MaDV)
);
GO

-- Bảng ChiTietDonHang 
CREATE TABLE ChiTietDonHang (
    MaCTDH VARCHAR(10) PRIMARY KEY,
    MaDH VARCHAR(10) UNIQUE NOT NULL, 
    TenNgDung NVARCHAR(100),
    SDT VARCHAR(20),
    NgayDat DATETIME,
    GioToChuc TIME, 
    EmailNgDat VARCHAR(100),
    MaMenu VARCHAR(10) NOT NULL,
    TongTien DECIMAL(18, 2) NOT NULL,
    YeuCauThem NVARCHAR(500), 
    FOREIGN KEY (MaDH) REFERENCES DonHang(MaDH),
    FOREIGN KEY (MaMenu) REFERENCES Menu(MaMenu)
);
GO

------------------------------------
-- 2. DỮ LIỆU MẪU (SAMPLE DATA)
------------------------------------

-- INSERT NguoiDung 
INSERT INTO NguoiDung (MaND, HoTen, Email, MatKhau, SDT, CCCD, VaiTro, TrangThai)
VALUES
    ('ND001', N'Nguyễn Văn A', 'nguyenvana@fastkitchen.com', 'A123', '0901234567', '001123456789', N'Quantrivien', N'Mở'),
    ('ND002', N'Trần Thị B', 'tranthib@gmail.com', 'B123', '0917654321', '002987654321', N'Khachhang', N'Mở'), 
    ('ND003', N'Lê Văn C', 'levanc@yahoo.com', 'C123', '0988776655', '003554433221', N'Khachhang', N'Mở');

INSERT INTO Dichvucanhan (MaDV, MaND, MaSoThue, DiaChi, MaGiayXacNhanATVSTP, TaiKhoanNganHang)
VALUES 
    ('DV001', 'ND003', '1234567890123', N'123 Đường XYZ, Quận 1, TP.HCM', 'ATVSTP001', '101000000001');

-- INSERT Mon (Bổ sung GiaTien)
INSERT INTO Mon (MaMon, TenMon, LoaiMon, GiaTien)
VALUES 
    ('M001', N'Gỏi Củ Hủ Dừa Tôm Thịt', N'KhaiVi', 350000.00),
    ('M002', N'Bò Kho Tiêu Xanh', N'MonChinh', 450000.00),
    ('M003', N'Gà Quay Da Giòn', N'MonChinh', 400000.00),
    ('M004', N'Lẩu Mắm Miền Tây', N'MonChinh', 500000.00),
    ('M005', N'Chè Ba Màu', N'TrangMieng', 100000.00);

-- INSERT Menu (MoTa: 1,800,000 là tổng của 5 món trên)
INSERT INTO Menu (MaMenu, TenMenu, MaMonKhaiVi, MaMon2, MaMon3, MaMon4, MaMonTrangMieng, MoTa)
VALUES 
    ('MENU01', N'Thực Đơn Tiệc Gia Đình', 'M001', 'M002', 'M003', 'M004', 'M005', N'1,800,000 1 bàn (Tổng tiền tính: 1,800,000 cho 1 bàn.)');
GO

------------------------------------
-- 3. STORED PROCEDURES (ĐÃ TỐI ƯU)
------------------------------------

---------------------------------------------------------------------------------------------------
-- NHÓM 1: TIỆN ÍCH HỆ THỐNG (UTILITY)
---------------------------------------------------------------------------------------------------

	-- GHI CHÚ: Proc_GhiNhanHoatDong (ĐÃ TỐI ƯU VÀ SỬA TÊN BẢNG)
	-- Dùng để log (ghi lại) các hoạt động quan trọng trong hệ thống.
	IF OBJECT_ID('Proc_GhiNhanHoatDong', 'P') IS NOT NULL
		DROP PROCEDURE Proc_GhiNhanHoatDong;
	GO
	CREATE PROCEDURE Proc_GhiNhanHoatDong
		@MaND VARCHAR(10),
		@LoaiHoatDong NVARCHAR(50),
		@MoTaChiTiet NVARCHAR(255)
	AS
	BEGIN
		SET NOCOUNT ON;
		-- Tối ưu: Dùng chuỗi thời gian chi tiết hơn để đảm bảo tính duy nhất
        DECLARE @MaHD VARCHAR(20) = 'LOG' + FORMAT(GETDATE(), 'yyyyMMddHHmmssfff'); 
        
        -- Lấy MaDV tương ứng từ MaND
        DECLARE @MaDV VARCHAR(10);
        SELECT @MaDV = MaDV FROM Dichvucanhan WHERE MaND = @MaND;

		-- Đã sửa: Sử dụng tên bảng LichHoatDong_DV (Tên bảng được tạo trong file gốc)
		INSERT INTO LichHoatDong_DV (MaHD, MaDV, ThoiGian, LoaiHoatDong, MoTaChiTiet)
		VALUES (@MaHD, ISNULL(@MaDV, 'DVNULL'), GETDATE(), @LoaiHoatDong, @MoTaChiTiet);
	END
	GO


---------------------------------------------------------------------------------------------------
-- NHÓM 2: XÁC THỰC & ĐĂNG KÝ (CORE AUTHENTICATION)
---------------------------------------------------------------------------------------------------

-- GHI CHÚ: Proc_DangNhap 
IF OBJECT_ID('Proc_DangNhap', 'P') IS NOT NULL
    DROP PROCEDURE Proc_DangNhap;
GO
CREATE PROCEDURE Proc_DangNhap
    @Email VARCHAR(100),
    @MatKhau VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM NguoiDung WHERE Email = @Email AND TrangThai = N'Khóa')
    BEGIN
        SELECT N'Tài khoản này đã bị khóa.' AS ThongBao, NULL AS MaND;
        RETURN
    END

    SELECT 
        MaND, HoTen, Email, SDT, VaiTro, TrangThai 
    FROM NguoiDung
    WHERE Email = @Email AND MatKhau = @MatKhau;

    IF @@ROWCOUNT = 0
    BEGIN
        SELECT N'Thông tin đăng nhập không chính xác.' AS ThongBao, NULL AS MaND;
    END
    ELSE
    BEGIN
        DECLARE @MaND_Logged VARCHAR(10);
        SELECT @MaND_Logged = MaND FROM NguoiDung WHERE Email = @Email AND MatKhau = @MatKhau;
        EXEC Proc_GhiNhanHoatDong @MaND_Logged, N'Đăng nhập', N'Đăng nhập thành công.';
        SELECT N'Đăng nhập thành công.' AS ThongBao, @MaND_Logged AS MaND;
    END
END
GO

-- GHI CHÚ: Proc_DangKyTaiKhoan 
IF OBJECT_ID('Proc_DangKyTaiKhoan', 'P') IS NOT NULL
    DROP PROCEDURE Proc_DangKyTaiKhoan;
GO
CREATE PROCEDURE Proc_DangKyTaiKhoan
    @HoTen NVARCHAR(100),
    @Email VARCHAR(100),
    @MatKhau VARCHAR(255),
    @SDT VARCHAR(20) = NULL,
    @CCCD VARCHAR(20) = NULL
AS
BEGIN
    -- Dùng NEWID() để tạo chuỗi ID ngẫu nhiên hơn (Hàm tạo ID ban đầu)
    DECLARE @NewMaND VARCHAR(10) = 'ND' + RIGHT('000000' + CAST(ABS(CHECKSUM(NEWID())) % 1000000 AS VARCHAR(6)), 6);
    
    BEGIN TRY
        INSERT INTO NguoiDung (MaND, HoTen, Email, MatKhau, SDT, CCCD, VaiTro)
        VALUES (@NewMaND, @HoTen, @Email, @MatKhau, @SDT, @CCCD, N'Khachhang');
        SELECT @NewMaND AS MaNDMoi, N'Đăng ký tài khoản thành công.' AS ThongBao;
    END TRY
    BEGIN CATCH
        -- Tối ưu: Dùng THROW thay cho RAISERROR
        THROW;
    END CATCH
END
GO

-- GHI CHÚ: Proc_DangKyMoDichVu 
IF OBJECT_ID('Proc_DangKyMoDichVu', 'P') IS NOT NULL
    DROP PROCEDURE Proc_DangKyMoDichVu;
GO
CREATE PROCEDURE Proc_DangKyMoDichVu
    @MaDV VARCHAR(10),
    @MaND VARCHAR(10),
    @MaSoThue VARCHAR(15),
    @DiaChi NVARCHAR(255),
    @MaGiayXacNhanATVSTP VARCHAR(20) = NULL,
    @TaiKhoanNganHang VARCHAR(50) = NULL
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM NguoiDung WHERE MaND = @MaND)
    BEGIN
        RAISERROR(N'Mã người dùng không tồn tại.', 16, 1)
        RETURN
    END
    IF EXISTS (SELECT 1 FROM Dichvucanhan WHERE MaND = @MaND)
    BEGIN
        RAISERROR(N'Người dùng này đã đăng ký dịch vụ.', 16, 1)
        RETURN
    END

    BEGIN TRY
        INSERT INTO Dichvucanhan (MaDV, MaND, MaSoThue, DiaChi, MaGiayXacNhanATVSTP, TaiKhoanNganHang)
        VALUES (@MaDV, @MaND, @MaSoThue, @DiaChi, @MaGiayXacNhanATVSTP, @TaiKhoanNganHang);
        EXEC Proc_GhiNhanHoatDong @MaND, N'Đăng ký dịch vụ', N'Đăng ký mở dịch vụ ' , @MaDV , N' thành công.';
        SELECT N'Đăng ký mở dịch vụ ' + @MaDV + N' thành công.' AS ThongBao;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END
GO

---------------------------------------------------------------------------------------------------
-- NHÓM 3: QUẢN LÝ TÀI KHOẢN & CÀI ĐẶT (ADMIN & USER SETTINGS)
---------------------------------------------------------------------------------------------------

-- GHI CHÚ: Proc_CapNhatThongTinCaNhan 
IF OBJECT_ID('Proc_CapNhatThongTinCaNhan', 'P') IS NOT NULL
    DROP PROCEDURE Proc_CapNhatThongTinCaNhan;
GO
CREATE PROCEDURE Proc_CapNhatThongTinCaNhan
    @MaND VARCHAR(10),
    @HoTen NVARCHAR(100) = NULL,
    @MatKhau VARCHAR(255) = NULL,
    @SDT VARCHAR(20) = NULL,
    @CCCD VARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE NguoiDung
    SET 
        HoTen = ISNULL(@HoTen, HoTen),
        MatKhau = ISNULL(@MatKhau, MatKhau),
        SDT = ISNULL(@SDT, SDT),
        CCCD = ISNULL(@CCCD, CCCD)
    WHERE MaND = @MaND;

    EXEC Proc_GhiNhanHoatDong @MaND, N'Cài đặt', N'Cập nhật thông tin cá nhân thành công.';

    SELECT N'Cập nhật thông tin cá nhân thành công.' AS ThongBao;
END
GO

-- GHI CHÚ: Proc_LayDanhSachNguoiDung 
IF OBJECT_ID('Proc_LayDanhSachNguoiDung', 'P') IS NOT NULL
    DROP PROCEDURE Proc_LayDanhSachNguoiDung;
GO
CREATE PROCEDURE Proc_LayDanhSachNguoiDung
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        MaND, HoTen, Email, SDT, VaiTro, TrangThai 
    FROM NguoiDung
    ORDER BY VaiTro, HoTen;
END
GO

-- GHI CHÚ: Proc_CapNhatTrangThaiNguoiDung (ĐÃ SỬA LỖI CÚ PHÁP CHUỖI EXEC)
IF OBJECT_ID('Proc_CapNhatTrangThaiNguoiDung', 'P') IS NOT NULL
    DROP PROCEDURE Proc_CapNhatTrangThaiNguoiDung;
GO
CREATE PROCEDURE Proc_CapNhatTrangThaiNguoiDung
    @MaND_Admin VARCHAR(10),
    @MaND_Target VARCHAR(10),
    @TrangThaiMoi NVARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Kiểm tra quyền Admin
    IF (SELECT VaiTro FROM NguoiDung WHERE MaND = @MaND_Admin) != N'Quantrivien'
    BEGIN
        RAISERROR(N'Bạn không có quyền thực hiện thao tác này.', 16, 1)
        RETURN
    END

    -- Cập nhật trạng thái
    UPDATE NguoiDung
    SET TrangThai = @TrangThaiMoi
    WHERE MaND = @MaND_Target;

  
    -- Sửa lỗi: Nối chuỗi mô tả đúng cú pháp
    DECLARE @MoTaLog NVARCHAR(255) = N'Cập nhật trạng thái của ' + @MaND_Target + N' thành ' + @TrangThaiMoi + N'.';
    EXEC Proc_GhiNhanHoatDong 
        @MaND_Admin, 
        N'Quản lý người dùng', 
        @MoTaLog;
        
    SELECT N'Cập nhật trạng thái người dùng thành công.' AS ThongBao;
END
GO

---------------------------------------------------------------------------------------------------
-- NHÓM 4: QUẢN LÝ DỊCH VỤ (SERVICE PARTNER MANAGEMENT)
---------------------------------------------------------------------------------------------------

-- GHI CHÚ: Proc_LayThongTinDichVu 
IF OBJECT_ID('Proc_LayThongTinDichVu', 'P') IS NOT NULL
    DROP PROCEDURE Proc_LayThongTinDichVu;
GO
CREATE PROCEDURE Proc_LayThongTinDichVu
    @MaND VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        DV.*, ND.HoTen, ND.Email, ND.SDT
    FROM Dichvucanhan DV
    JOIN NguoiDung ND ON DV.MaND = ND.MaND
    WHERE DV.MaND = @MaND;
END
GO

-- GHI CHÚ: Proc_CapNhatThongTinDichVu 
IF OBJECT_ID('Proc_CapNhatThongTinDichVu', 'P') IS NOT NULL
    DROP PROCEDURE Proc_CapNhatThongTinDichVu;
GO
CREATE PROCEDURE Proc_CapNhatThongTinDichVu
    @MaDV VARCHAR(10),
    @DiaChi NVARCHAR(255) = NULL,
    @TaiKhoanNganHang VARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @MaND VARCHAR(10);
    
    SELECT @MaND = MaND FROM Dichvucanhan WHERE MaDV = @MaDV;

    UPDATE Dichvucanhan
    SET 
        DiaChi = ISNULL(@DiaChi, DiaChi),
        TaiKhoanNganHang = ISNULL(@TaiKhoanNganHang, TaiKhoanNganHang)
    WHERE MaDV = @MaDV;

    EXEC Proc_GhiNhanHoatDong @MaND, N'Quản lý dịch vụ', N'Cập nhật thông tin Dịch vụ ' , @MaDV , N'.';
    SELECT N'Cập nhật thông tin dịch vụ thành công.' AS ThongBao;
END
GO


---------------------------------------------------------------------------------------------------
-- NHÓM 5: QUẢN LÝ MÓN & MENU (MENU MANAGEMENT)
---------------------------------------------------------------------------------------------------

-- GHI CHÚ: Proc_LayDanhSachMon 
IF OBJECT_ID('Proc_LayDanhSachMon', 'P') IS NOT NULL
    DROP PROCEDURE Proc_LayDanhSachMon;
GO
CREATE PROCEDURE Proc_LayDanhSachMon
AS
BEGIN
    SET NOCOUNT ON;
    SELECT MaMon, TenMon, LoaiMon, GiaTien FROM Mon ORDER BY LoaiMon, TenMon;
END
GO

-- GHI CHÚ: Proc_ThemMon 
IF OBJECT_ID('Proc_ThemMon', 'P') IS NOT NULL
    DROP PROCEDURE Proc_ThemMon;
GO
CREATE PROCEDURE Proc_ThemMon
    @MaND_DoiTac VARCHAR(10),
    @MaMon VARCHAR(10),
    @TenMon NVARCHAR(100),
    @LoaiMon NVARCHAR(50) = NULL,
    @GiaTien DECIMAL(18, 2)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM Dichvucanhan WHERE MaND = @MaND_DoiTac)
    BEGIN
        RAISERROR(N'Bạn không phải là Đối tác dịch vụ.', 16, 1)
        RETURN
    END

    BEGIN TRY
        INSERT INTO Mon (MaMon, TenMon, LoaiMon, GiaTien)
        VALUES (@MaMon, @TenMon, @LoaiMon, @GiaTien);

        EXEC Proc_GhiNhanHoatDong @MaND_DoiTac, N'Quản lý Menu', N'Thêm món ăn mới: ' , @TenMon , N'.';
        SELECT N'Đã thêm Món ' + @TenMon + N' thành công.' AS ThongBao;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END
GO

-- GHI CHÚ: Proc_LayDanhSachMenu (ĐÃ TỐI ƯU TRUY VẤN)
IF OBJECT_ID('Proc_LayDanhSachMenu', 'P') IS NOT NULL
    DROP PROCEDURE Proc_LayDanhSachMenu;
GO
CREATE PROCEDURE Proc_LayDanhSachMenu
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Tối ưu bằng cách dùng JOIN để truy xuất giá tiền hiệu quả hơn (tránh 5 subquery)
    SELECT 
        M.MaMenu, 
        M.TenMenu, 
        M.MoTa,
        -- Tính tổng tiền từ các cột GiaTien đã JOIN
        (MKV.GiaTien + M2.GiaTien + M3.GiaTien + M4.GiaTien + MT.GiaTien) AS TongTienThucTe
    FROM Menu M
    -- JOIN với bảng Mon cho từng món ăn
    JOIN Mon MKV ON M.MaMonKhaiVi = MKV.MaMon
    JOIN Mon M2 ON M.MaMon2 = M2.MaMon
    JOIN Mon M3 ON M.MaMon3 = M3.MaMon
    JOIN Mon M4 ON M.MaMon4 = M4.MaMon
    JOIN Mon MT ON M.MaMonTrangMieng = MT.MaMon
    ORDER BY MaMenu;
END
GO

-- GHI CHÚ: Proc_ThemMenu (ĐÃ TỐI ƯU TRUY VẤN TÍNH TỔNG TIỀN)
IF OBJECT_ID('Proc_ThemMenu', 'P') IS NOT NULL
    DROP PROCEDURE Proc_ThemMenu;
GO
CREATE PROCEDURE Proc_ThemMenu
    @MaND_DoiTac VARCHAR(10),
    @MaMenu VARCHAR(10),
    @TenMenu NVARCHAR(100),
    @MaMonKhaiVi VARCHAR(10),
    @MaMon2 VARCHAR(10),
    @MaMon3 VARCHAR(10),
    @MaMon4 VARCHAR(10),
    @MaMonTrangMieng VARCHAR(10),
    @MoTa NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @TongTien DECIMAL(18, 2);

    IF NOT EXISTS (SELECT 1 FROM Dichvucanhan WHERE MaND = @MaND_DoiTac)
    BEGIN
        RAISERROR(N'Bạn không phải là Đối tác dịch vụ.', 16, 1)
        RETURN
    END

    -- 1. Tính Tổng tiền (Tối ưu: Sử dụng UNION ALL và SUM)
    SELECT @TongTien = SUM(T.GiaTien)
    FROM (
        SELECT GiaTien FROM Mon WHERE MaMon = @MaMonKhaiVi 
        UNION ALL SELECT GiaTien FROM Mon WHERE MaMon = @MaMon2
        UNION ALL SELECT GiaTien FROM Mon WHERE MaMon = @MaMon3
        UNION ALL SELECT GiaTien FROM Mon WHERE MaMon = @MaMon4
        UNION ALL SELECT GiaTien FROM Mon WHERE MaMon = @MaMonTrangMieng
    ) AS T;
    
    IF @TongTien IS NULL OR @TongTien <= 0
    BEGIN
        RAISERROR(N'Mã Món không tồn tại hoặc giá tiền món không hợp lệ.', 16, 1)
        RETURN
    END

    -- 2. Thêm Menu mới
    BEGIN TRY
        SET @MoTa = ISNULL(@MoTa, FORMAT(@TongTien, '#,##0') + N' 1 bàn');
        
        INSERT INTO Menu (MaMenu, TenMenu, MaMonKhaiVi, MaMon2, MaMon3, MaMon4, MaMonTrangMieng, MoTa)
        VALUES (@MaMenu, @TenMenu, @MaMonKhaiVi, @MaMon2, @MaMon3, @MaMon4, @MaMonTrangMieng, @MoTa);

        EXEC Proc_GhiNhanHoatDong @MaND_DoiTac, N'Quản lý Menu', N'Thêm Menu mới: ' , @TenMenu , N'.';
        SELECT N'Đã thêm Menu ' + @TenMenu + N' thành công.' AS ThongBao;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END
GO

---------------------------------------------------------------------------------------------------
-- NHÓM 6: QUẢN LÝ ĐƠN HÀNG & HÓA ĐƠN
---------------------------------------------------------------------------------------------------

-- GHI CHÚ: Proc_DatDonHang (ĐÃ SỬA LỖI LOGIC VÀ TỐI ƯU TRUY VẤN TÍNH TỔNG TIỀN)
IF OBJECT_ID('Proc_DatDonHang', 'P') IS NOT NULL
    DROP PROCEDURE Proc_DatDonHang;
GO
CREATE PROCEDURE Proc_DatDonHang
    @MaDH VARCHAR(10),
    @MaDV VARCHAR(10),
    @MaMenu VARCHAR(10),
    @TenNgDung NVARCHAR(100),
    @SDT VARCHAR(20),
    @GioToChuc TIME,
    @EmailNgDat VARCHAR(100),
    @YeuCauThem NVARCHAR(500) = NULL,
    @TrangThai NVARCHAR(50) = N'Mới Tạo'
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @TongTien DECIMAL(18, 2)
    
    -- Tối ưu và SỬA LỖI LOGIC: Tính Tổng tiền của Menu (Tổng giá 5 món) bằng JOIN
    SELECT @TongTien = (MKV.GiaTien + M2.GiaTien + M3.GiaTien + M4.GiaTien + MT.GiaTien)
    FROM Menu M
    JOIN Mon MKV ON M.MaMonKhaiVi = MKV.MaMon
    JOIN Mon M2 ON M.MaMon2 = M2.MaMon
    JOIN Mon M3 ON M.MaMon3 = M3.MaMon
    JOIN Mon M4 ON M.MaMon4 = M4.MaMon
    JOIN Mon MT ON M.MaMonTrangMieng = MT.MaMon
    WHERE M.MaMenu = @MaMenu
    
    IF @TongTien IS NULL OR @TongTien <= 0
    BEGIN
        RAISERROR(N'Mã Menu không hợp lệ hoặc không tính được Tổng tiền Menu.', 16, 1)
        RETURN
    END

    BEGIN TRANSACTION
    BEGIN TRY
        -- 1. Insert DonHang
        INSERT INTO DonHang (MaDH, MaDV, NgayDat, TrangThai, TongTien)
        VALUES (@MaDH, @MaDV, GETDATE(), @TrangThai, @TongTien)
            
        -- 2. Insert ChiTietDonHang
        INSERT INTO ChiTietDonHang (MaCTDH, MaDH, TenNgDung, SDT, NgayDat, GioToChuc, EmailNgDat, MaMenu, TongTien, YeuCauThem)
        VALUES ('CT' + @MaDH, @MaDH, @TenNgDung, @SDT, GETDATE(), @GioToChuc, @EmailNgDat, @MaMenu, @TongTien, @YeuCauThem)

        COMMIT TRANSACTION
        SELECT N'Đã đặt Đơn hàng ' + @MaDH + N' thành công.' AS ThongBao;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION
        THROW;
    END CATCH
END
GO

-- GHI CHÚ: Proc_CapNhatTrangThaiDonHang (ĐÃ SỬA LỖI CÚ PHÁP CHUỖI EXEC)
IF OBJECT_ID('Proc_CapNhatTrangThaiDonHang', 'P') IS NOT NULL
    DROP PROCEDURE Proc_CapNhatTrangThaiDonHang;
GO
CREATE PROCEDURE Proc_CapNhatTrangThaiDonHang
    @MaDH VARCHAR(10),
    @TrangThaiMoi NVARCHAR(50),
    @MaND_CapNhat VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE DonHang
    SET TrangThai = @TrangThaiMoi
    WHERE MaDH = @MaDH;

    DECLARE @NgayDatDonHang NVARCHAR(20);
    SELECT @NgayDatDonHang = FORMAT(NgayDat, 'dd/MM/yyyy') FROM DonHang WHERE MaDH = @MaDH;

    -- Sửa lỗi: Nối chuỗi mô tả đúng cú pháp
    DECLARE @MoTaLog NVARCHAR(255) = N'Đơn hàng ' + @MaDH + N' ngày ' + @NgayDatDonHang + N' vừa cập nhật trạng thái thành ' + @TrangThaiMoi + N'.';
    EXEC Proc_GhiNhanHoatDong @MaND_CapNhat, N'Quản lý Đơn hàng', @MoTaLog;

    SELECT N'Đã cập nhật trạng thái Đơn hàng ' + @MaDH + N' thành ' + @TrangThaiMoi + '.' AS ThongBao;
END
GO

-- GHI CHÚ: Proc_ThemHoaDon 
IF OBJECT_ID('Proc_ThemHoaDon', 'P') IS NOT NULL
    DROP PROCEDURE Proc_ThemHoaDon;
GO
CREATE PROCEDURE Proc_ThemHoaDon
    @MaHD VARCHAR(10),
    @MaDH VARCHAR(10),
    @PhuongThucThanhToan NVARCHAR(50),
    @MaND_DoiTac VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @TongTienDH DECIMAL(18, 2)

    -- 1. Kiểm tra tồn tại và lấy Tổng tiền
    SELECT @TongTienDH = TongTien FROM DonHang WHERE MaDH = @MaDH;

    IF @TongTienDH IS NULL OR EXISTS (SELECT 1 FROM HoaDon WHERE MaDH = @MaDH)
    BEGIN
        RAISERROR(N'Lỗi: Mã Đơn hàng không tồn tại hoặc đã có Hóa Đơn.', 16, 1)
        RETURN
    END

    BEGIN TRY
        INSERT INTO HoaDon (MaHD, MaDH, NgayLap, TongTien, PhuongThucThanhToan)
        VALUES (@MaHD, @MaDH, GETDATE(), @TongTienDH, @PhuongThucThanhToan);

        EXEC Proc_GhiNhanHoatDong @MaND_DoiTac, N'Quản lý Đơn hàng', N'Lập Hóa Đơn ' , @MaHD , N' cho Đơn hàng ' , @MaDH , N'.';
        SELECT N'Đã lập Hóa Đơn ' + @MaHD + N' thành công.' AS ThongBao;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END
GO


---------------------------------------------------------------------------------------------------
-- NHÓM 7: BÁO CÁO & LỊCH SỬ (REPORTING & HISTORY)
---------------------------------------------------------------------------------------------------

-- GHI CHÚ: Proc_LayLichHoatDong (ĐÃ SỬA TÊN BẢNG)
IF OBJECT_ID('Proc_LayLichHoatDong', 'P') IS NOT NULL
    DROP PROCEDURE Proc_LayLichHoatDong;
GO
CREATE PROCEDURE Proc_LayLichHoatDong
    @MaND VARCHAR(10) = NULL -- Nếu NULL, lấy tất cả (dùng cho Admin)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Sử dụng LichHoatDong_DV để đồng nhất
    SELECT 
        LHD.ThoiGian, 
        LHD.LoaiHoatDong, 
        LHD.MoTaChiTiet,
        ND.HoTen
    FROM LichHoatDong_DV LHD
    JOIN Dichvucanhan DV ON LHD.MaDV = DV.MaDV
    JOIN NguoiDung ND ON DV.MaND = ND.MaND
    WHERE DV.MaND = ISNULL(@MaND, DV.MaND) 
    ORDER BY LHD.ThoiGian DESC;
END
GO