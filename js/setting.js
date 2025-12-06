document.addEventListener('DOMContentLoaded', function() {

    // Khởi tạo trạng thái Đăng nhập/Đăng xuất
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // THAY THẾ: Lấy User ID hiện tại từ sessionStorage
    let currentUserId = sessionStorage.getItem('currentUserId') || '';

    // Lấy các phần tử Header
    const menuToggle = document.getElementById('menuToggle');
    const myDropdown = document.getElementById('myDropdown');
    const notificationToggle = document.getElementById('notificationToggle');
    const notificationMenu = document.getElementById('notificationMenu');

   // Các nút liên quan đến trạng thái đăng nhập
    const logoutBtn = document.getElementById('logoutBtn');
    // const loginBtn = document.getElementById('loginBtn'); // KHÔNG DÙNG
    // const signupBtn = document.getElementById('signupBtn'); // KHÔNG DÙNG
    const menuYourService = document.getElementById('menuYourService');
    
   // Bổ sung: Lấy form và các trường input liên quan đến Profile
    const profileForm = document.getElementById('profileForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const usernameDisplay = document.getElementById('usernameDisplay'); // Sẽ hiển thị email/ID
    
   // Bổ sung: Lấy dữ liệu người dùng từ localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    // TÌM NGƯỜI DÙNG HIỆN TẠI DỰA TRÊN USER ID
    let currentUserData = users.find(u => u.userId === currentUserId);

    // ====================================================================
    // 1. HÀM TẢI DỮ LIỆU CÁ NHÂN TỪ LOCALSTORAGE (LOAD)
    // ====================================================================

    function loadUserProfileData() {
        // Chỉ tải dữ liệu nếu có User ID hiện tại
        if (!currentUserId) {
            console.warn("Không tìm thấy currentUserId. Vui lòng đăng nhập.");
            // CHUYỂN HƯỚNG VỀ TRANG CHỦ HOẶC ĐĂNG NHẬP NẾU CẦN
            window.location.href = '/'; 
            return;
        }

        if (currentUserData) {
            // Hiển thị email hoặc User ID
            if (usernameDisplay) {
                usernameDisplay.textContent = currentUserData.email || currentUserId;
            }
            // Điền dữ liệu vào form
            if (fullNameInput) {
                fullNameInput.value = currentUserData.fullName || '';
            }
            if (emailInput) {
                emailInput.value = currentUserData.email || '';
                emailInput.disabled = true; // KHÔNG CHO PHÉP ĐỔI EMAIL
            }
            if (phoneInput) {
                phoneInput.value = currentUserData.phone || '';
            }
            if (addressInput) {
                addressInput.value = currentUserData.address || '';
            }
        } else {
            console.error("Không tìm thấy dữ liệu người dùng cho userId:", currentUserId);
             // CHUYỂN HƯỚNG VỀ TRANG CHỦ HOẶC ĐĂNG NHẬP NẾU CẦN
            window.location.href = '/'; 
        }
    }
    
    // ====================================================================
    // 2. HÀM LƯU DỮ LIỆU CÁ NHÂN VÀO LOCALSTORAGE (SAVE/UPDATE)
    // ====================================================================

    function saveUserProfileData() {
        if (!currentUserId) return false;

        const userIndex = users.findIndex(u => u.userId === currentUserId);

        if (userIndex !== -1) {
            // Cập nhật dữ liệu người dùng hiện tại từ form
            users[userIndex].fullName = fullNameInput.value;
            // email đã bị disabled nên không cần cập nhật
            users[userIndex].phone = phoneInput.value;
            users[userIndex].address = addressInput.value;

            // Lưu mảng users đã cập nhật trở lại localStorage
            localStorage.setItem('users', JSON.stringify(users));
            // Cập nhật lại biến cục bộ sau khi lưu
            currentUserData = users[userIndex]; 
            return true;
        }
        return false;
    }

    // Hàm chung để đóng/mở menu (Giữ nguyên)
    function toggleMenu(menu) {
        if (!isLoggedIn && (menu === notificationMenu)) {
             return;
        }
        const isActive = menu.classList.contains('active');
        if (menu === myDropdown && notificationMenu.classList.contains('active')) {
            notificationMenu.classList.remove('active');
        } else if (menu === notificationMenu && myDropdown.classList.contains('active')) {
            myDropdown.classList.remove('active');
        }
        if (isActive) {
            menu.classList.remove('active');
        } else {
            menu.classList.add('active');
        }
    }

    // Gắn sự kiện cho Menu và Notification (Giữ nguyên)
    menuToggle.addEventListener('click', () => toggleMenu(myDropdown));
    notificationToggle.addEventListener('click', () => toggleMenu(notificationMenu));

    // Đóng menu khi click bên ngoài (Giữ nguyên)
    document.addEventListener('click', function(event) {
        if (!menuToggle.contains(event.target) && !myDropdown.contains(event.target)) {
            myDropdown.classList.remove('active');
        }
        if (!notificationToggle.contains(event.target) && !notificationMenu.contains(event.target)) {
            notificationMenu.classList.remove('active');
        }
    });

    // Hàm cập nhật hiển thị các nút/menu dựa trên trạng thái đăng nhập (Giữ nguyên)
    function updateAuthButtons() {
        if (isLoggedIn) {
            logoutBtn.classList.remove('hidden');
            menuToggle.classList.remove('hidden');
            notificationToggle.classList.remove('hidden');
        } else {
            logoutBtn.classList.add('hidden');
            menuToggle.classList.add('hidden');
            notificationToggle.classList.add('hidden');
            if (menuYourService) menuYourService.classList.add('hidden');
        }
    }

    function saveUserProfileData() {
        if (!currentUserId) return false;

        const userIndex = users.findIndex(u => u.userId === currentUserId);

        if (userIndex !== -1) {
            // Cập nhật dữ liệu người dùng hiện tại từ form
            users[userIndex].fullName = fullNameInput.value;
            // email đã bị disabled nên không cần cập nhật
            users[userIndex].phone = phoneInput.value;
            users[userIndex].address = addressInput.value;

            // Lưu mảng users đã cập nhật trở lại localStorage
            localStorage.setItem('users', JSON.stringify(users));
            // Cập nhật lại biến cục bộ sau khi lưu
            currentUserData = users[userIndex]; 
            return true;
        }
        return false;
    }
    // ⬅️ GỌI HÀM TẢI DỮ LIỆU NGAY
    loadUserProfileData(); 

    // Thực thi lần đầu để thiết lập trạng thái ban đầu
    updateAuthButtons();
    // CẬP NHẬT: Xử lý submit Form Profile để lưu dữ liệu
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (saveUserProfileData()) {
            displayMessage('profileMessage', 'Cập nhật thông tin thành công!', 'success');
        } else {
            displayMessage('profileMessage', 'Lỗi: Không tìm thấy người dùng hoặc currentUserId không có.', 'error');
        }
    });

    // ====================================================================
    // 3. Logic đặc thù của Trang Cài Đặt (Sidebar Navigation) - Giữ nguyên
    // ====================================================================

    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const contentSections = document.querySelectorAll('.content-section');

    sidebarItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');

            sidebarItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            contentSections.forEach(section => section.classList.remove('active'));

            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                history.pushState(null, '', `#${targetId}`);
            }
        });
    });

    const initialHash = window.location.hash.substring(1);
    const defaultTarget = 'profile';

    if (initialHash) {
        const initialTarget = document.querySelector(`.sidebar-item[data-target="${initialHash}"]`);
        if (initialTarget) {
            initialTarget.click();
        } else {
            document.querySelector(`.sidebar-item[data-target="${defaultTarget}"]`).click();
        }
    } else {
        document.querySelector(`.sidebar-item[data-target="${defaultTarget}"]`).click();
    }


    // ====================================================================
    // 4. Logic Form và chức năng khác (CẬP NHẬT: Form Profile)
    // ====================================================================

    function displayMessage(id, message, type) {
        const msgEl = document.getElementById(id);
        msgEl.className = 'info-message';
        msgEl.textContent = message;
        msgEl.classList.add(type);

        setTimeout(() => {
            msgEl.classList.remove('success', 'error');
        }, 5000);
    }
    window.displayMessage = displayMessage;

    // CẬP NHẬT: Xử lý submit Form Profile để lưu dữ liệu
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (saveUserProfileData()) {
            displayMessage('profileMessage', 'Cập nhật thông tin thành công!', 'success');
        } else {
            displayMessage('profileMessage', 'Lỗi: Không tìm thấy người dùng hoặc currentUsername không có.', 'error');
        }
    });

    const passwordForm = document.getElementById('passwordForm');
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newPass = document.getElementById('newPassword').value;
        const confirmPass = document.getElementById('confirmPassword').value;

        if (newPass !== confirmPass) {
            displayMessage('passwordMessage', 'Lỗi: Mật khẩu mới và xác nhận mật khẩu không khớp.', 'error');
        } else if (newPass.length < 6) {
             displayMessage('passwordMessage', 'Lỗi: Mật khẩu phải có ít nhất 6 ký tự.', 'error');
        } else {
            displayMessage('passwordMessage', 'Mật khẩu đã được đổi thành công! (Mô phỏng)', 'success');
            passwordForm.reset();
        }
    });

    window.handleForgotPassword = function(e) {
        e.preventDefault();
        displayMessage('passwordMessage', 'Yêu cầu đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư. (Mô phỏng)', 'success');
    }

    window.saveNotificationSettings = function() {
        displayMessage('notificationMessage', 'Tùy chỉnh thông báo đã được lưu thành công! (Mô phỏng)', 'success');
    }

    window.confirmAccountDeletion = function() {
        const confirmation = prompt("Vui lòng gõ 'XÁC NHẬN XÓA' để tiếp tục xóa tài khoản:");

        if (confirmation === 'XÁC NHẬN XÓA') {
            displayMessage('dataMessage', 'Yêu cầu xóa tài khoản của bạn đang được xử lý. (Mô phỏng)', 'success');
        } else if (confirmation !== null) {
            displayMessage('dataMessage', 'Hủy yêu cầu xóa hoặc chuỗi xác nhận không đúng.', 'error');
        }
    }
});