<template>
  <div class="container-fluid py-4">
    <h2 class="text-center mb-4 fw-bold" style="color: #1a2f63;">📘 SỔ THU - CHI</h2>

    <!-- Layout 4 ô trên: 1, 2, 3, 4 -->
    <div class="row g-3 mb-4">
      
      <!-- ========== Ô 1: THÔNG TIN HÓA ĐƠN ========== -->
      <div class="col-lg-3">
        <div class="info-box shadow-sm">
          <h5 class="box-title">🧾 THÔNG TIN HÓA ĐƠN</h5>
          
          <div class="box-content">
            <!-- Mã HĐ | Số HĐ -->
            <div class="row g-2 mb-2">
              <div class="col-6">
                <label class="form-label">Mã HĐ</label>
                <input style="font-weight: bold;color:#1a2f63" v-model="form.ma_hoa_don" class="form-control form-control-sm" placeholder="Tự động" />
              </div>
              <div class="col-6">
                <label class="form-label">Số HĐ</label>
                <input style="font-weight: bold;color:#1a2f63" v-model="form.so_hoa_don" class="form-control form-control-sm" readonly />
              </div>
            </div>

            <!-- Mã KH | Tên KH -->
            <div class="row g-2 mb-2">
              <div class="col-6">
                <label class="form-label">Mã KH</label>
                <select v-model="form.ma_khach_hang" class="form-select form-select-sm">
                  <option value="">-- Chọn --</option>
                  <option v-for="k in khachHang" :key="k.ma_khach_hang" :value="k.ma_khach_hang">
                    {{ k.ma_khach_hang }}
                  </option>
                </select>
              </div>
              <div class="col-6">
                <label class="form-label">Tên KH</label>
                <input v-model="tenKH" class="form-control form-control-sm" readonly />
              </div>
            </div>

            <!-- Mã NCC | Tên NCC -->
            <div class="row g-2 mb-2">
              <div class="col-6">
                <label class="form-label">Mã NCC</label>
                <select v-model="form.ma_nha_cung_cap" class="form-select form-select-sm">
                  <option value="">-- Chọn --</option>
                  <option v-for="n in nhaCungCap" :key="n.ma_nha_cung_cap" :value="n.ma_nha_cung_cap">
                    {{ n.ma_nha_cung_cap }}
                  </option>
                </select>
              </div>
              <div class="col-6">
                <label class="form-label">Tên NCC</label>
                <input v-model="tenNCC" class="form-control form-control-sm" readonly />
              </div>
            </div>

            <!-- Mã DV | Tên DV -->
            <div class="row g-2 mb-2">
              <div class="col-6">
                <label class="form-label">Mã DV</label>
                <input v-model="form.ma_dich_vu" class="form-control form-control-sm" readonly />
              </div>
              <div class="col-6">
                <label class="form-label">Tên DV</label>
                <input v-model="form.ten_dich_vu" class="form-control form-control-sm" placeholder="VD: Quảng cáo" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== Ô 2: GIAO DỊCH ========== -->
      <div class="col-lg-3">
        <div class="transaction-box shadow-sm">
          <h5 class="box-title">💰 GIAO DỊCH</h5>
          
          <div class="box-content">
            <!-- Nội dung -->
            <div class="mb-2">
              <label class="form-label">Nội dung</label>
              <textarea v-model="form.noi_dung" class="form-control form-control-sm" rows="3" placeholder="VD: Thu nợ khách..."></textarea>
            </div>

            <!-- Số tiền | Hình thức TT -->
            <div class="row g-2 mb-2">
              <div class="col-6">
                <label class="form-label">Số tiền</label>
                <input
  v-model="form.so_tien"
  @input="form.so_tien = form.so_tien.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
  type="text"
  class="form-control form-control-sm"
