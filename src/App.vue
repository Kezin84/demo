<template>
  <div id="app">
    <!-- 🌐 Nút mở menu khi màn hình nhỏ -->
    <button class="btn-toggle" @click="isOpen = !isOpen">☰</button>

    <!-- 🧭 SIDEBAR -->
    <nav class="sidebar" :class="{ open: isOpen }">
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

    <!-- 📄 NỘI DUNG CHÍNH -->
    <main class="main-content" @click="isOpen = false">
      <div class="content-wrapper">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
const isOpen = ref(false);
</script>

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
   📁 SIDEBAR
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
  transition: all 0.3s ease;
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
  margin-left: 240px;
  flex: 1;
  width: calc(100vw - 240px);
  height: 100vh;
  background-color: #f8f9fb;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
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
   📱 RESPONSIVE
====================== */

/* 💻 Tablet */
@media (max-width: 992px) {
  .sidebar {
    width: 200px;
  }
  .main-content {
    margin-left: 200px;
    width: calc(100vw - 200px);
  }
}

/* 📱 Mobile ngang */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -240px;
    top: 0;
    height: 100%;
    transition: left 0.3s ease;
  }
  .sidebar.open {
    left: 0;
  }
  .main-content {
    margin-left: 0;
    width: 100%;
  }
  .btn-toggle {
    display: block;
  }
}

/* 📲 Điện thoại nhỏ (≤576px) */
@media (max-width: 576px) {
  .btn-toggle {
    position: fixed;
    top: 10px;
    left: 10px;
    background: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 0.7rem;
    border-radius: 6px;
    z-index: 1100;
    font-size: 1.2rem;
  }
  .sidebar {
    width: 75%;
    max-width: 250px;
  }
  .nav-item {
    font-size: 1rem;
    padding: 0.8rem 1rem;
  }
  .sidebar-header h3 {
    font-size: 1rem;
  }
}

/* 🧱 Force router-view full width */
.main-content,
.main-content > .content-wrapper,
.main-content > * {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
  box-sizing: border-box;
}
</style>
