<template>
  <div class="container-fluid py-4">
    <h2 class="text-center mb-4 fw-bold" style="color: #1a2f63;">📦 KHO HÀNG</h2>

    <!-- ========== Ô 1: TÌM KIẾM ========== -->
    <div class="search-section shadow-sm mb-3">
      <div class="search-header">
        <h5 class="search-title">TÌM KIẾM</h5>
      </div>
      <div class="search-content">
        <input 
          v-model="search" 
          class="form-control" 
          placeholder="🔎 Nhập mã hoặc tên hàng để tìm kiếm..." 
        />
      </div>
    </div>

    <!-- ========== Ô 2: BỘ LỌC & HÀNH ĐỘNG ========== -->
    <div class="filter-section shadow-sm mb-4">
      <div class="filter-header">
        <h5 class="filter-title">BỘ LỌC & HÀNH ĐỘNG</h5>
      </div>
      <div class="filter-content">
        <div class="row g-2">
          <!-- Sắp xếp -->
          <div class="col-md-2">
            <label class="form-label">Sắp xếp</label>
            <select v-model="sortOrder" class="form-select form-select-sm">
              <option value="desc">Mới → Cũ</option>
              <option value="asc">Cũ → Mới</option>
            </select>
          </div>

          <!-- Thời gian -->
          <div class="col-md-3">
            <label class="form-label">Thời gian</label>
            <div class="row g-1">
              <div class="col-6">
                <input type="date" v-model="filterFromDate" class="form-control form-control-sm" placeholder="Từ" />
              </div>
              <div class="col-6">
                <input type="date" v-model="filterToDate" class="form-control form-control-sm" placeholder="Đến" />
              </div>
            </div>
          </div>

          <!-- Nhà cung cấp -->
          <div class="col-md-2">
            <label class="form-label">Nhà cung cấp</label>
            <select v-model="filterNCC" class="form-select form-select-sm">
              <option value="">-- Tất cả --</option>
              <option v-for="n in uniqueNCC" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>

          <!-- Danh mục | Hình thức nhập -->
          <div class="col-md-3">
            <label class="form-label">Danh mục | Hình thức</label>
            <div class="row g-1">
              <div class="col-6">
                <select v-model="filterDanhMuc" class="form-select form-select-sm">
                  <option value="">Danh mục</option>
                  <option v-for="d in uniqueDanhMuc" :key="d" :value="d">{{ d }}</option>
                </select>
              </div>
              <div class="col-6">
                <select v-model="filterHinhThuc" class="form-select form-select-sm">
                  <option value="">Hình thức</option>
                  <option value="lo">Theo lô</option>
                  <option value="le">Nhập lẻ</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Nút hành động -->
          <div class="col-md-3 d-flex align-items-end gap-1">

  <!-- Nút In -->
  <button 
    class="btn btn-success btn-sm flex-fill" 
    :disabled="selected.length === 0"
    @click="inMaQR"
  >
    🖨️ In {{ selected.length || '' }}
  </button>

  <!-- Nút hủy chọn -->
  <button
    v-if="selected.length > 0"
    class="btn btn-warning btn-sm flex-fill"
    @click="selected = []"
  >
    ❌ Hủy chọn
  </button>

  <!-- Nút reload -->
  <button 
    class="btn btn-secondary btn-sm" 
    @click="fetchData(true)"
    title="Load lại danh sách"
  >
    🔄
  </button>

