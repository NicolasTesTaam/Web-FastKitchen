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
    const logoutBtn = document.getElementById('logoutBtn');
    const menuHomeEl = document.getElementById('menuHome');

    // Lấy trạng thái đăng nhập từ localStorage
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; 
    let isServiceRegistered = localStorage.getItem('isServiceRegistered') === 'true';

    // ----------------------------------------------------
    // 2. HÀM CẬP NHẬT GIAO DIỆN SAU ĐĂNG NHẬP (Global Function)
    // ----------------------------------------------------
    window.updateUIAfterLogin = function() {
        isLoggedIn = true;
        localStorage.setItem('isLoggedIn', 'true');
        
        // Hiện notification và menu toggle
        if (notificationToggle) notificationToggle.classList.remove('hidden');
        if (toggleBtn) toggleBtn.classList.remove('hidden');
        if (logoutBtn) logoutBtn.classList.remove('hidden');
        
        // Cập nhật trạng thái Dịch vụ nếu có
        if (isServiceRegistered) {
            updateServiceMenuItems(true);
        }
    }

    // ----------------------------------------------------
    // 3. HÀM CẬP NHẬT MENU DỊCH VỤ
    // ----------------------------------------------------
    window.updateServiceMenuItems = function(isRegistered) {
        const serviceRegisterMenuItemEl = document.getElementById('menuServiceRegister');
        const yourServiceMenuItem = document.getElementById('menuYourService');
        
        if (isRegistered) {
            if (serviceRegisterMenuItemEl) serviceRegisterMenuItemEl.classList.add('hidden');
            if (yourServiceMenuItem) yourServiceMenuItem.classList.remove('hidden');
            localStorage.setItem('isServiceRegistered', 'true');
        } else {
            if (serviceRegisterMenuItemEl) serviceRegisterMenuItemEl.classList.remove('hidden');
            if (yourServiceMenuItem) yourServiceMenuItem.classList.add('hidden');
            localStorage.removeItem('isServiceRegistered');
        }
    }

    // ----------------------------------------------------
    // 4. LOGIC TƯƠNG TÁC CHÍNH CỦA NAVBAR
    // ----------------------------------------------------
    
    // 4.1 Xử lý click Đăng xuất
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(event) {
            event.preventDefault();
            
            const isConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất không?");
            
            if (isConfirmed) {
               // Xóa tất cả trạng thái
               localStorage.removeItem('isLoggedIn');
               localStorage.removeItem('isServiceRegistered');
               localStorage.removeItem('userData');

               // Reset UI
               if (notificationToggle) notificationToggle.classList.add('hidden');
               if (toggleBtn) toggleBtn.classList.add('hidden');
               if (logoutBtn) logoutBtn.classList.add('hidden');
               
               // Đóng menu
               if (dropdown) dropdown.classList.remove('show');
               if (notificationMenu) notificationMenu.classList.remove('show');
               
               // Reset menu items
               updateServiceMenuItems(false);
               
               // Chuyển về trang chủ
               window.location.href = "/";
            }
        });
    }

    // 4.2 Bắt sự kiện click vào nút Hamburger
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function(event) {
            event.stopPropagation(); 
            if (dropdown) dropdown.classList.toggle('show');
            if (notificationMenu) notificationMenu.classList.remove('show');
        });
    }

    // 4.3 Bắt sự kiện click vào notification bell
    if (notificationToggle) {
        notificationToggle.addEventListener('click', function(event) {
            event.stopPropagation();
            if (notificationMenu) notificationMenu.classList.toggle('show');
            if (dropdown) dropdown.classList.remove('show');
        });
    }

    // 4.4 Đóng menu khi click bất kỳ đâu bên ngoài (Global click listener)
    document.addEventListener('click', function(event) {
        if (dropdown && !dropdown.contains(event.target) && toggleBtn && !toggleBtn.contains(event.target)) {
            dropdown.classList.remove('show');
        }
        if (notificationMenu && !notificationMenu.contains(event.target) && notificationToggle && !notificationToggle.contains(event.target)) {
            notificationMenu.classList.remove('show');
        }
    });

    // 4.5 Xử lý click vào "Trang chủ" trong menu
    if (menuHomeEl) {
        menuHomeEl.addEventListener('click', function(event) {
            event.preventDefault(); 
            if (dropdown) dropdown.classList.remove('show'); 
            window.location.href = '/'; 
        });
    }

    // 4.6 Cập nhật UI ngay khi trang tải xong nếu người dùng đã đăng nhập
    if (isLoggedIn) {
        // Hiện các nút cho người dùng đã đăng nhập
        if (notificationToggle) notificationToggle.classList.remove('hidden');
        if (toggleBtn) toggleBtn.classList.remove('hidden');
        if (logoutBtn) logoutBtn.classList.remove('hidden');
        
        // Cập nhật menu dịch vụ nếu cần
        if (isServiceRegistered) {
            updateServiceMenuItems(true);
        }
    }

    // 4.7 Thêm các sự kiện cho các menu item khác
    const menuItems = document.querySelectorAll('.menu-item:not(#menuHome):not(#logoutBtn)');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            if (dropdown) dropdown.classList.remove('show');
        });
    });
});
// Thêm vào cuối tes.js hoặc tạo file riêng

// FAQ Accordion functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Đóng tất cả các FAQ khác
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle FAQ hiện tại
            item.classList.toggle('active');
        });
    });
    
    // Simulated live chat
    const chatButtons = document.querySelectorAll('.start-chat-btn');
    chatButtons.forEach(button => {
        button.addEventListener('click', function() {
            const chatType = this.dataset.chatType;
            alert(`Đang kết nối đến ${chatType}...\nHệ thống sẽ chuyển hướng bạn đến kênh hỗ trợ phù hợp.`);
        });
    });
});