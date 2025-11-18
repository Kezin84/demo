<template>
  <div id="app">
    <!-- 🌐 Nút mở menu responsive -->
    <button class="btn-toggle" @click="isOpen = !isOpen" :class="{ active: isOpen }">
      <span class="hamburger">
        <span class="line"></span>
        <span class="line"></span>
        <span class="line"></span>
      </span>
    </button>

    <!-- 🧭 SIDEBAR PROFESSIONAL -->
    <nav class="sidebar" :class="{ open: isOpen, 'closed-desktop': !isOpen }">

      <div class="sidebar-backdrop"></div>
      
      <div class="sidebar-content">
        <!-- Logo Header -->
        <div class="sidebar-header">
          <div class="logo-container">
            <div class="logo-icon-wrapper">
              <span class="logo-icon">🛒</span>
              <div class="logo-glow"></div>
            </div>
            <div class="logo-text">
              <h3 class="brand-name">THỦY KIM</h3>
              <span class="brand-subtitle">Admin Dashboard</span>
            </div>
          </div>
        </div>

        <!-- Navigation Menu -->
        <div class="sidebar-menu">
         
          <div class="menu-section">
            <span class="section-label">BÁN HÀNG</span>
            <router-link to="/admin/nhap-hoa-don" class="nav-item">🧾 Nhập hóa đơn</router-link>
            <router-link to="/admin/hoa-don" class="nav-item">📄 Quản lý hóa đơn</router-link>
          </div>

          <div class="menu-section">
            <span class="section-label">KHO HÀNG</span>
            <router-link to="/admin/nhap-kho" class="nav-item">📦 Nhập kho hàng</router-link>
            <router-link to="/admin/kho" class="nav-item">📊 Kho hàng</router-link>
            <router-link to="/admin/hoa-don-nhap-kho" class="nav-item">📋 Hóa đơn nhập kho</router-link>
          </div>

          <div class="menu-section">
            <span class="section-label">TÀI CHÍNH & BÁO CÁO</span>
            <router-link to="/admin/so-thu-chi" class="nav-item">💰 Sổ thu chi</router-link>
            <router-link to="/admin/thong-ke" class="nav-item">📈 Thống kê tổng hợp</router-link>
          </div>

          <div class="menu-section">
            <span class="section-label">QUẢN TRỊ</span>
            <router-link to="/admin/people" class="nav-item">👥 Khách hàng & NCC</router-link>
            <router-link to="/admin/lich-su" class="nav-item">🕓 Lịch sử hoạt động</router-link>
            <router-link to="/admin/ghi-chu" class="nav-item">🗒️ Ghi chú & Nhắc việc</router-link>
          </div>
        </div>

        <!-- Footer -->
        <div class="sidebar-footer">
          <div class="footer-info">
            <span class="version">v2.0.1</span>
            <span class="copyright">© 2025 Techdy</span>
          </div>
        </div>
      </div>
    </nav>

    <!-- 📄 MAIN CONTENT AREA - KHÔNG CÓ EVENT -->
    <main class="main-content" :class="{ 'full-width': !isOpen }">
  <router-view />
</main>


    <!-- Overlay cho mobile -->
    <div class="overlay" :class="{ show: isOpen }" @click="isOpen = false"></div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isOpen = ref(true);
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}
</style>

<style scoped>
#app {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%);
}

/* SIDEBAR */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  z-index: 1000;

  /* ✨ Animate mượt bằng transform */
  transform: translateX(0);
  transition: transform 0.45s cubic-bezier(0.22, 0.61, 0.36, 1);
  will-change: transform;
}


.sidebar-backdrop {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

.sidebar-content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 2;
}

/* LOGO */
.sidebar-header {
  padding: 2rem 1.5rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon-wrapper {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
}

.logo-icon {
  font-size: 1.8rem;
  animation: float 3s ease-in-out infinite;
}

.logo-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  filter: blur(12px);
  opacity: 0.6;
  animation: pulse 2s infinite;
  pointer-events: none;
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.brand-name {
  font-size: 1.3rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 1.5px;
}

.brand-subtitle {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
}

/* MENU */
.sidebar-menu {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.sidebar-menu::-webkit-scrollbar {
  width: 4px;
}

.sidebar-menu::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.menu-section {
  margin-bottom: 1.5rem;
  padding: 0 1rem;
}

.section-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin-bottom: 0.6rem;
  padding: 0 0.8rem;
}

/* NAV ITEMS */
.nav-item {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.3rem;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  transform: translateX(4px);
}

.nav-item.router-link-active,
.nav-item.router-link-exact-active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.4), rgba(118, 75, 162, 0.4));
  color: white;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  transform: translateX(4px);
}

/* FOOTER */
.sidebar-footer {
  padding: 1.2rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
}

.version {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
}

/* MAIN CONTENT */
.main-content {
  position: fixed;
  left: 280px;
  top: 0;
  right: 0;
  bottom: 0;
  background: #f8fafc;
  overflow-y: auto;
  overflow-x: hidden;

  /* ✨ Animate theo sidebar */
  transition: left 0.45s cubic-bezier(0.22, 0.61, 0.36, 1);
}

/* Ẩn sidebar trên desktop khi tắt */
.sidebar.closed-desktop {
  transform: translateX(-100%);
}


/* Main content full width khi sidebar tắt (desktop) */
.main-content.full-width {
  left: 0;
}

.main-content::-webkit-scrollbar {
  width: 10px;
}

.main-content::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #667eea, #764ba2);
  border-radius: 5px;
}

/* TOGGLE BUTTON */
/* TOGGLE BUTTON - dùng cho mọi màn hình */
.btn-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 20px;
  left: 20px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 14px;
  z-index: 1100;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

/* Icon hamburger */
.hamburger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 24px;
}

.line {
  width: 100%;
  height: 2.5px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s;
}

/* Hiệu ứng X khi mở */
.btn-toggle.active .line:nth-child(1) {
  transform: translateY(7.5px) rotate(45deg);
}

.btn-toggle.active .line:nth-child(2) {
  opacity: 0;
}

.btn-toggle.active .line:nth-child(3) {
  transform: translateY(-7.5px) rotate(-45deg);
}

/* Overlay mặc định tắt, chỉ bật trên mobile */
.overlay {
  display: none;
}


/* ANIMATIONS */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.6; }
}

/* RESPONSIVE */
@media (max-width: 1200px) {
  .sidebar { width: 260px; }
  .main-content { left: 260px; }
}

@media (max-width: 992px) {
  .sidebar { width: 240px; }
  .main-content { left: 240px; }
}

@media (max-width: 768px) {

  
  .main-content {
    left: 0;
    width: 100vw;
  }

  .overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    z-index: 999;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
  }

  .overlay.show {
    opacity: 1;
    pointer-events: all;
  }
}


@media (max-width: 576px) {
  .sidebar { width: 85%; max-width: 320px; }
}
</style>