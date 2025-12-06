// js/navbar.js
// Mục đích: Quản lý giao diện, tương tác của Header/Navbar và trạng thái Đăng nhập/Đăng xuất

document.addEventListener('DOMContentLoaded', function() {
    
    // ----------------------------------------------------
    // 1. KHAI BÁO BIẾN
    // ----------------------------------------------------
    const toggleBtn = document.getElementById('menuToggle');
    const dropdown = document.getElementById('myDropdown');
    const notificationToggle = document.getElementById('notificationToggle');
    const notificationMenu = document.getElementById('notificationMenu');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const serviceRegisterMenuItemEl = document.getElementById('menuServiceRegister');
    const yourServiceMenuItem = document.getElementById('menuYourService');
    const menuHomeEl = document.getElementById('menuHome'); 

    // Lấy trạng thái đăng nhập từ localStorage
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; 

    // ----------------------------------------------------
    // 2. HÀM CẬP NHẬT GIAO DIỆN SAU ĐĂNG NHẬP (Global Function)
    // Cần có window. để main.js có thể gọi sau khi đăng nhập thành công
    // ----------------------------------------------------
    window.updateUIAfterLogin = function() {
        if (loginBtn) loginBtn.classList.add('hidden');
        if (signupBtn) signupBtn.classList.add('hidden');
        
        notificationToggle.classList.remove('hidden');
        toggleBtn.classList.remove('hidden');
        if (logoutBtn) logoutBtn.classList.remove('hidden');
        
        // Cập nhật trạng thái Dịch vụ
        if (localStorage.getItem('isServiceRegistered') === 'true') {
            if (serviceRegisterMenuItemEl) serviceRegisterMenuItemEl.classList.add('hidden');
            if (yourServiceMenuItem) yourServiceMenuItem.classList.remove('hidden');
        } else {
             if (serviceRegisterMenuItemEl) serviceRegisterMenuItemEl.classList.remove('hidden');
             if (yourServiceMenuItem) yourServiceMenuItem.classList.add('hidden');
        }
    }

    // ----------------------------------------------------
    // 3. LOGIC TƯƠNG TÁC CHÍNH CỦA NAVBAR
    // ----------------------------------------------------
    
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
               notificationToggle.classList.add('hidden');
               toggleBtn.classList.add('hidden');
               logoutBtn.classList.add('hidden');
               dropdown.classList.remove('show');
               notificationMenu.classList.remove('show');
            
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
            dropdown.classList.toggle('show');
            notificationMenu.classList.remove('show');
        });
    }

    // 3.3 Bắt sự kiện click vào notification bell
    if (notificationToggle) {
        notificationToggle.addEventListener('click', function(event) {
            event.stopPropagation();
            notificationMenu.classList.toggle('show');
            dropdown.classList.remove('show');
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
            dropdown.classList.remove('show'); 
            window.location.href = '/'; 
        });
    }

    // 3.6 Cập nhật UI ngay khi trang tải xong nếu người dùng đã đăng nhập trước đó
    if (isLoggedIn) {
        updateUIAfterLogin();
    }
});