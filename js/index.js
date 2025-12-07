document.addEventListener('DOMContentLoaded', function() {
    
    // ====================================================================
    // 1. CẤU HÌNH VÀ KHAI BÁO BIẾN
    // ====================================================================
    
    // ĐỊNH NGHĨA BASE URL CHO TẤT CẢ CÁC GỌI API
    // VÍ DỤ: Nếu dự án của bạn là http://localhost:8888/FASTKITCHEN/
    const API_BASE_URL = 'http://localhost:8888/FASTKITCHEN/api'; 
    // KIỂM TRA VÀ SỬA ĐƯỜNG DẪN NÀY CHO PHÙ HỢP VỚI CẤU HÌNH LARAGON CỦA BẠN
    
    // Khai báo các phần tử DOM
    const toggleBtn = document.getElementById('menuToggle');
    const dropdown = document.getElementById('myDropdown');
    const notificationToggle = document.getElementById('notificationToggle');
    const notificationMenu = document.getElementById('notificationMenu');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const serviceRegisterModal = document.getElementById('serviceRegisterModal');
    const serviceRegisterForm = document.getElementById('serviceRegisterForm');
    const serviceBtn = document.getElementById('serviceBtn');
    const menuHomeEl = document.getElementById('menuHome'); 

    // Biến trạng thái cục bộ
    let isLoggedIn = false; 
    let isServiceRegistered = false;

    // ====================================================================
    // 2. CÁC HÀM TIỆN ÍCH CHO API
    // ====================================================================

    // Hàm chung để gửi yêu cầu POST API
    async function postData(url, data) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // QUAN TRỌNG: credentials: 'include' để gửi cookies (PHP Session ID)
            credentials: 'include', 
            body: JSON.stringify(data)
        });

        // Bóc tách JSON response ngay cả khi có lỗi HTTP (để lấy thông báo chi tiết từ PHP)
        return response.json().then(data => {
            if (!response.ok) {
                // Ném lỗi với thông báo chi tiết từ server (data.message)
                throw new Error(data.message || `Lỗi HTTP: ${response.status}`);
            }
            return data;
        });
    }

    // Hàm cập nhật UI sau khi đăng nhập (Được gọi sau check status, login, signup)
    function updateUIAfterLogin(isService) {
        isLoggedIn = true;
        
        loginBtn.classList.add('hidden');
        signupBtn.classList.add('hidden');
        notificationToggle.classList.remove('hidden');
        toggleBtn.classList.remove('hidden');
        logoutBtn.classList.remove('hidden');
        
        const serviceRegisterMenuItem = document.getElementById('menuServiceRegister');
        const yourServiceMenuItem = document.getElementById('menuYourService');
        
        if (isService) {
             isServiceRegistered = true;
             if (serviceRegisterMenuItem) serviceRegisterMenuItem.classList.add('hidden');
             if (yourServiceMenuItem) yourServiceMenuItem.classList.remove('hidden');
         } else {
             isServiceRegistered = false;
             if (serviceRegisterMenuItem) serviceRegisterMenuItem.classList.remove('hidden');
             if (yourServiceMenuItem) yourServiceMenuItem.classList.add('hidden');
         }
    }

    // Xử lý check trạng thái khi tải trang (Gọi API: check_status.php)
    async function checkUserStatus() {
        try {
            const statusUrl = `${API_BASE_URL}/check_status.php`;
            const response = await fetch(statusUrl, { credentials: 'include' });
            
            // Xử lý lỗi HTTP trước khi cố gắng đọc JSON
            if (!response.ok) { 
                throw new Error(`Server status check failed: ${response.status}`);
            }

            const data = await response.json();

            if (data.isLoggedIn) {
                // Lưu ID và trạng thái từ Server vào sessionStorage
                sessionStorage.setItem('currentUserId', data.userId); 
                
                if (data.isServiceRegistered) {
                    sessionStorage.setItem('currentUserServiceId', data.serviceId); 
                }

                updateUIAfterLogin(data.isServiceRegistered);
            }
        } catch (error) {
            isLoggedIn = false;
            console.error('Lỗi khi kiểm tra trạng thái người dùng:', error);
            // Không cần alert nếu lỗi ở đây là do check status thất bại, chỉ cần giữ trạng thái là chưa đăng nhập
        }
    }
    
    // GỌI HÀM CHECK STATUS KHI TRANG TẢI
    checkUserStatus();

    // ====================================================================
    // 3. XỬ LÝ SỰ KIỆN FORM (API CALLS)
    // ====================================================================

    // Xử lý submit form Đăng nhập (Gọi API: login.php)
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const loginEmail = document.getElementById('loginEmail').value;
        const loginPassword = document.getElementById('loginPassword').value;

        try {
            const data = await postData(`${API_BASE_URL}/login.php`, { 
                email: loginEmail, 
                password: loginPassword 
            });

            // Nếu đến được đây, data.success là true
            sessionStorage.setItem('currentUserId', data.userId); 
            if (data.isServiceRegistered) {
                sessionStorage.setItem('currentUserServiceId', data.serviceId); 
            }

            updateUIAfterLogin(data.isServiceRegistered);
            loginModal.style.display = 'none';
            checkAndRedirectToServiceSearch();
            alert(`Đăng nhập thành công! Chào mừng ${data.userId}.`);
            
        } catch (error) {
             alert(`Đăng nhập thất bại: ${error.message}`);
             console.error('Lỗi khi gọi API Đăng nhập:', error);
        }
    });

    // Xử lý submit form Đăng ký (Gọi API: signup.php)
    signupForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Lấy giá trị từ form (BỔ SUNG: HoTen/fullName)
        const fullName = document.getElementById('signupName').value; // SỬA ID NÀY NẾU KHÔNG PHẢI 'signupName'
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirm = document.getElementById('signupConfirm').value;
        
        if (password !== confirm) { 
            alert('Mật khẩu không khớp'); 
            return; 
        }
        
        try {
            const data = await postData(`${API_BASE_URL}/signup.php`, {
                fullName: fullName, 
                email: email,
                password: password
            });

            // Nếu đến được đây, data.success là true
            sessionStorage.setItem('currentUserId', data.userId); // LƯU ID TỪ SERVER
            
            updateUIAfterLogin(false); // Chưa đăng ký dịch vụ
            signupModal.style.display = 'none';
            alert(`Đăng ký thành công! Bạn đã được đăng nhập với ID: ${data.userId}`);
            checkAndRedirectToServiceSearch();
            
        } catch (error) {
            alert(`Đăng ký thất bại: ${error.message}`);
            console.error('Lỗi khi gọi API Đăng ký:', error);
        }
    });


    // Xử lý đăng xuất (Gọi API: logout.php)
    logoutBtn.addEventListener('click', async function(event) {
        event.preventDefault();
        
        const isConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất không?");
        
        if (isConfirmed) {
            try {
                // GỌI API ĐỂ XÓA SESSION TRÊN SERVER
                await postData(`${API_BASE_URL}/logout.php`, {});

                // Reset trạng thái cục bộ và UI
                isLoggedIn = false;
                sessionStorage.removeItem('currentUserId'); 
                sessionStorage.removeItem('currentUserServiceId'); 
                isServiceRegistered = false;

                loginBtn.classList.remove('hidden');
                signupBtn.classList.remove('hidden');
                notificationToggle.classList.add('hidden');
                toggleBtn.classList.add('hidden');
                logoutBtn.classList.add('hidden');
                dropdown.classList.remove('show');
                notificationMenu.classList.remove('show');
            
                const serviceRegisterMenuItem = document.getElementById('menuServiceRegister');
                const yourServiceMenuItem = document.getElementById('menuYourService');
                if (serviceRegisterMenuItem) serviceRegisterMenuItem.classList.remove('hidden');
                if (yourServiceMenuItem) yourServiceMenuItem.classList.add('hidden');
                    
                window.location.href = "/"; // Quay về trang chủ
                
            } catch (error) {
                alert(`Đăng xuất thất bại: ${error.message}`);
                console.error('Lỗi khi gọi API Đăng xuất:', error);
            }
        }
    });

    // Xử lý submit form Đăng ký dịch vụ (Gọi API: register_service.php)
    if (serviceRegisterForm) {
        serviceRegisterForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const userId = sessionStorage.getItem('currentUserId');
            if (!userId) {
                alert("Lỗi: Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.");
                return;
            }

            // Lấy dữ liệu từ form Đăng ký dịch vụ
            const serviceData = {
                // MaND đã được gửi qua session/cookie
                MaSoThue: document.getElementById('serviceMaSoThue').value, // SỬA ID NẾU KHÁC
                DiaChi: document.getElementById('serviceDiaChi').value,       // SỬA ID NẾU KHÁC
                // Thêm các trường khác cần thiết cho Proc_DangKyMoDichVu
            };

            try {
                // GỌI API ĐỂ ĐĂNG KÝ DỊCH VỤ TRÊN SERVER
                const data = await postData(`${API_BASE_URL}/register_service.php`, serviceData);

                // Nếu thành công
                isServiceRegistered = true;
                sessionStorage.setItem('currentUserServiceId', data.serviceId); // LƯU ID DỊCH VỤ TỪ SERVER

                // Cập nhật UI
                const serviceRegisterMenuItem = document.getElementById('menuServiceRegister');
                const yourServiceMenuItem = document.getElementById('menuYourService');

                if (serviceRegisterMenuItem) serviceRegisterMenuItem.classList.add('hidden');
                if (yourServiceMenuItem) yourServiceMenuItem.classList.remove('hidden');

                serviceRegisterModal.style.display = 'none';
                alert(`Đăng ký dịch vụ thành công! Service ID của bạn là: ${data.serviceId}`);
                
            } catch (error) {
                alert(`Đăng ký dịch vụ thất bại: ${error.message}`);
                console.error('Lỗi khi gọi API Đăng ký dịch vụ:', error);
            }
        });
    }

    // ====================================================================
    // 4. XỬ LÝ SỰ KIỆN UI/UX
    // ====================================================================
    
    // Mở Modal Đăng nhập (khi click nút đăng nhập)
    loginBtn.addEventListener('click', function(event) {
        event.preventDefault();
        loginModal.style.display = 'block';
    });

    // Mở Modal Đăng ký (khi click nút đăng ký)
    signupBtn.addEventListener('click', function(event) {
        event.preventDefault();
        signupModal.style.display = 'block';
    });

    // Xử lý click vào "Đăng ký dịch vụ" trong menu
    const serviceRegisterMenuItemEl = document.getElementById('menuServiceRegister');
    if (serviceRegisterMenuItemEl) {
        serviceRegisterMenuItemEl.addEventListener('click', function(event) {
            event.preventDefault();
            if (!isLoggedIn) {
                loginModal.style.display = 'block';
                sessionStorage.setItem('redirectAfterLogin', 'serviceProviderRegister');
                return;
            }
            if (serviceRegisterModal) {
                serviceRegisterModal.style.display = 'block';
            }
        });
    }

    // Xử lý click vào "Dịch vụ của bạn" trong menu
    const yourServiceMenuItemEl = document.getElementById('menuYourService');
    if (yourServiceMenuItemEl) {
        yourServiceMenuItemEl.addEventListener('click', function(event) {
            event.preventDefault();
            dropdown.classList.remove('show'); 
            
            const serviceId = sessionStorage.getItem('currentUserServiceId');
            if (serviceId) {
                window.location.href = `../html/service_profile.html?serviceId=${serviceId}`;
            } else {
                alert("Không tìm thấy Service ID. Vui lòng thử đăng ký lại.");
            }
        });
    }

    // Xử lý click vào nút "Đặt dịch vụ" chính (serviceBtn) - Chuyển đến trang tìm kiếm
    if (serviceBtn) {
        serviceBtn.addEventListener('click', function(event) {
            event.preventDefault();
            if (!isLoggedIn) {
                loginModal.style.display = 'block';
                sessionStorage.setItem('redirectAfterLogin', 'serviceSearch');
                return;
            }
            redirectToServiceSearch();
        });
    }

    // Xử lý click vào "Trang chủ" trong menu
    if (menuHomeEl) {
        menuHomeEl.addEventListener('click', function(event) {
            event.preventDefault(); 
            dropdown.classList.remove('show'); 
            window.location.href = '/'; 
        });
    }

    // Xử lý Toggle Menu (Hamburger)
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function(event) {
            event.stopPropagation(); 
            dropdown.classList.toggle('show');
            notificationMenu.classList.remove('show');
        });
    }

    // Xử lý Toggle Thông báo (Notification Bell)
    if (notificationToggle) {
        notificationToggle.addEventListener('click', function(event) {
            event.stopPropagation();
            notificationMenu.classList.toggle('show');
            dropdown.classList.remove('show');
        });
    }
    
    // Đóng Menu/Thông báo khi click bất kỳ đâu bên ngoài
    document.addEventListener('click', function(event) {
        if (dropdown && !dropdown.contains(event.target) && toggleBtn && !toggleBtn.contains(event.target)) {
            dropdown.classList.remove('show');
        }
        if (notificationMenu && !notificationMenu.contains(event.target) && notificationToggle && !notificationToggle.contains(event.target)) {
            notificationMenu.classList.remove('show');
        }
    });

    // Đóng Modal khi click ngoài (window click)
    window.addEventListener('click', function(event) {
        if (loginModal && event.target === loginModal) {
            loginModal.style.display = 'none';
            sessionStorage.removeItem('redirectAfterLogin');
        }
        if (signupModal && event.target === signupModal) {
            signupModal.style.display = 'none';
        }
        if (serviceRegisterModal && event.target === serviceRegisterModal) {
            serviceRegisterModal.style.display = 'none';
        }
    });


    // ====================================================================
    // 5. CÁC HÀM CHUYỂN HƯỚNG VÀ XỬ LÝ MODAL (TOÀN CỤC)
    // ====================================================================

    // Hàm chuyển đến trang tìm kiếm dịch vụ
    function redirectToServiceSearch() {
        window.location.href = '../html/search.html';
    }

    // Hàm kiểm tra và chuyển hướng sau khi đăng nhập/đăng ký
    function checkAndRedirectToServiceSearch() {
        const redirectAction = sessionStorage.getItem('redirectAfterLogin');
        
        if (redirectAction) {
            sessionStorage.removeItem('redirectAfterLogin');
        }
        
        if (redirectAction === 'serviceSearch') {
            redirectToServiceSearch();
        } else if (redirectAction === 'serviceProviderRegister') {
            if (serviceRegisterModal) {
                serviceRegisterModal.style.display = 'block';
            }
        }
    }
});


// Các hàm đóng modal (Được gọi từ HTML)
function closeLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.style.display = 'none';
        sessionStorage.removeItem('redirectAfterLogin');
    }
}

function closeSignupModal() {
    const signupModal = document.getElementById('signupModal');
    if (signupModal) {
        signupModal.style.display = 'none';
    }
}

function closeServiceRegisterModal() {
    const serviceRegisterModal = document.getElementById('serviceRegisterModal');
    if (serviceRegisterModal) {
        serviceRegisterModal.style.display = 'none';
    }
}

// 4. Hàm mở modal cho guide steps
function openModal(element) {
    const modal = document.getElementById('stepModal');
    const img = element.querySelector('img');
    const h3 = element.querySelector('h3');
    const p = element.querySelector('p');

    document.getElementById('modalImage').src = img.src;
    document.getElementById('modalTitle').textContent = h3.textContent;
    document.getElementById('modalDescription').textContent = p.textContent;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 5. Hàm đóng modal
function closeModal() {
    const modal = document.getElementById('stepModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 6. Đóng modal khi click bên ngoài modal-content
window.addEventListener('click', function(event) {
    const modal = document.getElementById('stepModal');
    if (event.target === modal) {
        closeModal();
    }
});