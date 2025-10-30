<template>
  <div id="app">
    <!-- SIDEBAR CỐ ĐỊNH BÊN TRÁI -->
    <nav class="sidebar">
      <div class="sidebar-header">
        <h3 class="fw-bold text-primary text-center">🛒 TECHDY ADMIN</h3>
      </div>

      <div class="sidebar-menu">
        <router-link to="/" class="nav-item">🏠 Trang chủ</router-link>
        <router-link to="/about" class="nav-item">ℹ️ Giới thiệu</router-link>
        <router-link to="/admin/nhap-hoa-don" class="nav-item">🧾 Nhập hóa đơn</router-link>
        <router-link to="/admin/hoa-don" class="nav-item">📄 Quản lý hóa đơn</router-link>
        <router-link to="/admin/nhap-kho" class="nav-item">📦 Nhập kho hàng</router-link>
        <router-link to="/admin/hoa-don-nhap-kho" class="nav-item">📄 Hóa đơn nhập kho</router-link>
        <router-link to="/admin/so-thu-chi" class="nav-item">💰 Sổ thu chi</router-link>
        <router-link to="/admin/thong-ke" class="nav-item">📊 Thống kê tổng hợp</router-link>
      </div>
    </nav>

    <!-- NỘI DUNG CHÍNH -->
    <main class="main-content">
      <div class="content-wrapper">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style scoped>
/* ======================
   ⚙️ LAYOUT CHUNG
====================== */
#app {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #fff;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

/* ======================
   📁 SIDEBAR CỐ ĐỊNH
====================== */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 240px;
  height: 100vh;
  background: #fff;
  border-right: 1px solid #e0e0e0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  padding: 1.2rem 1rem;
  z-index: 1000;
  overflow-y: auto;
}

.sidebar-header {
  text-align: center;
  margin-bottom: 1rem;
}
.sidebar h3 {
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* ======================
   🔗 MENU ITEM
====================== */
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  margin-bottom: 0.4rem;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.nav-item:hover {
  background-color: #f0f4ff;
  color: #007bff;
  transform: translateX(3px);
}
.nav-item.router-link-exact-active {
  background: #007bff;
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0, 123, 255, 0.25);
}

/* ======================
   🧾 MAIN CONTENT
====================== */
.main-content {
  margin-left: 240px; /* Chừa chỗ cho sidebar */
  flex: 1;
  width: calc(100vw - 240px);
  height: 100vh;
  background-color: #f8f9fb;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

/* ✅ WRAPPER GIÚP FULL CHIỀU NGANG */
.content-wrapper {
  width: 100%;
  height: 100%;
  padding: 0;        /* Xóa mọi padding */
  margin: 0;         /* Xóa margin trắng */
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}

/* Scrollbar */
.main-content::-webkit-scrollbar {
  width: 8px;
}
.main-content::-webkit-scrollbar-thumb {
  background: #bbb;
  border-radius: 4px;
}

/* ======================
   💻 RESPONSIVE
====================== */
@media (max-width: 992px) {
  .sidebar {
    width: 200px;
  }
  .main-content {
    margin-left: 200px;
    width: calc(100vw - 200px);
  }
}
@media (max-width: 768px) {
  .sidebar {
    position: relative;
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #ddd;
    overflow-x: auto;
  }
  .main-content {
    margin-left: 0;
    width: 100%;
    height: calc(100vh - 60px);
  }
  .nav-item {
    flex: 1;
    justify-content: center;
  }
}
/* 🧱 Force toàn bộ nội dung trong router-view full width */
.main-content,
.main-content > .content-wrapper,
.main-content > * {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  box-sizing: border-box;
}

/* Cho các card / bảng / form kéo full màn hình */
.main-content .container,
.main-content .container-fluid,
.main-content .row,
.main-content .card,
.main-content .table-responsive {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

</style>