</div>

        </div>

        <!-- Nút xóa bộ lọc -->
        <div v-if="isFiltered" class="mt-2">
          <button class="btn btn-outline-danger btn-sm" @click="clearFilters">
            🧹 Xóa bộ lọc
          </button>
          <button 
            v-if="selected.length > 0"
            class="btn btn-warning btn-sm ms-2"
            @click="selected = []"
          >
            ❌ Hủy chọn ({{ selected.length }})
          </button>
        </div>
      </div>
    </div>

    <!-- ========== Ô 3: DANH SÁCH THẺ HÀNG ========== -->
    <div class="cards-section">
      <div class="row g-3">
        <div v-for="hang in paginatedHangHoa" :key="hang.ma_hang" class="col-12 col-sm-6 col-md-4 col-lg-3">
          <div
            class="product-card shadow-sm"
            :class="{ 'selected': selected.includes(hang.ma_hang) }"
            @click="moChiTiet(hang)"
          >
            <!-- Checkbox chọn -->
            <input
              type="checkbox"
              class="card-checkbox"
              v-model="selected"
              :value="hang.ma_hang"
              @click.stop
            />

            <!-- QR Image -->
            <div class="card-qr">
              <img
                :src="hang.qr_img || 'https://placehold.co/180x180?text=No+QR'"
                alt="QR Code"
              />
            </div>

            <!-- Card Info -->
            <div class="card-info">
              <div class="card-code">{{ hang.ma_hang }}</div>
              <div class="card-name">{{ hang.ten_hang }}</div>
              
              <div class="card-prices">
                <div v-if="hang.gia_1_lo" class="price-item">
                  Giá lô: <strong>{{ formatMoney(hang.gia_1_lo) }}</strong>
                </div>
                <div class="price-item">
                  Giá gốc: <strong>{{ formatMoney(hang.gia_goc) }}</strong>
                </div>
                <div class="price-item">
                  Giá bán: <strong class="text-success">{{ formatMoney(hang.don_gia) }}</strong>
                </div>
                <div class="price-item">
                  Tồn kho: <strong class="text-primary">{{ hang.so_luong_kho }}</strong>
                </div>
              </div>

              <div class="card-time">
                🕓 {{ hang.thoi_gian_tao_duong_lich || "Chưa có thời gian" }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Phân trang -->
      <div class="pagination-area">
        <button class="btn btn-paging" :disabled="page === 1" @click="page--">« Trước</button>
        <span class="page-info">Trang {{ page }} / {{ totalPages }}</span>
        <button class="btn btn-paging" :disabled="page === totalPages" @click="page++">Sau »</button>
      </div>
    </div>

    <!-- ========== MODAL CHI TIẾT ========== -->
    <div v-if="showModal" class="modal fade show d-block">
      <div class="modal-backdrop" @click="showModal = false"></div>
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ chiTiet.ten_hang || 'Chi tiết hàng hóa' }}</h5>
            <button class="btn-close" @click="showModal = false"></button>
          </div>

          <div class="modal-body">
            <div class="row g-2">
              <div class="col-md-6">
                <label class="form-label fw-bold small">Mã hàng cũ</label>
                <input v-model="chiTiet.maHangCu" class="form-control form-control-sm" readonly />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-bold small">Mã hàng mới</label>
                <input v-model="chiTiet.ma_hang_moi" class="form-control form-control-sm" readonly />
              </div>

              <!-- QR preview -->
              <div class="col-12 text-center">
                <label class="form-label fw-bold small">Mã QR</label>
                <div>
                  <img
                    v-if="chiTiet.qr_img"
                    :src="chiTiet.qr_img"
                    alt="QR Preview"
                    class="img-fluid mb-2"
                    style="max-width:150px"
                  />
                  <div v-else class="text-muted small mb-2">⚠️ Chưa có mã QR</div>

                  <button
                    v-if="!chiTiet.qr_img && !daTaoQR"
                    class="btn btn-outline-primary btn-sm fw-bold"
                    @click="taoMaQR"
                  >
                    🔄 Tạo mã QR
                  </button>
                </div>
              </div>

              <div v-for="(label, key) in fieldLabels" :key="key" class="col-md-6" v-if="!['ma_hang','loi_nhuan'].includes(key)">
                <label class="form-label fw-bold small">{{ label }}</label>

                <input
                  v-if="isNumericField(key)"
                  type="text"
                  v-model="formattedFields[key]"
                  @input="updateNumericField(key, $event)"
                  class="form-control form-control-sm text-start"
                />

                <input
                  v-else
                  v-model="chiTiet[key]"
                  class="form-control form-control-sm"
                  @input="handleFieldChange(key)"
                />
              </div>
            </div>
          </div>

          <div class="modal-footer d-flex justify-content-between">
            <button class="btn btn-danger" @click="xoaHang(chiTiet.maHangCu)">🗑️ Xóa hàng</button>
            <div>
              <button class="btn btn-secondary me-2" @click="showModal = false">Đóng</button>
              <button class="btn btn-primary" @click="luuChinhSua">💾 Lưu thay đổi</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container-fluid {
  max-width: 1600px;
  margin-inline: auto;
  padding-inline: clamp(1rem, 3vw, 3rem);
  padding-top: 2rem;
}

