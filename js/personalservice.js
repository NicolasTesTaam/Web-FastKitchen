// js/navbar.js (Code từ tes.js)
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


//JavaScript Cơ bản (Code hiện tại)
//===============================//
// Hàm chuyển đổi Tab
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    // Ẩn tất cả nội dung tab
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }

    // Xóa lớp 'active' khỏi tất cả các nút tab
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    // Hiển thị nội dung tab hiện tại và thêm lớp 'active' vào nút đã click
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// Thiết lập Tab Menu là active khi trang tải lần đầu
document.addEventListener('DOMContentLoaded', () => {
    // Kích hoạt tab Menu khi tải trang
    document.querySelector('.tab-link').click(); 
    
    // Thêm Listener cho nút Đặt Tiệc
    document.getElementById('book-party-btn').addEventListener('click', () => {
        // Tạm thời hiển thị cảnh báo, sau này sẽ thay bằng việc mở Form Đặt Tiệc (Modal)
        alert('Mở Form Đặt Tiệc (Form 1: Chọn món)');
    });
    
    // Thêm Listener cho các icon tương tác
    document.getElementById('chat-btn').addEventListener('click', () => {
        alert('Mở Khung Chat Trực Tiếp');
    });
    
    document.getElementById('favorite-btn').addEventListener('click', () => {
        // Ví dụ đơn giản về việc thay đổi màu trái tim khi được yêu thích
        const heartIcon = document.querySelector('#favorite-btn i');
        if (heartIcon.classList.contains('far')) {
            heartIcon.classList.remove('far');
            heartIcon.classList.add('fas'); // Đổi sang trái tim đặc
            heartIcon.style.color = 'red';
            alert('Đã thêm vào mục Yêu thích!');
        } else {
            heartIcon.classList.remove('fas');
            heartIcon.classList.add('far'); // Đổi sang trái tim rỗng
            heartIcon.style.color = '#007bff';
            alert('Đã xóa khỏi mục Yêu thích!');
        }
    });

    document.getElementById('complaint-btn').addEventListener('click', () => {
        alert('Mở Form Khiếu Nại Dịch Vụ');
    });
});

//JavaScript cho Logic Form Đặt Tiệc//
//===============================//
// Lấy các phần tử Modal
const modal = document.getElementById('booking-modal');
const btn = document.getElementById('book-party-btn');
const closeBtn = document.querySelector('.close-btn');
const formSteps = document.querySelectorAll('.form-step');
const progressSteps = document.querySelectorAll('.progress-bar .step');

let currentStep = 1;

// Hàm mở Modal
btn.onclick = function() {
    modal.style.display = "block";
    goToStep(1); // Luôn bắt đầu từ bước 1
}

// Hàm đóng Modal
closeBtn.onclick = function() {
    modal.style.display = "none";
}

// Đóng Modal khi click ra ngoài
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Hàm chuyển bước Form
function goToStep(step) {
    if (step < 1 || step > 3) return;

    // Ẩn tất cả các form và xóa trạng thái active
    formSteps.forEach(fs => fs.classList.remove('active'));
    progressSteps.forEach(ps => ps.classList.remove('active'));

    // Hiển thị form hiện tại và đánh dấu progress bar
    document.getElementById(`form${step}`).classList.add('active');
    document.getElementById(`step${step}`).classList.add('active');

    currentStep = step;
}

// Xử lý nút Tiếp tục (Next)
document.querySelectorAll('.next-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const nextStep = parseInt(e.target.dataset.nextStep);
        // *Thêm logic kiểm tra (Validation) ở đây trước khi chuyển bước*
        // Ví dụ: if (validateForm(currentStep)) { goToStep(nextStep); }
        
        // Tạm thời chuyển bước không cần validation
        goToStep(nextStep);
    });
});

// Xử lý nút Quay lại (Previous)
document.querySelectorAll('.prev-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const prevStep = parseInt(e.target.dataset.prevStep);
        goToStep(prevStep);
    });
});

// Xử lý Nút Chọn Món (Giả lập)
document.querySelectorAll('.add-dish-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const dishType = e.target.dataset.type;
        alert(`Mở khung chọn chi tiết cho món: ${dishType}. (Cần triển khai Modal/Dropdown chọn món chi tiết)`);
        
        // Cập nhật trạng thái giả lập
        if (dishType === 'appetizer') {
            document.getElementById('selected-appetizer').textContent = 'Đã chọn 1 Khai vị';
        } else if (dishType === 'main-course') {
            document.getElementById('selected-main-course').textContent = 'Đã chọn 4 món chính';
        } else if (dishType === 'dessert') {
            document.getElementById('selected-dessert').textContent = 'Đã chọn 1 Tráng miệng';
        }
    });
});

