import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Trang chủ' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { title: 'Giới thiệu' },
    },
    {
      path: '/admin/hoa-don',
      name: 'QuanLyHoaDon',
      component: () => import('../views/QuanLyHoaDon.vue'),
      meta: { title: 'Quản lý hóa đơn' },
    },
    {
      path: '/admin/nhap-hoa-don',
      name: 'NhapHoaDon',
      component: () => import('../views/NhapHoaDon.vue'),
      meta: { title: 'Nhập hóa đơn' },
    },
    {
      path: '/admin/nhap-kho',
      name: 'NhapKho',
      component: () => import('../views/NhapKho.vue'),
      meta: { title: 'Nhập kho hàng' },
    },
    {
  path: '/admin/hoa-don-nhap-kho',
  name: 'QuanLyHoaDonNhapKho',
  component: () => import('../views/QuanLyHoaDonNhapKho.vue'),
  meta: { title: 'Quản lý hóa đơn nhập kho' },
},
  {
      path: '/admin/so-thu-chi',
      name: 'SoThuChi',
      component: () => import('../views/SoThuChi.vue'),
      meta: { title: 'Sổ thu chi' },
    },
    {
  path: '/admin/thong-ke',
  name: 'ThongKe',
  component: () => import('../views/Stat.vue'),
  meta: { title: 'Thống kê doanh thu' },
},
 {
      path: '/admin/kho',
      name: 'Kho',
      component: () => import('../views/Kho.vue'),
      meta: { title: 'Kho hàng' },
    },
     {
      path: '/admin/people',
      name: 'People',
      component: () => import('../views/People.vue'),
      meta: { title: 'Khách hàng & Nhà cung cấp' },
    },
    {
  path: '/admin/lich-su',
  name: 'History',
  component: () => import('../views/History.vue'),
  meta: { title: 'Lịch sử hoạt động' },
},
{
      path: '/admin/ghi-chu',
      name: 'GhiChu',
      component: () => import('../views/GhiChu.vue'),
      meta: { title: 'Ghi chú & nhắc việc' },
    },

  ],

})

// 🧠 Tự động đổi title tab
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
    ? `Techdy Admin - ${to.meta.title}`
    : 'Techdy Admin'
  next()
})

export default router