/>

              </div>
              <div class="col-6">
                <label class="form-label">Hình thức</label>
                <select v-model="form.hinh_thuc_thanh_toan" class="form-select form-select-sm">
                  <option value="Tiền mặt">Tiền mặt</option>
                  <option value="Chuyển khoản">Chuyển khoản</option>
                  <option value="Nợ">Nợ</option>
                </select>
              </div>
            </div>

            <!-- Nút Chi tiền | Nhận tiền -->
            <div class="row g-2">
              <div class="col-6">
                <button class="btn btn-danger btn-sm w-100" @click="submit('Chi')">
                  💸 Chi tiền
                </button>
              </div>
              <div class="col-6">
                <button class="btn btn-success btn-sm w-100" @click="submit('Thu')">
                  💰 Nhận tiền
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== Ô 3: TÌM KIẾM ========== -->
      <div class="col-lg-3">
        <div class="search-box shadow-sm">
          <h5 class="box-title">🔍 TÌM KIẾM</h5>
          
          <div class="box-content">
            <!-- Mã KH | Tên KH -->
            <div class="row g-2 mb-2">
              <div class="col-6">
                <label class="form-label">Mã KH</label>
                <input v-model.trim="filters.maKH" class="form-control form-control-sm" placeholder="VD: KH001" />
              </div>
              <div class="col-6">
                <label class="form-label">Tên KH</label>
                <input v-model.trim="filters.tenKH" class="form-control form-control-sm" placeholder="Tên khách" />
              </div>
            </div>

            <!-- Mã NCC | Tên NCC -->
            <div class="row g-2 mb-2">
              <div class="col-6">
                <label class="form-label">Mã NCC</label>
                <input v-model.trim="filters.maNCC" class="form-control form-control-sm" placeholder="VD: NCC01" />
              </div>
              <div class="col-6">
                <label class="form-label">Tên NCC</label>
                <input v-model.trim="filters.tenNCC" class="form-control form-control-sm" placeholder="Tên NCC" />
              </div>
            </div>

            <!-- Mã DV | Tên DV -->
            <div class="row g-2 mb-2">
              <div class="col-6">
                <label class="form-label">Mã DV</label>
                <input v-model.trim="filters.maDV" class="form-control form-control-sm" placeholder="VD: DV01" />
              </div>
              <div class="col-6">
                <label class="form-label">Tên DV</label>
                <input v-model.trim="filters.tenDV" class="form-control form-control-sm" placeholder="Tên DV" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== Ô 4: BỘ LỌC ========== -->
      <div class="col-lg-3">
        <div class="filter-box shadow-sm">
          <h5 class="box-title">🔧 BỘ LỌC</h5>
          
          <div class="box-content">
            <!-- Từ ngày | Đến ngày -->
            <div class="row g-2 mb-2">
              <div class="col-6">
                <label class="form-label">Từ ngày</label>
                <input v-model="filters.fromDate" type="date" class="form-control form-control-sm" />
              </div>
              <div class="col-6">
                <label class="form-label">Đến ngày</label>
                <input v-model="filters.toDate" type="date" class="form-control form-control-sm" />
              </div>
            </div>

            <!-- Sắp xếp -->
            <div class="mb-2">
              <label class="form-label">Sắp xếp</label>
              <select v-model="filters.sortOrder" class="form-select form-select-sm">
                <option value="desc">Mới nhất → Cũ nhất</option>
                <option value="asc">Cũ nhất → Mới nhất</option>
              </select>
            </div>

            <!-- Hình thức | Trạng thái -->
            <div class="row g-2 mb-2">
              <div class="col-6">
                <label class="form-label">Hình thức</label>
                <select v-model="filters.hinhThuc" class="form-select form-select-sm">
                  <option value="">-- Tất cả --</option>
                  <option value="Tiền mặt">Tiền mặt</option>
                  <option value="Chuyển khoản">CK</option>
                  <option value="Nợ">Nợ</option>
                </select>
              </div>
              <div class="col-6">
                <label class="form-label">Trạng thái</label>
                <select v-model="filters.trangThai" class="form-select form-select-sm">
                  <option value="">-- Tất cả --</option>
                  <option value="Thu tiền">Thu tiền</option>
                  <option value="Chi tiền">Chi tiền</option>
                  <option value="Bán thu tiền">Bán thu tiền</option>
                  <option value="Bán ghi nợ">Bán ghi nợ</option>
                  <option value="Trả hàng">Trả hàng</option>
                  <option value="Nhập hàng (đã trả tiền)">Nhập (đã trả)</option>
                  <option value="Nhập hàng (ghi nợ)">Nhập (nợ)</option>
                </select>
              </div>
            </div>

            <!-- Nút làm mới -->
            <button class="btn btn-refresh btn-sm w-100" @click="resetFilters">
              🔄 LÀM MỚI
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== Ô 5: BẢNG (DƯỚI) ========== -->
    <div class="table-container shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-header">
            <tr>
              <th>#</th>
              <th>MÃ HĐ</th>
              <th>SỐ HĐ</th>
              <th>THỜI GIAN</th>
              <th>MÃ KH</th>
              <th>TÊN KH</th>
              <th>MÃ NCC</th>
              <th>TÊN NCC</th>
              <th>MÃ DV</th>
              <th>TÊN DV</th>
              <th>TRẠNG THÁI</th>
              <th>SỐ TIỀN</th>
              <th>NỘI DUNG</th>
              <th>HTTT</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in paginated" :key="i" class="table-row">
              <td class="text-center">{{ (currentPage - 1) * perPage + i + 1 }}</td>
              <td class="text-center">{{ r.ma_hoa_don }}</td>
              <td class="text-center">{{ r.so_hoa_don }}</td>
              <td class="text-center">{{ formatDate(r.ngay_tao) }}</td>
              <td class="text-center">{{ r.ma_khach_hang }}</td>
              <td>{{ r.ten_khach_hang }}</td>
              <td class="text-center">{{ r.ma_nha_cung_cap }}</td>
              <td>{{ r.ten_nha_cung_cap }}</td>
              <td class="text-center">{{ r.ma_dich_vu }}</td>
              <td>{{ r.ten_dich_vu }}</td>
              <td class="text-center">
                <span :class="r.trang_thai.includes('Chi') ? 'status-chi' : 'status-thu'">
                  {{ r.trang_thai }}
                </span>
              </td>
              <td class="text-end">
                <strong :class="r.so_tien < 0 ? 'money-negative' : 'money-positive'">
                  {{ formatMoney(r.so_tien) }}
                </strong>
              </td>
              <td>{{ r.noi_dung }}</td>
              <td class="text-center">
                <span 
                  class="badge-payment"
                  :class="{
                    'badge-cash': r.hinh_thuc_thanh_toan === 'Tiền mặt',
                    'badge-transfer': r.hinh_thuc_thanh_toan === 'Chuyển khoản',
                    'badge-debt': r.hinh_thuc_thanh_toan === 'Nợ',
                  }"
                >
                  {{ r.hinh_thuc_thanh_toan }}
                </span>
              </td>
            </tr>
            <tr v-if="paginated.length === 0">
              <td colspan="14" class="text-center text-muted py-4">
                Không có dữ liệu
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Phân trang -->
      <div class="pagination-area py-3">
        <button
          class="btn btn-paging"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          ← Trước
        </button>
        <span class="page-info">Trang {{ currentPage }} / {{ totalPages }}</span>
        <button
          class="btn btn-paging"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Sau →
        </button>
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

