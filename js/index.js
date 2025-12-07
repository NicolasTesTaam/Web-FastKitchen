document.addEventListener('DOMContentLoaded', function() {
    
    // ĐỊNH NGHĨA BASE URL CHO TẤT CẢ CÁC GỌI API
    const API_BASE_URL = '/api'; 

    // 1. KHAI BÁO CÁC PHẦN TỬ DOM
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
    // serviceRegisterBtn không được sử dụng trực tiếp, dùng serviceRegisterForm
    const serviceBtn = document.getElementById('serviceBtn');
    const menuHomeEl = document.getElementById('menuHome'); 

    // Biến trạng thái cục bộ
    let isLoggedIn = false; 
    let isServiceRegistered = false;

    // --- CÁC HÀM XỬ LÝ BACKEND (API INTERACTION) ---

    // 0. Hàm chung để gửi yêu cầu POST API
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

        if (!response.ok) {
            throw new Error(`Lỗi HTTP: ${response.status}`);
        }
        
        return response.json();
    }

    // 0.1 Hàm cập nhật UI sau khi đăng nhập (Được gọi sau check status, login, signup)
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

    // 0.2 Xử lý check trạng thái khi tải trang (Gọi API: check_status.php)
    async function checkUserStatus() {
        try {
            const statusUrl = `${API_BASE_URL}/check_status.php`;
            const response = await fetch(statusUrl, { credentials: 'include' });
            
            if (!response.ok) { 
                throw new Error(`Server status check failed: ${response.status}`);
            }

            const data = await response.json();

            if (data.isLoggedIn) {
                sessionStorage.setItem('currentUserId', data.userId); 
                
                if (data.isServiceRegistered) {
                    sessionStorage.setItem('currentUserServiceId', data.serviceId); 
                }

                updateUIAfterLogin(data.isServiceRegistered);
            }
        } catch (error) {
            isLoggedIn = false;
            console.error('Lỗi khi kiểm tra trạng thái người dùng:', error);
        }
    }
    
    // GỌI HÀM CHECK STATUS KHI TRANG TẢI
    checkUserStatus();

    // 0.3 Xử lý submit form Đăng nhập (Gọi API: login.php)
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const loginEmail = document.getElementById('loginEmail').value;
        const loginPassword = document.getElementById('loginPassword').value;

        try {
            const data = await postData(`${API_BASE_URL}/login.php`, { 
                email: loginEmail, 
                password: loginPassword 
            });

            if (data.success) {
                sessionStorage.setItem('currentUserId', data.userId); 
                if (data.isServiceRegistered) {
                    sessionStorage.setItem('currentUserServiceId', data.serviceId); 
                }

                updateUIAfterLogin(data.isServiceRegistered);
                loginModal.style.display = 'none';
                checkAndRedirectToServiceSearch();
            } else {
                 alert(`Đăng nhập thất bại: ${data.message || 'Email hoặc mật khẩu không đúng.'}`);
            }
        } catch (error) {
            console.error('Lỗi khi gọi API Đăng nhập:', error);
             alert('Đã xảy ra lỗi hệ thống khi cố gắng đăng nhập.');
        }
    });

    // 0.4 Xử lý submit form Đăng ký (Gọi API: signup.php)
    signupForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirm = document.getElementById('signupConfirm').value;
        
        if (password !== confirm) { 
            alert('Mật khẩu không khớp'); 
            return; 
        }
        
        try {
            const data = await postData(`${API_BASE_URL}/signup.php`, {
                email: email,
                password: password
            });

            if (data.success) {
                sessionStorage.setItem('currentUserId', data.userId);
                
                updateUIAfterLogin(false); // Chưa đăng ký dịch vụ
                signupModal.style.display = 'none';
                alert('Đăng ký thành công! Bạn đã được đăng nhập.');
                checkAndRedirectToServiceSearch();
            } else {
                alert(`Đăng ký thất bại: ${data.message || 'Email đã được đăng ký hoặc lỗi khác.'}`);
            }
        } catch (error) {
            console.error('Lỗi khi gọi API Đăng ký:', error);
             alert('Đã xảy ra lỗi hệ thống khi cố gắng đăng ký.');
        }
    });


    // 0.5 Xử lý đăng xuất (Gọi API: logout.php)
    logoutBtn.addEventListener('click', async function(event) {
        event.preventDefault();
        
        const isConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất không?");
        
        if (isConfirmed) {
            try {
                // GỌI API ĐỂ XÓA SESSION TRÊN SERVER
                const data = await postData(`${API_BASE_URL}/logout.php`, {});

                if (data.success) {
                    isLoggedIn = false;
                    
                    // Dọn dẹp trạng thái cục bộ sau khi server xác nhận đăng xuất
                    sessionStorage.removeItem('currentUserId'); 
                    sessionStorage.removeItem('currentUserServiceId'); 
                    isServiceRegistered = false;

                    // Reset UI
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
                        
                    window.location.href = "/";
                } else {
                    alert(`Đăng xuất thất bại: ${data.message || 'Lỗi server.'}`);
                }
            } catch (error) {
                console.error('Lỗi khi gọi API Đăng xuất:', error);
                alert('Đã xảy ra lỗi hệ thống khi cố gắng đăng xuất.');
            }
        }
    });

    // 0.6 Xử lý submit form Đăng ký dịch vụ (Gọi API: register_service.php)
    if (serviceRegisterForm) {
        serviceRegisterForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const userId = sessionStorage.getItem('currentUserId');
            if (!userId) {
                alert("Lỗi: Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.");
                return;
            }

            // Lấy dữ liệu từ form Đăng ký dịch vụ ở đây
            const serviceData = {
                userId: userId,
                // Vui lòng thêm các trường dữ liệu cần gửi đi từ form ĐKDV của bạn
                // Ví dụ: serviceName: document.getElementById('serviceName').value, 
            };

            try {
                // GỌI API ĐỂ ĐĂNG KÝ DỊCH VỤ TRÊN SERVER
                const data = await postData(`${API_BASE_URL}/register_service.php`, serviceData);

                if (data.success) {
                    isServiceRegistered = true;
                    sessionStorage.setItem('currentUserServiceId', data.serviceId); // LƯU ID DỊCH VỤ TỪ SERVER

                    // Cập nhật UI
                    const serviceRegisterMenuItem = document.getElementById('menuServiceRegister');
                    const yourServiceMenuItem = document.getElementById('menuYourService');

                    if (serviceRegisterMenuItem) serviceRegisterMenuItem.classList.add('hidden');
                    if (yourServiceMenuItem) yourServiceMenuItem.classList.remove('hidden');

                    serviceRegisterModal.style.display = 'none';
                    alert(`Đăng ký dịch vụ thành công! Service ID của bạn là: ${data.serviceId}`);
                } else {
                    alert(`Đăng ký dịch vụ thất bại: ${data.message || 'Lỗi server.'}`);
                }
            } catch (error) {
                console.error('Lỗi khi gọi API Đăng ký dịch vụ:', error);
                alert('Đã xảy ra lỗi hệ thống khi cố gắng đăng ký dịch vụ.');
            }
        });
    }

    // --- CÁC SỰ KIỆN XỬ LÝ UI/UX KHÁC (Đã được sắp xếp lại) ---

    // 1. Mở Modal Đăng nhập (khi click nút đăng nhập)
    loginBtn.addEventListener('click', function(event) {
        event.preventDefault();
        loginModal.style.display = 'block';
    });

    // 2. Mở Modal Đăng ký (khi click nút đăng ký)
    signupBtn.addEventListener('click', function(event) {
        event.preventDefault();
        signupModal.style.display = 'block';
    });

    // 3. Xử lý click vào "Đăng ký dịch vụ" trong menu
    const serviceRegisterMenuItemEl = document.getElementById('menuServiceRegister');
    if (serviceRegisterMenuItemEl) {
        serviceRegisterMenuItemEl.addEventListener('click', function(event) {
            event.preventDefault();
            if (!isLoggedIn) {
                // Nếu chưa đăng nhập, mở modal Đăng nhập và lưu trạng thái chuyển hướng
                loginModal.style.display = 'block';
                sessionStorage.setItem('redirectAfterLogin', 'serviceProviderRegister');
                return;
            }
            if (serviceRegisterModal) {
                // Nếu đã đăng nhập, mở modal Đăng ký dịch vụ
                serviceRegisterModal.style.display = 'block';
            }
        });
    }

    // 4. Xử lý click vào "Dịch vụ của bạn" trong menu
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

    // 5. Xử lý click vào nút "Đặt dịch vụ" chính (serviceBtn) - Chuyển đến trang tìm kiếm
    if (serviceBtn) {
        serviceBtn.addEventListener('click', function(event) {
            event.preventDefault();
            if (!isLoggedIn) {
                // Nếu chưa đăng nhập, mở modal Đăng nhập và lưu trạng thái chuyển hướng
                loginModal.style.display = 'block';
                sessionStorage.setItem('redirectAfterLogin', 'serviceSearch');
                return;
            }
            redirectToServiceSearch();
        });
    }

    // 6. Xử lý click vào "Trang chủ" trong menu
    if (menuHomeEl) {
        menuHomeEl.addEventListener('click', function(event) {
            event.preventDefault(); 
            dropdown.classList.remove('show'); 
            window.location.href = '/'; 
        });
    }

    // 7. Xử lý Toggle Menu (Hamburger)
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function(event) {
            event.stopPropagation(); 
            dropdown.classList.toggle('show');
            notificationMenu.classList.remove('show');
        });
    }

    // 8. Xử lý Toggle Thông báo (Notification Bell)
    if (notificationToggle) {
        notificationToggle.addEventListener('click', function(event) {
            event.stopPropagation();
            notificationMenu.classList.toggle('show');
            dropdown.classList.remove('show');
        });
    }
    
    // 9. Đóng Menu/Thông báo khi click bất kỳ đâu bên ngoài
    document.addEventListener('click', function(event) {
        if (dropdown && !dropdown.contains(event.target) && toggleBtn && !toggleBtn.contains(event.target)) {
            dropdown.classList.remove('show');
        }
        if (notificationMenu && !notificationMenu.contains(event.target) && notificationToggle && !notificationToggle.contains(event.target)) {
            notificationMenu.classList.remove('show');
        }
    });

    // 10. Đóng Modal khi click ngoài (window click)
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


    // --- CÁC HÀM TIỆN ÍCH ---

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


// --- CÁC HÀM ĐÓNG MODAL (Nếu bạn gọi từ nút "X" trong HTML) ---

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