CREATE PROCEDURE Proc_GhiNhanHoatDong
(
	IN p_MaND VARCHAR(10),
	IN p_LoaiHoatDong NVARCHAR(50),
	IN p_MoTaChiTiet NVARCHAR(255)
)
BEGIN
	
	DECLARE v_MaHD VARCHAR(20);
    SET v_MaHD = CONCAT('LOG', DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')); 
    
    
    DECLARE v_MaDV VARCHAR(10);
    SELECT MaDV INTO v_MaDV FROM Dichvucanhan WHERE MaND = p_MaND;

	
	INSERT INTO LichHoatDong_DV (MaHD, MaDV, ThoiGian, LoaiHoatDong, MoTaChiTiet)
	VALUES (v_MaHD, IFNULL(v_MaDV, 'DVNULL'), NOW(), p_LoaiHoatDong, p_MoTaChiTiet);
END;