/* ========== Các Box 1, 2, 3, 4 ========== */
.info-box,
.transaction-box,
.search-box,
.filter-box {
  background: #ffffff;
  border: 2px solid #B8CCE4;
  border-radius: 10px;
  overflow: hidden;
  height: 100%;
}

.box-title {
  background: linear-gradient(135deg, #1a2f63 0%, #13244a 100%);
  color: #ffffff !important;
  padding: 10px 15px;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 900;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  border-bottom: 3px solid rgba(255, 255, 255, 0.25);
  text-shadow: 0 1px 2px rgba(0,0,0,0.35);
}

.box-content {
  padding: 12px 15px;
}

.form-label {
  color: #1a2f63;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 3px;
  text-transform: uppercase;
}

.form-control-sm,
.form-select-sm {
  border: 1px solid #B8CCE4;
  border-radius: 15px;
  padding: 5px 8px;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.form-control-sm:focus,
.form-select-sm:focus {
  border-color: #1a2f63;
  box-shadow: 0 0 0 0.15rem rgba(26, 47, 99, 0.15);
  outline: none;
}

textarea.form-control-sm {
  resize: none;
}

/* Nút Chi tiền / Nhận tiền */
.btn-danger,
.btn-success {
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.8rem;
  padding: 8px;
  border-radius: 6px;
}

/* Nút làm mới */
.btn-refresh {
  background: #1a2f63;
  color: white;
  font-weight: 700;
  border: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  text-transform: uppercase;
}

.btn-refresh:hover {
  background: #13244a;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(26, 47, 99, 0.3);
}

/* ========== Bảng ========== */
.table-container {
  background: white;
  border: 2px solid #B8CCE4;
  border-radius: 8px;
  overflow: hidden;
}

.table {
  margin-bottom: 0;
}

.table-container table thead {
  background: linear-gradient(135deg, #1a2f63 0%, #13244a 100%) !important;
  position: relative;
}

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

.table-container table thead th {
  background: transparent !important;
  padding: 14px 10px;
  border: none;
  color: #fff !important;
  font-size: 0.85rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  vertical-align: middle;
  text-shadow: 0 1px 3px rgba(0,0,0,0.35);
  text-align: center;
}

.table-row {
  border-left: 4px solid transparent;
  transition: all 0.2s ease;
  background: #ffffff;
}

.table-row:hover {
  background-color: #E8EEF7;
  border-left: 4px solid #1a2f63;
}

.table-row td {
  padding: 12px 10px;
  font-size: 0.85rem;
  vertical-align: middle;
  border-color: #e9ecef;
  border-bottom: 1px solid #e9ecef;
  font-weight: bold;
 
}

/* Số tiền */
.money-positive {
  font-size: 1rem;
  font-weight: 900;
  color: #28a745 !important;
}

.money-negative {
  font-size: 1rem;
  font-weight: 900;
  color: #dc3545 !important;
}

/* Trạng thái */
.status-thu {
  color: #28a745;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 4px;
  background: #d4edda;
  display: inline-block;
  font-size: 0.8rem;
}

.status-chi {
  color: #dc3545;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 4px;
  background: #f8d7da;
  display: inline-block;
  font-size: 0.8rem;
}

/* Badge thanh toán */
.badge-payment {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.75rem;
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
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
}

/* Phân trang */
.pagination-area {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  background: #E8EEF7;
  border-top: 2px solid #B8CCE4;
}

.btn-paging {
  background: #1a2f63;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.btn-paging:hover:not(:disabled) {
  background: #13244a;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(26, 47, 99, 0.3);
}

.btn-paging:disabled {
  background: #b0b8c7;
  cursor: not-allowed;
  opacity: 0.6;
}

.page-info {
  font-weight: 700;
  color: #1a2f63;
  font-size: 0.95rem;
}

/* Responsive */
@media (max-width: 991px) {
  .info-box,
  .transaction-box,
  .search-box,
  .filter-box {
    margin-bottom: 15px;
  }
}
</style>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import axios from "axios";

const API =
  "https://script.google.com/macros/s/AKfycbz_vsTrvAjmYq51LTtQhe-nkdOzbMQcpMGslSU8tuSObycF9l5HT7cqYKhJ11uqrpL8/exec";

const form = ref({
  ma_hoa_don: "",
  so_hoa_don: "",
  ma_khach_hang: "",
  ten_khach_hang: "",
  ma_nha_cung_cap: "",
  ten_nha_cung_cap: "",
  ma_dich_vu: "",
  ten_dich_vu: "",
  so_tien: "",
  noi_dung: "",
  hinh_thuc_thanh_toan: "Tiền mặt",
});

const khachHang = ref([]);
const nhaCungCap = ref([]);
const records = ref([]);

// 📑 Phân trang
const currentPage = ref(1);
const perPage = 15;

// 🎯 Bộ lọc
const filters = ref({
  fromDate: "",
  toDate: "",
  hinhThuc: "",
  trangThai: "",
  maKH: "",
  tenKH: "",
  maNCC: "",
  tenNCC: "",
  maDV: "",
  tenDV: "",
  sortOrder: "desc",
});

// 🧠 Tạo mã dịch vụ từ tên dịch vụ
watch(
  () => form.value.ten_dich_vu,
  (val) => {
    if (!val) return (form.value.ma_dich_vu = "");
    const letters = val
      .split(" ")
      .filter((w) => w.trim() !== "")
      .map((w) => w[0].toUpperCase())
      .join("");
    form.value.ma_dich_vu = letters;
    autoGenSoHoaDon();
  }
);
const filteredRecords = computed(() => {
  let data = [...records.value];

  // 🕓 Chuẩn hóa về Date từ định dạng "HH:mm:ss dd/MM/yyyy"
  const parseVNDateTime = (v) => {
    if (!v) return null;

    // Nếu là dạng ISO (2025-10-30T08:33:29Z)
    if (v.includes("T")) {
      const d = new Date(v);
      if (!isNaN(d)) return new Date(d.getTime() + 7 * 60 * 60 * 1000);
    }

    // Nếu là định dạng mới "HH:mm:ss dd/MM/yyyy"
    const parts = v.split(" ");
    if (parts.length === 2) {
      const [time, date] = parts;
      const [hh, mm, ss] = time.split(":").map(Number);
      const [dd, MM, yyyy] = date.split("/").map(Number);
      return new Date(yyyy, MM - 1, dd, hh, mm, ss);
    }

    return null;
  };

  const {
    fromDate, toDate, hinhThuc, trangThai,
    maKH, tenKH, maNCC, tenNCC, maDV, tenDV, sortOrder
  } = filters.value;

  // 📅 Lọc theo ngày
  if (fromDate || toDate) {
    const from = fromDate ? new Date(fromDate + "T00:00:00") : null;
    const to = toDate ? new Date(toDate + "T23:59:59") : null;

    data = data.filter((r) => {
      const d = parseVNDateTime(r.ngay_tao);
      return d && (!from || d >= from) && (!to || d <= to);
    });
  }

  // 💳 Hình thức thanh toán
  if (hinhThuc)
    data = data.filter((r) =>
      (r.hinh_thuc_thanh_toan || "").toLowerCase().includes(hinhThuc.toLowerCase())
    );

  // 📘 Trạng thái
  if (trangThai)
    data = data.filter((r) =>
      (r.trang_thai || "").toLowerCase() === trangThai.toLowerCase()
    );

  // Các bộ lọc text
  if (maKH) data = data.filter((r) => (r.ma_khach_hang || "").includes(maKH));
  if (tenKH) data = data.filter((r) => (r.ten_khach_hang || "").includes(tenKH));
  if (maNCC) data = data.filter((r) => (r.ma_nha_cung_cap || "").includes(maNCC));
  if (tenNCC) data = data.filter((r) => (r.ten_nha_cung_cap || "").includes(tenNCC));
  if (maDV) data = data.filter((r) => (r.ma_dich_vu || "").includes(maDV));
  if (tenDV) data = data.filter((r) => (r.ten_dich_vu || "").includes(tenDV));

  // 🕓 Sắp xếp theo thời gian thực
  data.sort((a, b) => {
    const da = parseVNDateTime(a.ngay_tao);
    const db = parseVNDateTime(b.ngay_tao);
    return sortOrder === "asc" ? da - db : db - da;
  });

  return data;
});

// 🔢 Phân trang theo dữ liệu đã lọc
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredRecords.value.length / perPage))
);
const paginated = computed(() =>
  filteredRecords.value.slice((currentPage.value - 1) * perPage, currentPage.value * perPage)
);