/* ========== Ô 1: TÌM KIẾM ========== */
.search-section {
  background: #ffffff;
  border: 2px solid #B8CCE4;
  border-radius: 10px;
  overflow: hidden;
}

.search-header {
  background: linear-gradient(135deg, #1a2f63 0%, #13244a 100%);
  padding: 10px 18px;
}

.search-title {
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 900;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0,0,0,0.35);
}

.search-content {
  padding: 15px 18px;
}

.search-content .form-control {
  border: 2px solid #B8CCE4;
  border-radius: 25px;
  padding: 10px 20px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.search-content .form-control:focus {
  border-color: #1a2f63;
  box-shadow: 0 0 0 0.2rem rgba(26, 47, 99, 0.15);
}

/* ========== Ô 2: BỘ LỌC ========== */
.filter-section {
  background: #ffffff;
  border: 2px solid #B8CCE4;
  border-radius: 10px;
  overflow: hidden;
}

.filter-header {
  background: linear-gradient(135deg, #1a2f63 0%, #13244a 100%);
  padding: 10px 18px;
}

.filter-title {
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 900;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0,0,0,0.35);
}

.filter-content {
  padding: 15px 18px;
}

.filter-content .form-label {
  color: #1a2f63;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 4px;
  text-transform: uppercase;
}

.filter-content .form-control-sm,
.filter-content .form-select-sm {
  border: 1px solid #B8CCE4;
  border-radius: 15px;
  padding: 6px 10px;
  font-size: 0.85rem;
}

.filter-content .form-control-sm:focus,
.filter-content .form-select-sm:focus {
  border-color: #1a2f63;
  box-shadow: 0 0 0 0.1rem rgba(26, 47, 99, 0.1);
}

.filter-content .btn-sm {
  font-size: 0.8rem;
  padding: 6px 12px;
  font-weight: 700;
  border-radius: 6px;
}

/* ========== Ô 3: CARD FULL XANH ========== */
.cards-section {
  margin-top: 20px;
}

.product-card {
   background: linear-gradient(180deg, #004e92 0%, #003d75 30%, #002f5a 50%, #00213f 70%, #000428 100%);
  border: 4px solid #000428;
  border-radius: 18px;
  padding: 0;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  height: 100%;
  box-shadow: 
    0 6px 20px rgba(26, 47, 99, 0.25),
    0 2px 8px rgba(26, 47, 99, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 
    0 15px 40px rgba(26, 47, 99, 0.4),
    0 8px 20px rgba(26, 47, 99, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border-color: #0d1a3d;
  opacity: 0.9;
}

.product-card.selected {
   background: linear-gradient(180deg, #004e92 0%, #003d75 30%, #002f5a 50%, #00213f 70%, #000428 100%);
  border: 5px solid #000428;
  box-shadow: 
    0 20px 60px rgba(13, 26, 61, 0.5),
    0 10px 30px rgba(26, 47, 99, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.15);
  transform: translateY(-10px) scale(1.05);
}

.card-checkbox {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  z-index: 20;
  accent-color: #ffffff;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

/* QR FULL XANH - KHÔNG NỀN TRẮNG */
.card-qr {
  text-align: center;
  padding: 20px 15px 10px 15px;
  background: transparent;
  position: relative;
  z-index: 1;
}

.card-qr img {
  width: 100%;
  max-width: 200px;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  background: #ffffff;
  padding: 8px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.card-info {
  position: relative;
  z-index: 1;
  padding: 0 15px 15px 15px;
}

.card-code {
  font-size: 1.05rem;
  font-weight: 900;
  color: #ffffff;
  margin: 8px 0 5px 0;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.5),
    0 1px 2px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.card-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 12px;
  min-height: 38px;
  line-height: 1.3;
  text-align: center;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.card-prices {
  background: rgba(255, 255, 255, 0.95);
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.price-item {
  font-size: 0.85rem;
  margin-bottom: 5px;
  color: #1a2f63;
  font-weight: 700;
  text-align: left;
}

.price-item:last-child {
  margin-bottom: 0;
}

.price-item strong {
  font-weight: 900;
  float: right;
}

.text-success {
  color: #28a745 !important;
}

.text-primary {
  color: #0d1a3d !important;
}

.card-time {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 10px;
  padding-top: 10px;
  border-top: 2px solid rgba(255, 255, 255, 0.3);
  font-weight: 600;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}

/* Phân trang */
.pagination-area {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 30px;
  padding: 15px;
  background: linear-gradient(135deg, #E8EEF7 0%, #f0f4ff 100%);
  border-radius: 8px;
  border: 2px solid rgba(26, 47, 99, 0.1);
}

.btn-paging {
  background: linear-gradient(135deg, #1a2f63 0%, #2d4a7c 100%);
  color: white;
  border: none;
  padding: 9px 22px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(26, 47, 99, 0.2);
}

.btn-paging:hover:not(:disabled) {
  background: linear-gradient(135deg, #13244a 0%, #1a2f63 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(26, 47, 99, 0.35);
}

.btn-paging:disabled {
  background: linear-gradient(135deg, #b0b8c7 0%, #c8d0dd 100%);
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
}

.page-info {
  font-weight: 800;
  color: #1a2f63;
  font-size: 1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Modal */
.modal {
  backdrop-filter: blur(5px);
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(26, 47, 99, 0.5);
  z-index: 1040;
}

.modal-dialog {
  z-index: 1050;
}

.modal-header {
  background: linear-gradient(135deg, #1a2f63 0%, #13244a 100%);
  color: white;
  border-bottom: 3px solid rgba(255, 255, 255, 0.2);
}

.modal-title {
  font-weight: 900;
  font-size: 1.1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.btn-close {
  filter: invert(1);
}

.modal-content {
  border: 3px solid #1a2f63;
  border-radius: 12px;
  overflow: hidden;
}
.btn-warning.btn-sm {
  font-weight: 800;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #ffb300, #ff8f00);
  border: none;
  color: #422000;
  box-shadow: 0 3px 8px rgba(255, 160, 0, 0.35);
  transition: all 0.25s ease;
}

.btn-warning.btn-sm:hover {
  background: linear-gradient(135deg, #ffa000, #ff6f00);
  box-shadow: 0 6px 15px rgba(255, 140, 0, 0.45);
  transform: translateY(-2px);
}

</style>

<script>
import { Teleport } from 'vue';

export default {
  name: "Kho",
  data() {
    return {
      hangHoa: [],
      search: "",
      filterNCC: "",
      filterDanhMuc: "",
      filterHinhThuc: "",
      filterFromDate: "",
      filterToDate: "",
      sortOrder: "desc", // ✅ thêm dòng này
      selected: [],
      showModal: false,
      chiTiet: {},
      formattedFields: {},
        daTaoQR: false, // ✅ thêm dòng này
      page: 1,
      perPage: 16,
      fieldLabels: {
        ten_hang: "Tên hàng",
        danh_muc: "Danh mục",
        ma_nha_cung_cap: "Mã NCC",
        size: "Kích thước",
        dvt: "Đơn vị tính",
        so_luong_lo: "Số lượng lô",
        so_cai_1_lo: "Số cái / 1 lô",
        gia_1_lo: "Giá nhập 1 lô",
        gia_goc: "Giá gốc (1 cái)",
        don_gia: "Giá bán",
        so_luong_kho: "Số lượng tồn kho",
        thoi_gian_tao_duong_lich: "Thời gian tạo (dương lịch)",
        ghi_chu: "Ghi chú",
      },
    };
  },

  computed: {
    isFiltered() {
  return (
    this.search.trim() ||
    this.filterNCC ||
    this.filterDanhMuc ||
    this.filterHinhThuc ||
    this.filterFromDate ||
    this.filterToDate ||
    this.sortOrder !== "desc"
  );
},

    filteredHangHoa() {
      let list = [...this.hangHoa];
      const s = this.search.trim().toLowerCase();
      if (s)
        list = list.filter(
          (r) =>
            r.ma_hang?.toLowerCase().includes(s) ||
            r.ten_hang?.toLowerCase().includes(s)
        );
      if (this.filterDanhMuc)
        list = list.filter((r) => r.danh_muc === this.filterDanhMuc);
      if (this.filterNCC)
        list = list.filter((r) => r.ma_nha_cung_cap === this.filterNCC);
      if (this.filterHinhThuc === "lo")
        list = list.filter((r) => Number(r.gia_1_lo) > 0);
      if (this.filterHinhThuc === "le")
        list = list.filter(
          (r) => !r.gia_1_lo || Number(r.gia_1_lo) === 0
        );
        if (this.sortOrder === "asc")
  list.sort((a, b) =>
    new Date(a.thoi_gian_tao_duong_lich) - new Date(b.thoi_gian_tao_duong_lich)
  );
else if (this.sortOrder === "desc")
  list.sort((a, b) =>
    new Date(b.thoi_gian_tao_duong_lich) - new Date(a.thoi_gian_tao_duong_lich)
  );
// 🔍 Bộ lọc theo thời gian (định dạng có giờ phút giây)
if (this.filterFromDate || this.filterToDate) {
  list = list.filter((r) => {
    if (!r.thoi_gian_tao_duong_lich) return false;

    // Chuyển "22:01:46 09/11/2025" → "2025-11-09T22:01:46"
    const parts = r.thoi_gian_tao_duong_lich.match(
      /(\d{2}):(\d{2}):(\d{2})\s+(\d{2})\/(\d{2})\/(\d{4})/
    );
    if (!parts) return false;
    const [_, hh, mm, ss, dd, MM, yyyy] = parts;
    const timeStr = `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}`;
    const dateVal = new Date(timeStr);

    const from = this.filterFromDate ? new Date(this.filterFromDate) : null;
    const to = this.filterToDate ? new Date(this.filterToDate + "T23:59:59") : null;

    return (!from || dateVal >= from) && (!to || dateVal <= to);
  });
}

      return list;
    },
    paginatedHangHoa() {
      const start = (this.page - 1) * this.perPage;
      return this.filteredHangHoa.slice(start, start + this.perPage);
    },
    totalPages() {
      return Math.ceil(this.filteredHangHoa.length / this.perPage);
    },
    uniqueNCC() {
      return [...new Set(this.hangHoa.map((r) => r.ma_nha_cung_cap).filter(Boolean))];
    },
    uniqueDanhMuc() {
      return [...new Set(this.hangHoa.map((r) => r.danh_muc).filter(Boolean))];
    },
  },

  methods: {
   async fetchData(isRefresh = false) {
  try {
    const res = await fetch(
      "https://script.google.com/macros/s/AKfycbz_vsTrvAjmYq51LTtQhe-nkdOzbMQcpMGslSU8tuSObycF9l5HT7cqYKhJ11uqrpL8/exec?action=getHangHoa"
    );
    this.hangHoa = await res.json();

    if (isRefresh) {
      // ✅ Reset toàn bộ bộ lọc
      this.search = "";
      this.filterNCC = "";
      this.filterDanhMuc = "";
      this.filterHinhThuc = "";
      this.filterFromDate = "";
      this.filterToDate = "";
      this.sortOrder = "desc";
      this.page = 1;
      this.selected = [];
      this.daTaoQR = false;
      alert("✅ Đã làm mới dữ liệu!");
    }
  } catch (err) {
    alert("❌ Lỗi khi tải dữ liệu: " + err);
  }
},
clearFilters() {
  this.search = "";
  this.filterNCC = "";
  this.filterDanhMuc = "";
  this.filterHinhThuc = "";
  this.filterFromDate = "";
  this.filterToDate = "";
  this.sortOrder = "desc";
  this.page = 1;
  this.selected = [];
  alert("🧹 Đã xóa toàn bộ bộ lọc!");
},


    moChiTiet(hang) {
      this.chiTiet = { ...hang, maHangCu: hang.ma_hang, ma_hang_moi: hang.ma_hang };
       this.daTaoQR = false; // ✅ reset lại mỗi khi mở modal
      this.formattedFields = {};
      Object.keys(this.chiTiet).forEach((k) => {
        if (this.isNumericField(k))
          this.formattedFields[k] = this.formatNumber(this.chiTiet[k]);
      });
      this.showModal = true;
    },

    isNumericField(key) {
      return ["gia_goc", "don_gia", "gia_1_lo", "so_luong_kho", "so_cai_1_lo", "so_luong_lo"].includes(key);
    },

    formatNumber(val) {
      return (Number(val) || 0).toLocaleString("vi-VN");
    },

    updateNumericField(key, e) {
      const raw = e.target.value.replace(/[^\d]/g, "");
      this.chiTiet[key] = Number(raw);
      this.formattedFields[key] = this.formatNumber(raw);

      const gia1Lo = Number(this.chiTiet.gia_1_lo) || 0;
      const soCai1Lo = Number(this.chiTiet.so_cai_1_lo) || 0;
      const soLuongLo = Number(this.chiTiet.so_luong_lo) || 0;

      if (gia1Lo > 0 && soCai1Lo > 0) {
        this.chiTiet.gia_goc = Math.round(gia1Lo / soCai1Lo);
        this.formattedFields.gia_goc = this.formatNumber(this.chiTiet.gia_goc);
      }

      if (soCai1Lo > 0 && soLuongLo > 0) {
        this.chiTiet.so_luong_kho = soCai1Lo * soLuongLo;
        this.formattedFields.so_luong_kho = this.formatNumber(this.chiTiet.so_luong_kho);
      }

      this.capNhatMaHang();
    },

    handleFieldChange() {
      this.capNhatMaHang();
    },
taoMaQR() {
  this.capNhatMaHang();
  if (this.chiTiet.qr_img) {
    this.daTaoQR = true; // ✅ ẩn nút sau khi tạo xong
    alert("✅ Đã tạo mã QR thành công!");
  } else {
    alert("⚠️ Không thể tạo mã QR — vui lòng kiểm tra thông tin hàng.");
  }
},


    lamTronLenNghin(v) {
      return Math.ceil(v / 1000) * 1000;
    },

    removeAccents(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    },

    async capNhatMaHang() {
      const tenNCC = (this.chiTiet.ma_nha_cung_cap || "").trim();
      const tenHang = (this.chiTiet.ten_hang || "").trim();
      if (!tenNCC || !tenHang) return;

      const nhapTheoLo = !!Number(this.chiTiet.gia_1_lo);
      const giaLo = Number(this.chiTiet.gia_1_lo) || 0;
      const soCaiMotLo = Number(this.chiTiet.so_cai_1_lo) || 0;
      const giaNhap = Number(this.chiTiet.gia_goc) || 0;
      const donGia = Number(this.chiTiet.don_gia) || 0;

      const phan1 = this.removeAccents(tenNCC).split(" ").filter(w => w).map(w => w[0].toUpperCase()).join("");
      const phan2 = new Date().getFullYear().toString().slice(-2);
      const bo000 = Math.floor((nhapTheoLo ? giaLo : giaNhap) / 1000);
      const phan3 = bo000 * 2;
      const phan4 = nhapTheoLo ? String(soCaiMotLo).padStart(2, "0") : "";

      let giaNhap1Cai = nhapTheoLo ? giaLo / (soCaiMotLo || 1) : giaNhap;
      let giaBan = donGia || giaNhap1Cai;
      giaBan = this.lamTronLenNghin(giaBan);
      const base = Math.floor(giaBan / 1000);
      const len = base.toString().length;
      const cong = len === 1 ? 1 : len === 2 ? 10 : len === 3 ? 100 : 1000;
      const giaMa = base + cong;
      let soGia = 0;
      if (giaMa < 10) soGia = (giaMa % 10) + 1;
      else if (giaMa < 100) soGia = Math.floor(giaMa / 10) + 1;
      else if (giaMa < 1000) soGia = Math.floor(giaMa / 100) + 1;
      else soGia = Math.floor(giaMa / 1000) + 1;
      soGia = soGia % 10;
      const phan5 = `${soGia}${giaMa}`;

      const tenVietTat = this.removeAccents(tenHang)
        .split(/\s+/)
        .filter((w) => w)
        .map((w) => {
          const so = w.match(/\d+/g);
          return so ? so.join("") : w[0].toUpperCase();
        })
        .join("");

      const maMoi = `${phan1}${phan2}${phan3}${phan4} ${phan5}(${tenVietTat})`;
      this.chiTiet.ma_hang_moi = maMoi;

      const gia1LoText = nhapTheoLo ? `${this.formatMoney(giaLo)} (nhập/lô)` : "";
      const gia1CaiText = `${this.formatMoney(giaNhap)} (nhập/cái)`;
      const giaBanText = `${this.formatMoney(giaBan)} (bán/cái)`;

      const qrData = `${maMoi} | ${tenHang} | ${gia1LoText ? gia1LoText + " | " : ""}${gia1CaiText} | ${giaBanText}`;
      this.chiTiet.qr_img = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=200x200`;
    },

    async luuChinhSua() {
      try {
        const payload = { ...this.chiTiet, ma_hang: this.chiTiet.ma_hang_moi || this.chiTiet.maHangCu };
        const res = await fetch("https://script.google.com/macros/s/AKfycbz_vsTrvAjmYq51LTtQhe-nkdOzbMQcpMGslSU8tuSObycF9l5HT7cqYKhJ11uqrpL8/exec?action=updateHangHoa", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        alert(data.message || "✅ Đã lưu thay đổi!");
        this.showModal = false;
        this.fetchData();
      } catch (err) {
        alert("❌ Lỗi khi lưu: " + err);
      }
    },

    async xoaHang(ma) {
      if (!confirm("Bạn có chắc muốn xóa hàng này không?")) return;
      const res = await fetch("https://script.google.com/macros/s/AKfycbz_vsTrvAjmYq51LTtQhe-nkdOzbMQcpMGslSU8tuSObycF9l5HT7cqYKhJ11uqrpL8/exec?action=deleteHangHoa", {
        method: "POST",
        body: JSON.stringify({ ma_hang: ma }),
      });
      const data = await res.json();
      alert(data.message || "🗑️ Đã xóa hàng thành công!");
      this.showModal = false;
      this.fetchData();
    },

    inMaQR() {
      const qrData = this.hangHoa.filter((h) => this.selected.includes(h.ma_hang));
      if (qrData.length === 0) return;
      const win = window.open("", "_blank");
      const doc = win.document;
      doc.write(`
        <html><head><title>In QR</title>
        <style>@page{size:A4;margin:10mm;}body{text-align:center;}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}</style>
        </head><body><div id="qrGrid" class="grid"></div></body></html>`);
      const grid = doc.getElementById("qrGrid");
      qrData.forEach((h) => {
        const div = doc.createElement("div");
        div.className = "item";
        div.innerHTML = `<h3>${h.ma_hang}</h3><p>${h.ten_hang}</p><img src="${h.qr_img}"/>`;
        grid.appendChild(div);
      });
      doc.close();
      win.onload = () => win.print();
    },

    formatMoney(v) {
      return Number(v || 0).toLocaleString("vi-VN") + " ₫";
    },
  },

  mounted() {
    this.fetchData();
  },
};
</script>

