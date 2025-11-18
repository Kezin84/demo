<template>
  <div class="container-fluid py-4">
    <h2 class="text-center mb-4 fw-bold" style="color: #2E4C8F;">📄 QUẢN LÝ HÓA ĐƠN</h2>

    <!-- Layout 2 cột: Ô 1 (trái) + Ô 2 (phải) -->
    <div class="row g-3 mb-4">
      
      <!-- ========== Ô 1: BỘ LỌC (TRÁI) ========== -->
      <div class="col-lg-6">
        <div class="filter-box p-4 shadow-sm">
          <h5 class="box-title mb-3">🔧 BỘ LỌC</h5>
          
          <!-- Sắp xếp -->
          <div class="mb-3">
            <label class="form-label fw-bold">SẮP XẾP</label>
            <select v-model="filters.sortOrder" class="form-select">
              <option value="desc">Mới nhất → Cũ nhất</option>
              <option value="asc">Cũ nhất → Mới nhất</option>
            </select>
          </div>

          <!-- Từ ngày - Đến ngày -->
          <div class="row g-2 mb-3">
            <div class="col-6">
              <label class="form-label fw-bold">TỪ NGÀY</label>
              <input v-model="filters.fromDate" type="date" class="form-control" />
            </div>
            <div class="col-6">
              <label class="form-label fw-bold">ĐẾN NGÀY</label>
              <input v-model="filters.toDate" type="date" class="form-control" />
            </div>
          </div>

          <!-- Trạng thái HĐ -->
          <div class="mb-3">
            <label class="form-label fw-bold">TRẠNG THÁI HĐ</label>
            <select v-model="filters.trangThai" class="form-select">
              <option value="">-- Tất cả --</option>
              <option value="Mua">Mua</option>
              <option value="Trả">Trả</option>
              <option value="Mua & Trả">Mua & Trả</option>
            </select>
          </div>

          <!-- Hình thức thanh toán -->
          <div class="mb-3">
            <label class="form-label fw-bold">HÌNH THỨC THANH TOÁN</label>
            <select v-model="filters.thanhToan" class="form-select">
              <option value="">-- Tất cả --</option>
              <option value="Tiền mặt">Tiền mặt</option>
              <option value="Chuyển khoản">Chuyển khoản</option>
              <option value="Nợ">Nợ</option>
            </select>
          </div>

          <!-- Nút làm mới -->
          <button class="btn btn-refresh w-100" @click="resetFilters">
            🔄 LÀM MỚI
          </button>
        </div>
      </div>

      <!-- ========== Ô 2: TÌM KIẾM (PHẢI) ========== -->
      <div class="col-lg-6">
        <div class="search-box p-4 shadow-sm">
          <h5 class="box-title mb-3">🔍 TÌM KIẾM</h5>

          <!-- Tìm theo Mã KH -->
          <div class="mb-3">
            <label class="form-label fw-bold">TÌM THEO MÃ KH</label>
            <input
              v-model.trim="filters.maKH"
              type="text"
              class="form-control"
              placeholder="Nhập mã khách hàng..."
            />
          </div>

          <!-- Tìm theo Tên khách -->
          <div class="mb-3">
            <label class="form-label fw-bold">TÌM THEO TÊN KHÁCH</label>
            <input
              v-model.trim="filters.tenKH"
              type="text"
              class="form-control"
              placeholder="Nhập tên khách hàng..."
            />
          </div>

          <!-- Tìm theo Mã HĐ -->
          <div class="mb-3">
            <label class="form-label fw-bold">TÌM THEO MÃ HÓA ĐƠN</label>
            <input
              v-model.trim="filters.maHD"
              type="text"
              class="form-control"
              placeholder="Nhập mã hóa đơn..."
            />
          </div>

          <!-- Tìm theo Số HĐ -->
          <div class="mb-3">
            <label class="form-label fw-bold">TÌM THEO SỐ HÓA ĐƠN</label>
            <input
              v-model.trim="filters.soHD"
              type="text"
              class="form-control"
              placeholder="Nhập số hóa đơn..."
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-2 text-primary fw-bold">Đang tải hóa đơn...</p>
    </div>

    <!-- ========== Ô 3: BẢNG HÓA ĐƠN (DƯỚI) ========== -->
    <div class="table-container shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-header">
            <tr>
              <th>STT</th>
              <th>MÃ HĐ</th>
              <th>SỐ HĐ</th>
              <th>MÃ KH</th>
              <th>TÊN KHÁCH</th>
              <th>NGÀY TẠO</th>
              <th>TRẠNG THÁI</th>
              <th>TỔNG CỘNG</th>
              <th>THANH TOÁN</th>
              <th>GHI CHÚ</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(hd, idx) in paginatedHoaDon"
              :key="hd.ma_hoa_don || hd.MA_HOA_DON"
              class="table-row"
            >
              <td class="text-center">{{ (page - 1) * perPage + idx + 1 }}</td>
              <td class="text-center">
                <a
                  href="#"
                  class="link-invoice fw-bold"
                  @click.prevent="xuatAnhHoaDonGiay(hd)"
                >
                  {{ hd.ma_hoa_don || hd.MA_HOA_DON }}
                </a>
              </td>
              <td class="text-center">
                <a
                  href="#"
                  class="link-invoice"
                  @click.prevent="xuatAnhHoaDonGiay(hd)"
                >
                  {{ hd.so_hoa_don || hd.SO_HOA_DON }}
                </a>
              </td>
              <td class="text-center">{{ hd.ma_khach_hang || hd.MA_KHACH_HANG }}</td>
              <td>{{ hd.ten_khach_hang || hd.TEN_KHACH_HANG }}</td>
              <td class="text-center">{{ hd.ngay_tao_duong_lich || hd.NGAY_TAO_DUONG_LICH }}</td>
              <td class="text-center">
                <span
                  :class="{
                    'status-buy': trangThai(hd) === 'Mua',
                    'status-return': trangThai(hd) === 'Trả',
                    'status-both': trangThai(hd) === 'Mua & Trả',
                  }"
                >
                  {{ trangThai(hd) }}
                </span>
              </td>
              <td class="text-end">
                <strong 
                  :class="{
                    'money-positive': (hd.tong_cong || hd.TONG_CONG) >= 0,
                    'money-negative': (hd.tong_cong || hd.TONG_CONG) < 0
                  }"
                >
                  {{ formatNum(hd.tong_cong || hd.TONG_CONG) }}
                </strong>
              </td>
              <td class="text-center">
                <span 
                  class="badge-payment"
                  :class="{
                    'badge-cash': (hd.hinh_thuc_thanh_toan || hd.HINH_THUC_THANH_TOÁN) === 'Tiền mặt',
                    'badge-transfer': (hd.hinh_thuc_thanh_toan || hd.HINH_THUC_THANH_TOÁN) === 'Chuyển khoản',
                    'badge-debt': (hd.hinh_thuc_thanh_toan || hd.HINH_THUC_THANH_TOÁN) === 'Nợ',
                  }"
                >
                  {{ hd.hinh_thuc_thanh_toan || hd.HINH_THUC_THANH_TOÁN }}
                </span>
              </td>
              <td>{{ hd.ghi_chu || hd.GHI_CHU }}</td>
            </tr>

            <tr v-if="filteredHoaDon.length === 0">
              <td colspan="10" class="text-center text-muted py-4">
                Không có hóa đơn nào phù hợp
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Phân trang -->
      <div class="pagination-area py-3">
        <button
          class="btn btn-paging"
          :disabled="page === 1"
          @click="prevPage"
        >
          ← Trước
        </button>
        <span class="page-info">Trang {{ page }} / {{ totalPages }}</span>
        <button
          class="btn btn-paging"
          :disabled="page === totalPages"
          @click="nextPage"
        >
          Sau →
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ========== Ô 1 & 2: Filter & Search Boxes ========== */
.container-fluid {
  max-width: 1600px;
  margin-inline: auto;
  padding-inline: clamp(1rem, 3vw, 3rem);
  padding-top: 2rem;
}

