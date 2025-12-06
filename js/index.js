document.addEventListener('DOMContentLoaded', function() {
    
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
    const serviceRegisterBtn = document.getElementById('serviceRegisterBtn');
    const serviceBtn = document.getElementById('serviceBtn');
    const menuHomeEl = document.getElementById('menuHome'); 

    // BỔ SUNG: Khởi tạo isLoggedIn từ localStorage để duy trì trạng thái
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; 
    let isServiceRegistered = false;

    function generateNewUserId() {
        // Lấy số đếm hiện tại, mặc định là 0
        let idCounter = parseInt(localStorage.getItem('userIdCounter')) || 0;
        
        // Tăng số đếm lên 1
        idCounter += 1;
        
        // Lưu số đếm mới vào localStorage
        localStorage.setItem('userIdCounter', idCounter);
        
        // Tạo ID theo định dạng: Chữ cái đầu (ví dụ: A) + Số (3 chữ số)
        // Dùng 'A' làm tiền tố cố định cho ví dụ này
        const prefix = 'A'; 
        const newId = prefix + idCounter.toString().padStart(3, '0');
        
        return newId;
    }
    // BỔ SUNG: Hàm lấy/tạo mảng users
    function getUsers() {
        return JSON.parse(localStorage.getItem('users')) || [];
    }

    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // 0. Xử lý click Đăng nhập - mở form đăng nhập
    loginBtn.addEventListener('click', function(event) {
        event.preventDefault();
        loginModal.style.display = 'block';
    });

    // 0.1 Xử lý click Đăng ký - mở form đăng ký
    signupBtn.addEventListener('click', function(event) {
        event.preventDefault();
        signupModal.style.display = 'block';
    });

    // 0.2 Xử lý submit form Đăng nhập
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const loginEmail = document.getElementById('loginEmail').value;
        const loginPassword = document.getElementById('loginPassword').value;
        const users = getUsers();
        
        // GIẢ ĐỊNH LOGIC ĐĂNG NHẬP THÀNH CÔNG (DỰA TRÊN EMAIL VÀ MẬT KHẨU)
        const userFound = users.find(u => u.email === loginEmail && u.password === loginPassword);

        if (userFound) {
            isLoggedIn = true;
            localStorage.setItem('isLoggedIn', 'true');
            
            // LƯU USER ID THỰC TẾ
            sessionStorage.setItem('currentUserId', userFound.userId); 

            updateUIAfterLogin();
            loginModal.style.display = 'none';
            checkAndRedirectToServiceSearch();
        } else {
             alert('Đăng nhập thất bại: Email hoặc mật khẩu không đúng.');
        }
    });

    // 0.3 Xử lý submit form Đăng ký
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirm = document.getElementById('signupConfirm').value;
        
        if (password !== confirm) { 
            alert('Mật khẩu không khớp'); 
            return; 
        }
        
        let users = getUsers();
        // Kiểm tra xem email đã tồn tại chưa
        if (users.some(u => u.email === email)) {
            alert('Email đã được đăng ký.');
            return;
        }

        // TẠO VÀ LƯU USER ID CHO TÀI KHOẢN MỚI
        const newUserId = generateNewUserId(); 
        
        // TẠO DỮ LIỆU BAN ĐẦU
        const newUserData = {
            userId: newUserId,
            email: email,
            password: password, // LƯU MẬT KHẨU (CHỈ DÙNG CHO MỤC ĐÍCH MÔ PHỎNG NÀY)
            fullName: '',
            phone: '',
            address: ''
        };
        
        users.push(newUserData);
        saveUsers(users); // LƯU MẢNG USERS CẬP NHẬT
        
        sessionStorage.setItem('currentUserId', newUserId); // LƯU ID VÀO SESSION

        // auto-login UI
        isLoggedIn = true;
        localStorage.setItem('isLoggedIn', 'true'); 
        updateUIAfterLogin();
        signupModal.style.display = 'none';
        
        checkAndRedirectToServiceSearch();
    });

    // 0.4 Hàm cập nhật UI sau khi đăng nhập (đã đăng nhập hoặc tải lại trang)
    function updateUIAfterLogin() {
        loginBtn.classList.add('hidden');
        signupBtn.classList.add('hidden');
        notificationToggle.classList.remove('hidden');
        toggleBtn.classList.remove('hidden');
        logoutBtn.classList.remove('hidden');
        
        //Cập nhật trạng thái Dịch vụ nếu đã đăng ký (Cần lưu trạng thái này vào localStorage nếu muốn duy trì sau reload)
        const serviceRegisterMenuItem = document.getElementById('menuServiceRegister');
        const yourServiceMenuItem = document.getElementById('menuYourService');
        if (localStorage.getItem('isServiceRegistered') === 'true') {
             if (serviceRegisterMenuItem) serviceRegisterMenuItem.classList.add('hidden');
             if (yourServiceMenuItem) yourServiceMenuItem.classList.remove('hidden');
         }
    }

    // 0.5 Xử lý đăng xuất (CẬP NHẬT XÓA currentUserId)
    logoutBtn.addEventListener('click', function(event) {
        event.preventDefault();
        
        const isConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất không?");
        
        if (isConfirmed) {
           isLoggedIn = false;
           localStorage.setItem('isLoggedIn', 'false'); 
           localStorage.setItem('isServiceRegistered', 'false'); 
           sessionStorage.removeItem('currentUserId'); // XÓA USER ID
           sessionStorage.removeItem('currentUserServiceId'); 
           isServiceRegistered = false;

           loginBtn.classList.remove('hidden');
           signupBtn.classList.remove('hidden');
           notificationToggle.classList.add('hidden');
           toggleBtn.classList.add('hidden');
           logoutBtn.classList.add('hidden');
           dropdown.classList.remove('show');
           notificationMenu.classList.remove('show');
        
           // Reset menu items visibility
           const serviceRegisterMenuItem = document.getElementById('menuServiceRegister');
           const yourServiceMenuItem = document.getElementById('menuYourService');
           if (serviceRegisterMenuItem) serviceRegisterMenuItem.classList.remove('hidden');
           if (yourServiceMenuItem) yourServiceMenuItem.classList.add('hidden');
            
           window.location.href = "/";
        }
    });

    // 0.6 Xử lý submit form Đăng ký dịch vụ
    if (serviceRegisterForm) {
        serviceRegisterForm.addEventListener('submit', function(event) {
            event.preventDefault();
            isServiceRegistered = true;
            localStorage.setItem('isServiceRegistered', 'true'); // LƯU TRẠNG THÁI DỊCH VỤ

            // BỔ SUNG: TẠO VÀ LƯU SERVICE ID
            const newServiceId = 'S' + generateNewUserId().substring(1); // Ví dụ: S002
            sessionStorage.setItem('currentUserServiceId', newServiceId); // LƯU ID DỊCH VỤ

            // Ẩn "Đăng ký dịch vụ", hiển thị "Dịch vụ của bạn"
            const serviceRegisterMenuItem = document.getElementById('menuServiceRegister');
            const yourServiceMenuItem = document.getElementById('menuYourService');

            if (serviceRegisterMenuItem) serviceRegisterMenuItem.classList.add('hidden');
            if (yourServiceMenuItem) yourServiceMenuItem.classList.remove('hidden');

            serviceRegisterModal.style.display = 'none';
            alert(`Đăng ký dịch vụ thành công! Service ID của bạn là: ${newServiceId}`);
        });
    }

    // 0.7 Xử lý click vào "Đăng ký dịch vụ" trong menu - mở form đăng ký dịch vụ
    const serviceRegisterMenuItemEl = document.getElementById('menuServiceRegister');
    if (serviceRegisterMenuItemEl) {
        serviceRegisterMenuItemEl.addEventListener('click', function(event) {
            event.preventDefault();
            if (!isLoggedIn) {
                // nếu chưa đăng nhập, mở form đăng nhập
                loginModal.style.display = 'block';
                // Lưu trạng thái để biết người dùng muốn đăng ký làm nhà cung cấp dịch vụ
                sessionStorage.setItem('redirectAfterLogin', 'serviceProviderRegister');
                return;
            }
            if (serviceRegisterModal) {
                serviceRegisterModal.style.display = 'block';
            }
        });
    }
    // BỔ SUNG: Xử lý click vào "Dịch vụ của bạn" trong menu
    const yourServiceMenuItemEl = document.getElementById('menuYourService');
    if (yourServiceMenuItemEl) {
        yourServiceMenuItemEl.addEventListener('click', function(event) {
            event.preventDefault();
            dropdown.classList.remove('show'); 
            
            const serviceId = sessionStorage.getItem('currentUserServiceId');
            if (serviceId) {
                // Chuyển hướng đến trang cài đặt dịch vụ và truyền ID qua URL
                window.location.href = `../html/service_profile.html?serviceId=${serviceId}`;
            } else {
                alert("Không tìm thấy Service ID. Vui lòng thử đăng ký lại.");
            }
        });
    }

    // 0.8 Xử lý click vào nút "Đặt dịch vụ" chính (serviceBtn) - TRANG TÌM KIẾM
    if (serviceBtn) {
        serviceBtn.addEventListener('click', function(event) {
            event.preventDefault();
            if (!isLoggedIn) {
                // Nếu chưa đăng nhập, hiện form đăng nhập
                loginModal.style.display = 'block';
                // Lưu trạng thái để sau khi đăng nhập sẽ chuyển đến trang tìm kiếm
                sessionStorage.setItem('redirectAfterLogin', 'serviceSearch');
                return;
            }
            // Nếu đã đăng nhập, chuyển đến trang tìm kiếm dịch vụ
            redirectToServiceSearch();
        });
    }

    // 0.9 Xử lý click vào "Trang chủ" trong menu
    if (menuHomeEl) {
        menuHomeEl.addEventListener('click', function(event) {
            event.preventDefault(); 
            // Đóng menu trước khi chuyển trang
            dropdown.classList.remove('show'); 
            // Vẫn chuyển hướng về trang gốc, nhưng trạng thái đăng nhập sẽ được duy trì
            window.location.href = '/'; 
        });
    }

    // Hàm chuyển đến trang tìm kiếm dịch vụ
    function redirectToServiceSearch() {
        // Thay đổi đường dẫn theo trang thực tế của bạn
        window.location.href = '../html/search.html';
    }

    // Hàm kiểm tra và chuyển hướng sau khi đăng nhập
    function checkAndRedirectToServiceSearch() {
        const redirectAction = sessionStorage.getItem('redirectAfterLogin');
        
        if (redirectAction === 'serviceSearch') {
            // Xóa trạng thái redirect
            sessionStorage.removeItem('redirectAfterLogin');
            // Chuyển đến trang tìm kiếm dịch vụ
            redirectToServiceSearch();
        } else if (redirectAction === 'serviceProviderRegister') {
            // Xóa trạng thái redirect
            sessionStorage.removeItem('redirectAfterLogin');
            // Mở modal đăng ký làm nhà cung cấp dịch vụ
            if (serviceRegisterModal) {
                serviceRegisterModal.style.display = 'block';
            }
        }
    }

    // BỔ SUNG: Cập nhật UI ngay khi trang tải xong nếu người dùng đã đăng nhập trước đó
    if (isLoggedIn) {
        updateUIAfterLogin();
    }
    // BỔ SUNG: Cập nhật UI ngay khi trang tải xong nếu người dùng đã đăng nhập trước đó
    // Cần kiểm tra lại currentUserId khi tải lại trang
    if (isLoggedIn) {
        // Nếu đã đăng nhập, đảm bảo currentUserId vẫn còn trong sessionStorage
        if (!sessionStorage.getItem('currentUserId')) {
             // Trường hợp người dùng xóa ID nhưng vẫn còn isLoggedIn = true
             localStorage.setItem('isLoggedIn', 'false');
             isLoggedIn = false;
        } else {
             updateUIAfterLogin();
        }
    }
    
    // 1. Bắt sự kiện click vào nút Hamburger
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function(event) {
            event.stopPropagation(); 
            dropdown.classList.toggle('show');
            notificationMenu.classList.remove('show');
        });
    }

    // 2. Bắt sự kiện click vào notification bell
    if (notificationToggle) {
        notificationToggle.addEventListener('click', function(event) {
            event.stopPropagation();
            notificationMenu.classList.toggle('show');
            dropdown.classList.remove('show');
        });
    }

    // 3. Đóng menu khi click bất kỳ đâu bên ngoài
    document.addEventListener('click', function(event) {
        if (dropdown && !dropdown.contains(event.target) && toggleBtn && !toggleBtn.contains(event.target)) {
            dropdown.classList.remove('show');
        }
        if (notificationMenu && !notificationMenu.contains(event.target) && notificationToggle && !notificationToggle.contains(event.target)) {
            notificationMenu.classList.remove('show');
        }
    });

    // 4. Đóng modal khi click ngoài
    window.addEventListener('click', function(event) {
        if (loginModal && event.target === loginModal) {
            loginModal.style.display = 'none';
            // Xóa trạng thái redirect khi đóng modal đăng nhập
            sessionStorage.removeItem('redirectAfterLogin');
        }
        if (signupModal && event.target === signupModal) {
            signupModal.style.display = 'none';
        }
        if (serviceRegisterModal && event.target === serviceRegisterModal) {
            serviceRegisterModal.style.display = 'none';
        }
    });
});

// Hàm đóng form Đăng nhập
function closeLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.style.display = 'none';
        // Xóa trạng thái redirect khi đóng modal đăng nhập
        sessionStorage.removeItem('redirectAfterLogin');
    }
}

// Hàm đóng form Đăng ký
function closeSignupModal() {
    const signupModal = document.getElementById('signupModal');
    if (signupModal) {
        signupModal.style.display = 'none';
    }
}

// Hàm đóng form Đăng ký dịch vụ
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