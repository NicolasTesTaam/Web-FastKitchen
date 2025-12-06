document.addEventListener('DOMContentLoaded', function() {
    
    // ----------------------------------------------------
    // 1. KHAI BÁO BIẾN (TỪ tes.js)
    // ----------------------------------------------------
    const toggleBtn = document.getElementById('menuToggle');
    const dropdown = document.getElementById('myDropdown');
    const notificationToggle = document.getElementById('notificationToggle');
    const notificationMenu = document.getElementById('notificationMenu');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn'); // Không có trong HTML, nhưng giữ lại logic
    const logoutBtn = document.getElementById('logoutBtn');
    const serviceRegisterMenuItemEl = document.getElementById('menuServiceRegister');
    const yourServiceMenuItem = document.getElementById('menuYourService');
    const menuHomeEl = document.getElementById('menuHome'); 

    // Lấy trạng thái đăng nhập từ localStorage
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; 

    // ----------------------------------------------------
    // 2. HÀM CẬP NHẬT GIAO DIỆN SAU ĐĂNG NHẬP (TỪ tes.js)
    // ----------------------------------------------------
    window.updateUIAfterLogin = function() {
        if (loginBtn) loginBtn.classList.add('hidden');
        if (signupBtn) signupBtn.classList.add('hidden');
        
        if (notificationToggle) notificationToggle.classList.remove('hidden');
        if (toggleBtn) toggleBtn.classList.remove('hidden');
        if (logoutBtn) logoutBtn.classList.remove('hidden');
        
        // Cập nhật trạng thái Dịch vụ (Logic này áp dụng cho user thường, không phải Admin)
        if (localStorage.getItem('isServiceRegistered') === 'true') {
            if (serviceRegisterMenuItemEl) serviceRegisterMenuItemEl.classList.add('hidden');
            if (yourServiceMenuItem) yourServiceMenuItem.classList.remove('hidden');
        } else {
             if (serviceRegisterMenuItemEl) serviceRegisterMenuItemEl.classList.remove('hidden');
             if (yourServiceMenuItem) yourServiceMenuItem.classList.add('hidden');
        }
    }

    // ----------------------------------------------------
    // 3. LOGIC TƯƠNG TÁC CHÍNH CỦA NAVBAR (TỪ tes.js)
    // ----------------------------------------------------
    
    // Xử lý click Đăng nhập (TESTING ONLY)
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            localStorage.setItem('isLoggedIn', 'true');
            alert('Đăng nhập thành công! UI sẽ được cập nhật.');
            window.updateUIAfterLogin();
        });
    }

    // 3.1 Xử lý click Đăng xuất
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(event) {
            event.preventDefault();
            
            const isConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất không?");
            
            if (isConfirmed) {
               localStorage.setItem('isLoggedIn', 'false'); // XÓA TRẠNG THÁI ĐĂNG NHẬP
               localStorage.removeItem('isServiceRegistered'); // Xóa trạng thái dịch vụ

               if (loginBtn) loginBtn.classList.remove('hidden');
               if (signupBtn) signupBtn.classList.remove('hidden');
               if (notificationToggle) notificationToggle.classList.add('hidden');
               if (toggleBtn) toggleBtn.classList.add('hidden');
               if (logoutBtn) logoutBtn.classList.add('hidden');
               if (dropdown) dropdown.classList.remove('show');
               if (notificationMenu) notificationMenu.classList.remove('show');
            
               // Reset menu items visibility
               if (serviceRegisterMenuItemEl) serviceRegisterMenuItemEl.classList.remove('hidden');
               if (yourServiceMenuItem) yourServiceMenuItem.classList.add('hidden');
                
               window.location.href = "/";
            }
        });
    }


    // 3.2 Bắt sự kiện click vào nút Hamburger
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function(event) {
            event.stopPropagation(); 
            if (dropdown) dropdown.classList.toggle('show');
            if (notificationMenu) notificationMenu.classList.remove('show');
        });
    }

    // 3.3 Bắt sự kiện click vào notification bell
    if (notificationToggle) {
        notificationToggle.addEventListener('click', function(event) {
            event.stopPropagation();
            if (notificationMenu) notificationMenu.classList.toggle('show');
            if (dropdown) dropdown.classList.remove('show');
        });
    }

    // 3.4 Đóng menu khi click bất kỳ đâu bên ngoài (Global click listener)
    document.addEventListener('click', function(event) {
        if (dropdown && !dropdown.contains(event.target) && toggleBtn && !toggleBtn.contains(event.target)) {
            dropdown.classList.remove('show');
        }
        if (notificationMenu && !notificationMenu.contains(event.target) && notificationToggle && !notificationToggle.contains(event.target)) {
            notificationMenu.classList.remove('show');
        }
    });

    // 3.5 Xử lý click vào "Trang chủ" trong menu
    if (menuHomeEl) {
        menuHomeEl.addEventListener('click', function(event) {
            event.preventDefault(); 
            if (dropdown) dropdown.classList.remove('show'); 
            window.location.href = '/'; 
        });
    }

    // 3.6 Cập nhật UI ngay khi trang tải xong nếu người dùng đã đăng nhập trước đó
    if (isLoggedIn) {
        updateUIAfterLogin();
    }

    // ----------------------------------------------------
    // 4. LOGIC ADMIN DASHBOARD (TỪ CÁC CÂU TRẢ LỜI TRƯỚC)
    // ----------------------------------------------------
    
    // Tự động load module "Tổng Quan" khi trang được tải
    loadModule('overview');


    function loadModule(moduleName) {
        const contentArea = document.getElementById('content-area');
        const adminMenu = document.getElementById('admin-menu');
        const sidebarItems = adminMenu.querySelectorAll('li');

        // Cập nhật trạng thái Active trên Sidebar
        sidebarItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('onclick').includes(`'${moduleName}'`)) {
                item.classList.add('active');
            }
        });

        let contentHTML = '';

        switch (moduleName) {
            case 'overview':
                contentHTML = `
                    <div class="module-content">
                        <h2>Tổng Quan</h2>
                        <h3>Thống kê nhanh</h3>
                        <p>Tổng Tài khoản: **1,250**</p>
                        <p>Tổng Giao dịch hôm nay: **50**</p>
                        <p>Khiếu nại chưa xử lý: **5**</p>
                    </div>
                `;
                break;
            case 'users':
                contentHTML = `
                    <div class="module-content">
                        <div class="header-action">
                            <h3>Quản lý Tài khoản</h3>
                            <button class="btn-add"><i class="fas fa-plus"></i> Thêm Tài khoản</button>
                        </div>
                    
                        <div class="filter-search">
                            <input type="text" placeholder="Tìm kiếm theo Tên hoặc Email...">
                            <select>
                                <option value="all">Tất cả Trạng thái</option>
                                <option value="active">Đang hoạt động</option>
                                <option value="locked">Bị khóa</option>
                            </select>
                        </div>
                    
                        <table id="user-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên Người Dùng</th>
                                    <th>Email</th>
                                    <th>Ngày Đăng Ký</th>
                                    <th>Vai Trò</th>
                                    <th>Trạng Thái</th>
                                    <th>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1001</td>
                                    <td>Nguyễn Văn A</td>
                                    <td>vana@example.com</td>
                                    <td>2024-10-01</td>
                                    <td>Người bán</td>
                                    <td><span class="status active">Đang hoạt động</span></td>
                                    <td>
                                        <button class="btn-action view" title="Xem chi tiết"><i class="fas fa-eye"></i></button>
                                        <button class="btn-action lock" title="Khóa tài khoản"><i class="fas fa-lock"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>1002</td>
                                    <td>Trần Thị B</td>
                                    <td>thib@example.com</td>
                                    <td>2024-10-15</td>
                                    <td>Người mua</td>
                                    <td><span class="status locked">Bị khóa</span></td>
                                    <td>
                                        <button class="btn-action view" title="Xem chi tiết"><i class="fas fa-eye"></i></button>
                                        <button class="btn-action unlock" title="Mở khóa tài khoản"><i class="fas fa-unlock"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>1003</td>
                                    <td>Lê Văn C</td>
                                    <td>vanc@example.com</td>
                                    <td>2024-11-20</td>
                                    <td>Người bán</td>
                                    <td><span class="status active">Đang hoạt động</span></td>
                                    <td>
                                        <button class="btn-action view" title="Xem chi tiết"><i class="fas fa-eye"></i></button>
                                        <button class="btn-action lock" title="Khóa tài khoản"><i class="fas fa-lock"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `;
                break;
            case 'posts':
                 contentHTML = `<div class="module-content"><h2>Quản lý Bài đăng</h2><p>Hiển thị bảng bài đăng (cần duyệt, đã duyệt)...</p></div>`;
                 break;
            case 'transactions':
                 contentHTML = `<div class="module-content"><h2>Quản lý Giao dịch</h2><p>Bảng giao dịch và cấu hình phí %...</p></div>`;
                 break;
            case 'complaints':
                 contentHTML = `<div class="module-content"><h2>Quản lý Khiếu nại</h2><p>Bộ lọc khiếu nại hệ thống / dịch vụ...</p></div>`;
                 break;
            case 'reports':
                 contentHTML = `<div class="module-content"><h2>Báo cáo Thống kê</h2><p>Biểu đồ số liệu người dùng, doanh thu...</p></div>`;
                 break;
            default:
                contentHTML = '<div class="module-content"><h3>Lỗi 404</h3><p>Mô-đun này chưa được triển khai.</p></div>';
                break;
        }

        // Gán nội dung mới
        contentArea.innerHTML = contentHTML;
    }
    // Gắn hàm loadModule vào window để có thể gọi từ HTML (onlick)
    window.loadModule = loadModule;
});