.filter-box,
.search-box {
  background: #ffffff;
  border: 2px solid #dde3ee;
  border-radius: 10px;
  overflow: hidden;
  padding: 0; /* bỏ padding, dồn vào body bên trong */
  
}

.box-title {
  background: linear-gradient(135deg, #1a2f63 0%, #13244a 100%);
  color: #ffffff !important;
  padding: 14px 20px;
  margin: 0;
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  border-bottom: 3px solid rgba(255, 255, 255, 0.25);
  text-shadow: 0 1px 2px rgba(0,0,0,0.35);
  border-radius: 10px;
}
.filter-box .content,
.search-box .content {
  padding: 22px;
  font-weight: bold;
}

.form-label {
  color: #2E4C8F;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 6px;
  text-transform: uppercase;
}

.form-control,
.form-select {
  border: 1px solid #dde3ee;
  border-radius: 20px;
  padding: 8px 12px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #2E4C8F;
  box-shadow: 0 0 0 0.15rem rgba(46, 76, 143, 0.1);
  outline: none;
}

/* Nút Làm mới */
.btn-refresh {
  background: #2E4C8F;
  color: white;
  font-weight: 700;
  padding: 10px;
  border: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-size: 0.9rem;
}

.btn-refresh:hover {
  background: #1e3a6f;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(46, 76, 143, 0.25);
}

/* ========== Loading Overlay ========== */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-overlay .spinner-border {
  width: 3.5rem;
  height: 3.5rem;
  border-width: 0.35rem;
  color: #2E4C8F;
}

/* ========== Ô 3: Bảng hóa đơn ========== */
.table-container {
  background: white;
  border: 2px solid #dde3ee;
  border-radius: 8px;
  overflow: hidden;
}

.table {
  margin-bottom: 0;
}

/* Header bảng - SIÊU SÁNG */
/* HEADER SIÊU ĐẬM + CHỮ TRẮNG NÉT */
.table-header {
  background: linear-gradient(135deg, #1a2f63 0%, #13244a 100%) !important;
}

.table-header th {
  padding: 16px 12px;
  border: none;
  font-size: 0.9rem;
  font-weight: 900; /* CHỮ ĐẬM HƠN */
  text-align: center;
  color: #ffffff !important;
  text-transform: uppercase;
  letter-spacing: 1px; /* KẼ GIÃN CHỮ CHO NÉT */
  vertical-align: middle;
  border-right: 1px solid rgba(255, 255, 255, 0.15);
  text-shadow: 0 1px 3px rgba(0,0,0,0.4); /* GIÚP CHỮ SÁNG NỔI */
}

.table-header th:last-child {
  border-right: none;
}

/* ===== HEADER BẢNG SIÊU ĐẸP ===== */

/* Nền gradient xanh đậm */
.table-container table thead {
  background: linear-gradient(135deg, #1a2f63 0%, #13244a 100%) !important;
  position: relative;
}

/* Tạo viền sáng dưới header */
.table-container table thead::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #4b6cb7, #182848);
  opacity: 0.9;
}

/* TH trong suốt để lộ nền */
.table-container table thead th {
  background: transparent !important;
  padding: 16px 12px;
  border: none;
  color: #fff !important;
  font-size: 0.9rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  vertical-align: middle;
  text-shadow: 0 1px 3px rgba(0,0,0,0.35);
}

.table-row {
  transition: all 0.15s ease;
  background: #ffffff;
}

.table-row {
  border-left: 4px solid transparent;
  transition: all 0.2s ease;
}

.table-row:hover {
  background-color: #f2f6ff;
  border-left: 4px solid #2E4C8F;
}


.table-row td {
  padding: 14px 12px;
  font-size: 0.9rem;
  vertical-align: middle;
  border-color: #e9ecef;
  border-bottom: 1px solid #e9ecef;
}

/* Link hóa đơn */
.link-invoice {
  color: #2E4C8F;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.2s ease;
  position: relative;
  display: inline-block;
}

.link-invoice:hover {
  color: #1e3a6f;
  text-decoration: underline;
}

.link-invoice:active {
  transform: scale(0.96);
}

/* Số tiền - DƯƠNG = XANH LÁ, ÂM = ĐỎ */
.money-positive {
  font-size: 1.05rem;
  font-weight: 900;
  color: #28a745 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.money-negative {
  font-size: 1.05rem;
  font-weight: 900;
  color: #dc3545 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

/* Badge thanh toán */
.badge-payment {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12);
  white-space: nowrap;
}

.badge-cash {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.badge-transfer {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
}

.badge-debt {
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
  color: #000;
  font-weight: 800;
}

/* Trạng thái */
.status-buy {
  color: #28a745;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 4px;
  background: #d4edda;
  display: inline-block;
}

.status-return {
  color: #dc3545;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 4px;
  background: #f8d7da;
  display: inline-block;
}

.status-both {
  color: #2E4C8F;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 4px;
  background: #E8EEF7;
  display: inline-block;
}

/* ========== Phân trang ========== */
.pagination-area {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  background: #f8f9fc;
  border-top: 2px solid #dde3ee;
}

.btn-paging {
  background: #2E4C8F;
  color: white;
  border: none;
  padding: 9px 22px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-paging:hover:not(:disabled) {
  background: #1e3a6f;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(46, 76, 143, 0.3);
}

.btn-paging:disabled {
  background: #b0b8c7;
  cursor: not-allowed;
  opacity: 0.6;
}

.page-info {
  font-weight: 700;
  color: #2E4C8F;
  font-size: 1rem;
}

/* ========== Responsive ========== */
@media (max-width: 991px) {
  .filter-box,
  .search-box {
    margin-bottom: 20px;
  }
}
</style>

<script>
export default {
  data() {
    return {
      hoaDonList: [],
      page: 1,
      perPage: 15,
      filters: {
        maKH: "",
        tenKH: "",
        maHD: "",
        soHD: "",
        fromDate: "",
        toDate: "",
        sortOrder: "desc",
        trangThai: "", // Mua / Trả / Mua & Trả
        thanhToan: "", // Tiền mặt / Chuyển khoản / Nợ
        isLoadingDetail: false,

      },
      apiUrl:
        "https://script.google.com/macros/s/AKfycbz_vsTrvAjmYq51LTtQhe-nkdOzbMQcpMGslSU8tuSObycF9l5HT7cqYKhJ11uqrpL8/exec",
    };
  },

  computed: {
    filteredHoaDon() {
      let data = [...this.hoaDonList];

      const removeAccents = (str) =>
        String(str || "")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/g, "d")
          .replace(/Đ/g, "D")
          .trim()
          .toLowerCase();

      const normalize = (str) => removeAccents(str).replace(/\s*&\s*/g, "&");

      const parseVNDateTime = (str) => {
        if (!str) return null;
        const parts = String(str).trim().split(" ");
        if (parts.length < 2) return null;
        const [time, date] = parts;
        const [hour, minute, second] = time.split(":").map(Number);
        const [day, month, year] = date.split("/").map(Number);
        if (!day || !month || !year) return null;
        return new Date(year, month - 1, day, hour || 0, minute || 0, second || 0);
      };

      const {
        maKH,
        tenKH,
        maHD,
        soHD,
        fromDate,
        toDate,
        sortOrder,
        trangThai,
        thanhToan,
      } = this.filters;

      // 🔍 Lọc text tuyệt đối
      if (maKH.trim()) {
        const val = removeAccents(maKH);
        data = data.filter(
          (r) => removeAccents(r.ma_khach_hang || r.MA_KHACH_HANG) === val
        );
      }

      if (tenKH.trim()) {
        const val = removeAccents(tenKH);
        data = data.filter(
          (r) => removeAccents(r.ten_khach_hang || r.TEN_KHACH_HANG) === val
        );
      }

      if (maHD.trim()) {
        const val = removeAccents(maHD);
        data = data.filter(
          (r) => removeAccents(r.ma_hoa_don || r.MA_HOA_DON) === val
        );
      }

      if (soHD.trim()) {
        const val = removeAccents(soHD);
        data = data.filter(
          (r) => removeAccents(r.so_hoa_don || r.SO_HOA_DON) === val
        );
      }

      // 🗓️ Lọc theo khoảng ngày
      if (fromDate || toDate) {
        const from = fromDate ? new Date(fromDate + "T00:00:00") : null;
        const to = toDate ? new Date(toDate + "T23:59:59") : null;
        data = data.filter((r) => {
          const ngay = parseVNDateTime(
            r.ngay_tao_duong_lich || r.NGAY_TAO_DUONG_LICH
          );
          if (!ngay) return false;
          if (from && ngay < from) return false;
          if (to && ngay > to) return false;
          return true;
        });
      }

      // 🔹 Lọc theo Trạng thái (đọc trực tiếp từ sheet)
      if (trangThai) {
        const tt = normalize(trangThai);
        data = data.filter((r) => {
          const val = normalize(r.trang_thai || r.TRANG_THAI || "");
          return val === tt;
        });
      }

      // 🔹 Lọc theo hình thức thanh toán
      if (thanhToan) {
        const ht = normalize(thanhToan);
        data = data.filter((r) => {
          const val = normalize(
            r.hinh_thuc_thanh_toan || r.HINH_THUC_THANH_TOAN || ""
          );
          return val === ht;
        });
      }

      // 🕓 Sắp xếp theo ngày
      data.sort((a, b) => {
        const da = parseVNDateTime(
          a.ngay_tao_duong_lich || a.NGAY_TAO_DUONG_LICH
        );
        const db = parseVNDateTime(
          b.ngay_tao_duong_lich || b.NGAY_TAO_DUONG_LICH
        );
        if (!da || !db) return 0;
        return sortOrder === "asc" ? da - db : db - da;
      });

      return data;
    },

    totalPages() {
      return Math.max(1, Math.ceil(this.filteredHoaDon.length / this.perPage));
    },

    paginatedHoaDon() {
      const start = (this.page - 1) * this.perPage;
      return this.filteredHoaDon.slice(start, start + this.perPage);
    },
  },

  watch: {
    filters: {
      handler() {
        this.page = 1;
      },
      deep: true,
    },
  },

  methods: {
    formatNum(n) {
      return Number(n || 0).toLocaleString("vi-VN");
    },

    // ✅ Trả trạng thái trực tiếp từ dữ liệu
    trangThai(hd) {
      return hd.trang_thai || hd.TRANG_THAI || "-";
    },
        /** 🧾 Xuất hóa đơn + in + tải ảnh (hoạt động thật) */
    async xuatAnhHoaDonGiay(hd) {
      try {
        const res = await fetch(
          `${this.apiUrl}?action=getHoaDonChiTiet&ma_hoa_don=${encodeURIComponent(
            hd.ma_hoa_don || hd.MA_HOA_DON
          )}`
        );
        const chiTiet = await res.json();
        if (!chiTiet || chiTiet.length === 0)
          return alert("Không có chi tiết hóa đơn!");

        const rows = chiTiet
          .map(
            (item, i) => `
          <tr>
            <td>${i + 1}</td>
            <td class="left">${item.ten_hang || item.TEN_HANG}</td>
            <td>${item.so_luong || item.SO_LUONG}</td>
            <td>${item.dvt || item.DVT}</td>
            <td>${Number(item.don_gia || item.DON_GIA).toLocaleString("vi-VN")}</td>
            <td>${Number(item.thanh_tien || item.THANH_TIEN).toLocaleString("vi-VN")}</td>
            <td class="${(item.trang_thai || item.TRANG_THAI) === "Mua" ? "green" : "red"}">
              ${item.trang_thai || item.TRANG_THAI}
            </td>
          </tr>`
          )
          .join("");

       const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Hóa đơn ${hd.so_hoa_don || hd.SO_HOA_DON}</title>
  <style>
    /* --- Cấu hình in A5 --- */
    @page {
      size: A5 portrait;
      margin: 10mm;
    }
    @media print {
      body { zoom: 85%; }       /* Giảm nhẹ kích thước để vừa trang */
      .tools { display: none !important; } /* Ẩn nút tải/in khi in */
    }

    body {
      font-family:'Times New Roman',serif;
      color:#000;
      margin:0;
      padding:0;
      background:#fff;
    }
    .invoice-paper {
      width: 100%;
      max-width: 140mm; /* vừa khổ A5 */
      margin:auto;
      border:1px solid #003399;
      padding:10mm 8mm;
      background:#fff;
      box-sizing:border-box;
    }
    .shop-name {
      text-align:center;
      color:#b30000;
      margin-bottom:4px;
    }
    .shop-name .main {
      font-size:22px;
      font-weight:900;
      text-transform:uppercase;
      margin:0 6px;
    }
    .shop-info {
      text-align:center;
      color:#003399;
      font-weight:600;
      font-size:12px;
      line-height:1.3;
    }
    h4 {
      text-align:center;
      text-decoration:underline;
      color:#003399;
      margin:6px 0;
      font-size:16px;
    }
    .info-block {
      text-align:left;
      font-size:12px;
      margin-bottom:6px;
      line-height:1.3;
    }
    table {
      width:100%;
      border-collapse:collapse;
      font-size:11px;
      margin-top:4px;
    }
    th,td {
      border:1px solid #003399;
      padding:4px 3px;
      text-align:center;
    }
    th {
      background:#003399;
      color:#fff;
      font-weight:bold;
    }
    td.left { text-align:left; padding-left:4px; }
    .green { color:#008000;font-weight:bold; }
    .red { color:#cc0000;font-weight:bold; }
    .note {
      font-style:italic;
      color:#003399;
      margin-top:5px;
      text-align:left;
      font-size:11px;
    }
    .footer {
      text-align:right;
      font-size:12px;
      margin-top:5px;
      line-height:1.4;
    }
    .footer b { color:#003399; }
    .footer .total {
      color:red;
      font-weight:bold;
      font-size:13px;
      border-top:1px solid #003399;
      padding-top:4px;
      margin-top:4px;
    }
    .tools {
      text-align:center;
      margin:8px 0;
    }
    .tools button {
      margin:0 5px;
      padding:5px 10px;
      border:none;
      border-radius:6px;
      cursor:pointer;
      font-weight:600;
    }
    .btn-download { background:#007bff;color:#fff; }
    .btn-print { background:#28a745;color:#fff; }
  </style>
</head>
<body>
  <div class="tools">
    <button id="btnDownload" class="btn-download">📸 Tải ảnh</button>
    <button id="btnPrint" class="btn-print">🖨️ In hóa đơn</button>
  </div>
  <div class="invoice-paper" id="invoice-area">
    <div class="shop-name">
      <span>𝓗à𝓷𝓰 𝓠𝓾ầ𝓷 Á𝓸</span>
      <span class="main">THỦY KIM</span>
      <span>(𝓛𝓪𝓷 𝓗ạ𝓽)</span>
    </div>
    <div class="shop-info">
      <p>Đ/C: 22B Nguyễn Trãi - P.4 - TP. Tuy Hòa, Phú Yên</p>
      <p>ĐT: 0942.028.933(Lan) - 082.390.7079(Thủy) - 091.8121.427(Kim)</p>
      <p>STK: Lê Thị Phương Thủy _ MSB: 32001010923656 _ MB: 8500100044007</p>
    </div>
    <h4>HÓA ĐƠN BÁN HÀNG</h4>
    <div class="info-block">
      <p><b>Mã HĐ:</b> ${hd.so_hoa_don || "-"} &nbsp;&nbsp;&nbsp;
         <b>Ngày lập:</b> ${hd.ngay_tao_duong_lich || hd.NGAY_TAO_DUONG_LICH || "-"}</p>
      <p><b>Tên KH:</b> ${hd.ten_khach_hang || "-"} &nbsp;&nbsp;&nbsp;
         <b>SĐT:</b> ${hd.so_dien_thoai_khach || "-"}<br>
         <b>Địa chỉ:</b> ${hd.dia_chi_khach || "-"}</p>
    </div>
    <table>
      <thead>
        <tr>
          <th>STT</th><th>TÊN HÀNG</th><th>SL</th><th>DVT</th>
          <th>ĐƠN GIÁ</th><th>THÀNH TIỀN</th><th>TT</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="note">Hàng đổi trả trong 30 ngày kèm hóa đơn mua hàng.</p>
    <div class="footer">
      <p>Tạm tính: <b>${this.formatNum(hd.tam_tinh || hd.TAM_TINH)}</b> đ</p>
      <p>Hàng trả: <b>${this.formatNum(hd.hang_tra || hd.HANG_TRA)}</b> đ</p>
      <p>Nợ cũ: <b>${this.formatNum(hd.no_cu || hd.NO_CU)}</b> đ</p>
      <p>Khách trả: <b>${this.formatNum(hd.tra_tien || hd.TRA_TIEN)}</b> đ</p>
      <p>Hình thức TT: <b>${hd.hinh_thuc_thanh_toan || hd.HINH_THUC_THANH_TOAN || "-"}</b></p>
      <p class="total">TỔNG CỘNG: ${this.formatNum(hd.tong_cong || hd.TONG_CONG)} đ</p>
      <p>Ghi chú: ${hd.ghi_chu || hd.GHI_CHU || "-"}</p>
    </div>
  </div>
</body>
</html>`;


        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const newWin = window.open(url, "_blank", "width=950,height=900");

        // Inject html2canvas và các nút
        newWin.onload = async () => {
          const script = newWin.document.createElement("script");
          script.src =
            "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
          newWin.document.head.appendChild(script);

          script.onload = () => {
            const btnDownload = newWin.document.getElementById("btnDownload");
            const btnPrint = newWin.document.getElementById("btnPrint");

            btnDownload.addEventListener("click", async () => {
              const el = newWin.document.getElementById("invoice-area");
              const canvas = await newWin.html2canvas(el, {
                backgroundColor: "#fff",
                scale: 2,
              });
              const link = newWin.document.createElement("a");
              link.download = `HoaDon_${hd.so_hoa_don || hd.SO_HOA_DON}.png`;

              link.href = canvas.toDataURL("image/png");
              link.click();
            });

            btnPrint.addEventListener("click", () => newWin.print());
          };
        };
      } catch (err) {
        console.error("❌ Lỗi xuất hóa đơn:", err);
        alert("Không thể hiển thị hóa đơn chi tiết!");
      }
    },

    // ✅ Fetch hóa đơn (không cần gọi API trạng thái)
    async fetchHoaDon() {
      try {
        console.log("🚀 Đang tải hóa đơn & khách hàng...");
        const [resHD, resKH] = await Promise.all([
          fetch(this.apiUrl + "?action=getHoaDonTong"),
          fetch(this.apiUrl + "?action=getKhachHang"),
        ]);

        if (!resHD.ok || !resKH.ok)
          throw new Error("API trả lỗi HTTP");

        const [hoaDonData, khachData] = await Promise.all([
          resHD.json(),
          resKH.json(),
        ]);

        const khachMap = {};
        (khachData || []).forEach((kh) => {
          const ma = String(kh.ma_khach_hang || kh.MA_KHACH_HANG || "").trim();
          if (ma) {
            khachMap[ma] = {
              sdt: kh.so_dien_thoai || kh.SDT || "",
              diachi: kh.dia_chi || kh.DIA_CHI || "",
            };
          }
        });

        // ✅ Join hóa đơn với thông tin khách
        this.hoaDonList = (hoaDonData || []).map((hd) => {
          const maKH = String(hd.ma_khach_hang || hd.MA_KHACH_HANG || "").trim();
          const info = khachMap[maKH] || {};
          return {
            ...hd,
            so_dien_thoai_khach: info.sdt,
            dia_chi_khach: info.diachi,
            hang_tra: Number(hd.hang_tra || hd.HANG_TRA || 0),
          };
        });

        console.log("✅ Hoàn tất load dữ liệu hóa đơn");
      } catch (err) {
        console.error("❌ Lỗi tải dữ liệu:", err);
        alert("Không thể tải danh sách hóa đơn!");
      }
    },

    nextPage() {
      if (this.page < this.totalPages) this.page++;
    },
    prevPage() {
      if (this.page > 1) this.page--;
    },
    resetFilters() {
      this.filters = {
        maKH: "",
        tenKH: "",
        maHD: "",
        soHD: "",
        fromDate: "",
        toDate: "",
        sortOrder: "desc",
        trangThai: "",
        thanhToan: "",
      };
      this.page = 1;
    },
  },

  mounted() {
    this.fetchHoaDon();
  },
};
</script>