// Xử lý chọn Menu có sẵn
function showMenuDetails(menuId) {
    const detailsDiv = document.getElementById('menu-details');
    if (menuId === 'menuA') {
        detailsDiv.innerHTML = '<p>Chi tiết: Súp cua, Tôm hấp, Bò xào, Lẩu nấm, Tráng miệng trái cây.</p><button class="primary-btn">Xác nhận chọn Menu A</button>';
    } else if (menuId === 'menuB') {
        detailsDiv.innerHTML = '<p>Chi tiết: Sò điệp nướng, Cua rang me, Cá mú hấp xì dầu, Lẩu hải sản, Bánh kem lạnh.</p><button class="primary-btn">Xác nhận chọn Menu B</button>';
    } else {
        detailsDiv.innerHTML = '';
    }
}

// Xử lý Form Hoàn thành
document.getElementById('booking-form').addEventListener('submit', (e) => {
    e.preventDefault();
    modal.style.display = "none";
    alert('🎉 Đặt tiệc thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
    // Logic gửi dữ liệu đơn hàng lên server (Backend) sẽ được đặt ở đây
});

// Chắc chắn rằng hàm openTab từ bước 1 vẫn hoạt động
document.querySelector('.tab-link').click();

//JavaScript cho Logic Chủ Dịch Vụ//
//===============================//
// Lấy các phần tử Modal thông tin khách hàng
const customerInfoModal = document.getElementById('customer-info-modal');
const closeCustomerBtn = customerInfoModal.querySelector('.close-btn');

// Hàm chuyển đổi Tab Chủ Dịch Vụ
function openOwnerTab(evt, tabName) {
    var i, tabcontent, tablinks;

    // Ẩn tất cả nội dung tab
    tabcontent = document.getElementsByClassName("owner-tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }

    // Xóa lớp 'active' khỏi tất cả các nút tab
    tablinks = document.getElementsByClassName("owner-tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    // Hiển thị nội dung tab hiện tại và thêm lớp 'active' vào nút đã click
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

document.addEventListener('DOMContentLoaded', () => {
    // Kích hoạt tab đầu tiên của Owner View
    if (document.querySelector('.owner-tab-link')) {
        document.querySelector('.owner-tab-link').click(); 
    }

    // Xử lý nút xem thông tin khách hàng (Dấu 3 chấm)
    document.querySelectorAll('.view-customer-info').forEach(button => {
        button.addEventListener('click', (e) => {
            // Giả lập lấy thông tin khách hàng từ hàng đơn hàng
            const row = e.target.closest('tr');
            const customerName = row.cells[1].textContent;
            
            // Cập nhật và mở modal
            document.querySelector('#customer-info-modal h3 + p').innerHTML = `Họ tên: **${customerName}**`;
            // Cần cập nhật cả SĐT thực tế từ DB
            document.querySelector('#customer-info-modal h3 + p + p').innerHTML = `Số điện thoại: **09xxxxxxxx**`; 
            
            customerInfoModal.style.display = 'block';
        });
    });

    // Xử lý đóng Modal thông tin khách hàng
    closeCustomerBtn.onclick = function() {
        customerInfoModal.style.display = "none";
    }

    // Xử lý nút cập nhật trạng thái
    document.querySelectorAll('.update-btn').forEach(button => {
        button.addEventListener('click', () => {
            alert('Mở form/dropdown cập nhật trạng thái đơn hàng (Đang làm -> Hoàn thành)');
            // Logic cập nhật trạng thái đơn hàng (gọi API)
        });
    });
    
    // Xử lý nút thêm menu
    document.querySelector('.add-new-btn').addEventListener('click', () => {
        alert('Mở Modal Thêm Menu Mới (Điền tên, giá, mô tả món)');
    });
});

// Chắc chắn rằng hàm đóng Modal đặt tiệc vẫn hoạt động khi click ra ngoài
window.onclick = function(event) {
    // Kiểm tra xem event.target có phải là một trong các modal không
    if (event.target == document.getElementById('booking-modal')) {
        document.getElementById('booking-modal').style.display = "none";
    }
    if (event.target == customerInfoModal) {
        customerInfoModal.style.display = "none";
    }
}