// ♻️ Reset bộ lọc
function resetFilters() {
  filters.value = {
    fromDate: "",
    toDate: "",
    hinhThuc: "",
    trangThai: "",
    maKH: "",
    tenKH: "",
    maNCC: "",
    tenNCC: "",
    maDV: "",
    tenDV: "",
    sortOrder: "desc",
  };
}

// Auto điền tên KH/NCC và sinh số hóa đơn
const tenKH = ref("");
watch(
  () => form.value.ma_khach_hang,
  (val) => {
    const f = khachHang.value.find((k) => k.ma_khach_hang === val);
    tenKH.value = f ? f.ten_khach_hang : "";
    form.value.ten_khach_hang = tenKH.value;
    autoGenSoHoaDon();
  }
);

const tenNCC = ref("");
watch(
  () => form.value.ma_nha_cung_cap,
  (val) => {
    const f = nhaCungCap.value.find((n) => n.ma_nha_cung_cap === val);
    tenNCC.value = f ? f.ten_nha_cung_cap : "";
    form.value.ten_nha_cung_cap = tenNCC.value;
    autoGenSoHoaDon();
  }
);

// 🔢 Sinh số hóa đơn FE-only
function autoGenSoHoaDon() {
  const prefix =
    form.value.ma_khach_hang ||
    form.value.ma_nha_cung_cap ||
    form.value.ma_dich_vu;
  if (!prefix) return (form.value.so_hoa_don = "");

  const same = records.value
    .map((r) => r.so_hoa_don)
    .filter((s) => s && s.startsWith(prefix + "-"));

  let maxNum = 0;
  same.forEach((s) => {
    const num = parseInt(s.split("-")[1]);
    if (!isNaN(num) && num > maxNum) maxNum = num;
  });

  const next = String(maxNum + 1).padStart(3, "0");
  form.value.so_hoa_don = `${prefix}-${next}`;
}

// 🧾 Load dữ liệu
async function loadData() {
  const [kh, ncc, tc] = await Promise.all([
    axios.get(`${API}?action=getKhachHang`),
    axios.get(`${API}?action=getNhaCungCap`),
    axios.get(`${API}?action=getSoThuChi`),
  ]);
  khachHang.value = kh.data || [];
  nhaCungCap.value = ncc.data || [];
  records.value = tc.data || [];
}

// 💾 Ghi sổ
async function submit(type) {
  if (!form.value.so_tien || form.value.so_tien <= 0)
    return alert("Nhập số tiền hợp lệ!");

if (!form.value.ma_hoa_don) {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  form.value.ma_hoa_don =
    "HD" +
    now.getFullYear() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds());
}


  const tien = type === "Chi" ? -Math.abs(form.value.so_tien) : Math.abs(form.value.so_tien);
  const payload = {
    ...form.value,
   so_tien: Number(form.value.so_tien.replace(/,/g, '')),

    trang_thai: type === "Thu" ? "Thu tiền" : "Chi tiền",
  };

  await fetch(API, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "ghiSoThuChi", data: payload }),
  });

  alert(`✅ ${type === "Thu" ? "Đã ghi nhận thu tiền" : "Đã ghi nhận chi tiền"}`);

  await new Promise((r) => setTimeout(r, 1000));
  await loadData();
  autoGenSoHoaDon();
}

// Helper
function formatMoney(v) {
  return Number(v || 0).toLocaleString("vi-VN") + " ₫";
}
function formatDate(v) {
  if (!v) return "";
  const d = new Date(v);
  if (isNaN(d)) return v;
  const local = new Date(d.getTime() + 7 * 60 * 60 * 1000);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(local.getHours())}:${pad(local.getMinutes())}:${pad(local.getSeconds())} ${pad(local.getDate())}/${pad(local.getMonth() + 1)}/${local.getFullYear()}`;
}



function genMaHoaDon() {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  form.value.ma_hoa_don =
    "HD" +
    now.getFullYear() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds());
}

onMounted(() => {
  loadData();
  genMaHoaDon(); // ✅ sinh mã ngay khi mở form
});
</script>

