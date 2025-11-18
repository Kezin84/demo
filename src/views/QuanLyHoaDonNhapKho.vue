<template>
  <div class="container-fluid py-4">
    <h2 class="text-center mb-4 fw-bold" style="color: #4A90E2;">📦 QUẢN LÝ HÓA ĐƠN NHẬP KHO</h2>

    <!-- Layout 2 cột: Ô 1 (trái) + Ô 2 (phải) -->
    <div class="row g-3 mb-4">
      
      <!-- ========== Ô 1: BỘ LỌC (TRÁI) ========== -->
      <div class="col-lg-6">
        <div class="filter-box shadow-sm">
          <h5 class="box-title">🔧 BỘ LỌC</h5>
          
          <div class="box-content">
            <!-- Sắp xếp -->
            <div class="mb-2">
              <label class="form-label fw-bold">SẮP XẾP</label>
              <select v-model="filters.sortOrder" class="form-select">
                <option value="desc">Mới nhất → Cũ nhất</option>
                <option value="asc">Cũ nhất → Mới nhất</option>
              </select>
            </div>

            <!-- Từ ngày - Đến ngày -->
            <div class="row g-2 mb-2">
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
            <div class="mb-2">
              <label class="form-label fw-bold">TRẠNG THÁI HĐ</label>
              <select v-model="filters.trangThai" class="form-select">
                <option value="">-- Tất cả --</option>
                <option value="Nhập hàng NCC">Nhập hàng NCC</option>
                <option value="Trả hàng NCC">Trả hàng NCC</option>
                <option value="Nhập & Trả hàng NCC">Nhập & Trả hàng NCC</option>
              </select>
            </div>

            <!-- Nút làm mới -->
            <button class="btn btn-refresh w-100 mt-2" @click="resetFilters">
              🔄 LÀM MỚI
            </button>
          </div>
        </div>
      </div>

      <!-- ========== Ô 2: TÌM KIẾM (PHẢI) ========== -->
      <div class="col-lg-6">
        <div class="search-box shadow-sm">
          <h5 class="box-title">🔍 TÌM KIẾM</h5>

          <div class="box-content">
            <!-- Tìm theo Mã NCC -->
            <div class="mb-2">
              <label class="form-label fw-bold">TÌM THEO MÃ NCC</label>
              <input
                v-model.trim="filters.maNCC"
                type="text"
                class="form-control"
                placeholder="Nhập mã nhà cung cấp..."
              />
            </div>

            <!-- Tìm theo Tên NCC -->
            <div class="mb-2">
              <label class="form-label fw-bold">TÌM THEO TÊN NCC</label>
              <input
                v-model.trim="filters.tenNCC"
                type="text"
                class="form-control"
                placeholder="Nhập tên nhà cung cấp..."
              />
            </div>

            <!-- Tìm theo Mã HĐ -->
            <div class="mb-2">
              <label class="form-label fw-bold">TÌM THEO MÃ HÓA ĐƠN</label>
              <input
                v-model.trim="filters.maHD"
                type="text"
                class="form-control"
                placeholder="Nhập mã hóa đơn..."
              />
            </div>

            <!-- Tìm theo Số HĐ -->
            <div class="mb-2">
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
              <th>MÃ NCC</th>
              <th>TÊN NCC</th>
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
              :key="hd.ma_hoa_don"
              class="table-row"
            >
              <td class="text-center">{{ (page - 1) * perPage + idx + 1 }}</td>
              <td class="text-center">
                <a
                  href="#"
                  class="link-invoice fw-bold"
                  @click.prevent="xuatAnhHoaDonNhap(hd)"
                >
                  {{ hd.ma_hoa_don }}
                </a>
              </td>
              <td class="text-center">
                <a
                  href="#"
                  class="link-invoice"
                  @click.prevent="xuatAnhHoaDonNhap(hd)"
                >
                  {{ hd.so_hoa_don }}
                </a>
              </td>
              <td class="text-center">{{ hd.ma_nha_cung_cap }}</td>
              <td>{{ hd.ten_nha_cung_cap }}</td>
              <td class="text-center">{{ formatDateTime(hd.ngay_tao_duong_lich) }}</td>
              <td class="text-center">
                <span
                  :class="{
                    'status-import': hd.trang_thai === 'Nhập hàng NCC',
                    'status-return': hd.trang_thai === 'Trả hàng NCC',
                    'status-both': hd.trang_thai === 'Nhập & Trả hàng NCC',
                  }"
                >
                  {{ hd.trang_thai }}
                </span>
              </td>
              <td class="text-end">
                <strong 
                  :class="{
                    'money-positive': hd.tong_cong >= 0,
                    'money-negative': hd.tong_cong < 0
                  }"
                >
                  {{ formatNum(hd.tong_cong) }}
                </strong>
              </td>
              <td class="text-center">
                <span 
                  class="badge-payment"
                  :class="{
                    'badge-cash': hd.hinh_thuc_thanh_toan === 'Tiền mặt',
                    'badge-transfer': hd.hinh_thuc_thanh_toan === 'Chuyển khoản',
                    'badge-debt': hd.hinh_thuc_thanh_toan === 'Nợ',
                  }"
                >
                  {{ hd.hinh_thuc_thanh_toan }}
                </span>
              </td>
              <td>{{ hd.ghi_chu }}</td>
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
.container-fluid {
  max-width: 1600px;
  margin-inline: auto;
  padding-inline: clamp(1rem, 3vw, 3rem);
  padding-top: 2rem;
}

/* ========== Ô 1 & 2: Filter & Search Boxes ========== */
.filter-box,
.search-box {
  background: #ffffff;
  border: 2px solid #C8E1F5;
  border-radius: 10px;
  overflow: hidden;
}

.box-title {
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  color: #ffffff !important;
  padding: 12px 18px;
  margin: 0;
  font-size: 0.95rem;
  font-weight: 900;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  border-bottom: 3px solid rgba(255, 255, 255, 0.25);
  text-shadow: 0 1px 2px rgba(0,0,0,0.35);
}

.box-content {
  padding: 15px 18px;
}

.form-label {
  color: #4A90E2;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 4px;
  text-transform: uppercase;
}

.form-control,
.form-select {
  border: 1px solid #C8E1F5;
  border-radius: 20px;
  padding: 7px 10px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #4A90E2;
  box-shadow: 0 0 0 0.15rem rgba(74, 144, 226, 0.15);
  outline: none;
}

/* Nút Làm mới */
.btn-refresh {
  background: #4A90E2;
  color: white;
  font-weight: 700;
  padding: 9px;
  border: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.btn-refresh:hover {
  background: #357ABD;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(74, 144, 226, 0.25);
}

/* ========== Ô 3: Bảng hóa đơn ========== */
.table-container {
  background: white;
  border: 2px solid #C8E1F5;
  border-radius: 8px;
  overflow: hidden;
}

.table {
  margin-bottom: 0;
}

/* Header bảng */
.table-container table thead {
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%) !important;
  position: relative;
}

.table-container table thead::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #6BA3E0, #357ABD);
  opacity: 0.9;
}

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
  text-align: center;
}

.table-row {
  border-left: 4px solid transparent;
  transition: all 0.2s ease;
  background: #ffffff;
}

.table-row:hover {
  background-color: #E8F4FD;
  border-left: 4px solid #4A90E2;
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
  color: #4A90E2;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.2s ease;
  position: relative;
  display: inline-block;
}

.link-invoice:hover {
  color: #357ABD;
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
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  font-weight: 800;
}

/* Trạng thái */
.status-import {
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
  color: #ffc107;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 4px;
  background: #fff3cd;
  display: inline-block;
}

/* ========== Phân trang ========== */
.pagination-area {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  background: #E8F4FD;
  border-top: 2px solid #C8E1F5;
}

.btn-paging {
  background: #4A90E2;
  color: white;
  border: none;
  padding: 9px 22px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-paging:hover:not(:disabled) {
  background: #357ABD;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(74, 144, 226, 0.3);
}

.btn-paging:disabled {
  background: #b0c4de;
  cursor: not-allowed;
  opacity: 0.6;
}

.page-info {
  font-weight: 700;
  color: #4A90E2;
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
        maNCC: "",
        tenNCC: "",
        maHD: "",
        soHD: "",
        fromDate: "",
        toDate: "",
        sortOrder: "desc",
        trangThai: "",
      },
      apiUrl:
        "https://script.google.com/macros/s/AKfycbz_vsTrvAjmYq51LTtQhe-nkdOzbMQcpMGslSU8tuSObycF9l5HT7cqYKhJ11uqrpL8/exec",
    };
  },

  computed: {
    filteredHoaDon() {
      const rm = (s) =>
        String(s || "")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();

      let data = [...this.hoaDonList];
      const { maNCC, tenNCC, maHD, soHD, fromDate, toDate, sortOrder, trangThai } = this.filters;

      if (maNCC) data = data.filter((r) => rm(r.ma_nha_cung_cap) === rm(maNCC));
      if (tenNCC) data = data.filter((r) => rm(r.ten_nha_cung_cap) === rm(tenNCC));
      if (maHD) data = data.filter((r) => rm(r.ma_hoa_don) === rm(maHD));
      if (soHD) data = data.filter((r) => rm(r.so_hoa_don) === rm(soHD));

      // lọc ngày
     // Lọc ngày tạo
// 🔹 Lọc theo khoảng ngày (định dạng "HH:mm:ss dd/MM/yyyy")
// 🔹 Lọc theo khoảng ngày (định dạng "HH:mm:ss dd/MM/yyyy")
// 🔹 Lọc theo khoảng ngày (định dạng "HH:mm:ss dd/MM/yyyy")
// 🗓️ Lọc theo khoảng ngày (chuẩn định dạng "HH:mm:ss dd/MM/yyyy")
if (fromDate || toDate) {
  // Chuyển input date sang đối tượng Date thực tế
  const from = fromDate ? new Date(fromDate + "T00:00:00") : null;
  const to = toDate ? new Date(toDate + "T23:59:59") : null;

  // Hàm parse thời gian kiểu Việt Nam "HH:mm:ss dd/MM/yyyy"
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

  data = data.filter((r) => {
    const ngay = parseVNDateTime(r.ngay_tao_duong_lich);
    if (!ngay) return false;
    if (from && ngay < from) return false;
    if (to && ngay > to) return false;
    return true;
  });
}




      if (trangThai) data = data.filter((r) => r.trang_thai === trangThai);

     // 🔹 Sắp xếp theo thời gian đúng định dạng Việt Nam
// 🔹 Sắp xếp đúng định dạng Việt Nam "HH:mm:ss dd/MM/yyyy"
// 🕓 Sắp xếp theo ngày "HH:mm:ss dd/MM/yyyy"
data.sort((a, b) => {
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
  const da = parseVNDateTime(a.ngay_tao_duong_lich);
  const db = parseVNDateTime(b.ngay_tao_duong_lich);
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

  methods: {
    formatNum(n) {
      return Number(n || 0).toLocaleString("vi-VN");
    },

    async fetchHoaDon() {
      try {
        const res = await fetch(this.apiUrl + "?action=getHoaDonNhapHangTong");
        const data = await res.json();
        this.hoaDonList = data || [];
      } catch (err) {
        alert("Không thể tải dữ liệu hóa đơn nhập hàng!");
      }
    },
formatDateTime(str) {
  if (!str) return "-";
  // Đã lưu sẵn "HH:mm:ss dd/MM/yyyy" thì chỉ cần trả lại cho đẹp
  const ok = str.match(/^(\d{2}):(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})$/);
  if (ok) return str;
  try {
    const d = new Date(str);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(
      d.getSeconds()
    )} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  } catch {
    return str;
  }
}

,

 async xuatAnhHoaDonNhap(hd) {
  try {
    if (!hd || !hd.ma_hoa_don) return alert("⚠️ Không tìm thấy mã hóa đơn hợp lệ!");

    // 🔹 GỌI API lấy chi tiết hóa đơn nhập hàng
    const res = await fetch(
      `${this.apiUrl}?action=getHoaDonNhapHangChiTiet&ma_hoa_don=${encodeURIComponent(hd.ma_hoa_don)}`
    );
    const chiTiet = await res.json();

    if (!chiTiet || chiTiet.length === 0) {
      return alert("⚠️ Hóa đơn này chưa có chi tiết để xuất!");
    }
// 🔹 GỌI API lấy thông tin nhà cung cấp
try {
  const resNCC = await fetch(`${this.apiUrl}?action=getNhaCungCap`);
  const allNCC = await resNCC.json();
  const ncc = allNCC.find(n => n.ma_nha_cung_cap === hd.ma_nha_cung_cap);

  hd.sdt_ncc = ncc?.so_dien_thoai || "-";
  hd.dia_chi_ncc = ncc?.dia_chi || "-";
} catch (e) {
  console.warn("⚠️ Không lấy được thông tin NCC:", e);
  hd.sdt_ncc = "-";
  hd.dia_chi_ncc = "-";
}
    // 🔹 Format thời gian về dạng: 27/10/2025 10:05:31
const formatDateTime = (str) => {
  if (!str) return "-";
  const pad = (n) => String(n).padStart(2, "0");

  // ✅ Nếu chuỗi đã đúng định dạng "HH:mm:ss dd/MM/yyyy" thì giữ nguyên
  const match = str.match(/^(\d{2}):(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})$/);
  if (match) return str;

  // ✅ Nếu là định dạng khác (ISO hay Date object) thì chuyển sang dạng mong muốn
  try {
    const d = new Date(str);
    if (isNaN(d)) return str;
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${pad(
      d.getDate()
    )}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  } catch {
    return str;
  }
};

    const ngayLap = formatDateTime(hd.ngay_tao_duong_lich);

    // 🔹 Dùng dữ liệu chi tiết từ API
    const rows = chiTiet
      .map(
        (item, i) => `
        <tr>
          <td>${i + 1}</td>
          <td class="left">${item.ten_hang || ""}</td>
          <td>${item.size || ""}</td>
          <td>${item.so_luong || 0}</td>
          <td>${item.dvt || ""}</td>
          <td>${this.formatNum(item.gia_nhap || item.don_gia || 0)}</td>
          <td>${this.formatNum(item.giam_gia || 0)}</td>
          <td>${this.formatNum(item.thanh_tien || 0)}</td>
          <td class="${item.trang_thai === "Nhập" || item.trang_thai === "Mua" ? "green" : "red"}">
            ${item.trang_thai || ""}
          </td>
        </tr>`
      )
      .join("");

    // 🔹 Xuất HTML hóa đơn giấy
    const html = `
    <div class="invoice-paper">
      <div class="invoice-header">
        <h3 class="shop-name">
          <span class="prefix">𝓗à𝓷𝓰 𝓠𝓾ầ𝓷 Á𝓸</span>
          <span class="main">THỦY KIM</span>
          <span class="suffix">(𝓛𝓪𝓷 𝓗ạ𝓽)</span>
        </h3>
        <div class="shop-info">
          <p>Đ/C : 22B Nguyễn Trãi - Phường 4 - TP. Tuy Hòa, Phú Yên</p>
          <p>ĐT : Nhà 0257.3823295 - 0942.028.933(Lan) - 082.390.7079(Thủy) - 091.8121.427(Kim)</p>
          <p>STK : Lê Thị Phương Thủy _ MSB : 32001010923656 _ MB: 8500100044007</p>
        </div>

        <h4>HÓA ĐƠN NHẬP HÀNG</h4>
        <div class="invoice-info">
          <p><b>Mã HĐ:</b> ${hd.ma_hoa_don || "-"} &nbsp;&nbsp;&nbsp;
             <b>Số HĐ:</b> ${hd.so_hoa_don || "-"} &nbsp;&nbsp;&nbsp;
             <b>Ngày lập:</b> ${ngayLap}</p>
          <p><b>Nhà cung cấp:</b> ${hd.ten_nha_cung_cap || "-"} &nbsp;&nbsp;&nbsp;
             <b>SĐT NCC:</b> ${hd.sdt_ncc || "-"} </p>
          <p><b>Địa chỉ NCC:</b> ${hd.dia_chi_ncc || "-"}</p>
        </div>
      </div>

      <table class="invoice-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>TÊN HÀNG</th>
            <th>SIZE</th>
            <th>SL</th>
            <th>DVT</th>
            <th>ĐƠN GIÁ</th>
            <th>GIẢM</th>
            <th>THÀNH TIỀN</th>
            <th>TRẠNG THÁI</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <p class="note">Hàng nhập kiểm tra kỹ trước khi nhập kho, có vấn đề liên hệ ngay NCC.</p>

      <div class="invoice-footer">
        <p><b>Tổng giảm giá:</b> ${this.formatNum(hd.tong_giam_gia || 0)} đ</p>
        <p><b>Tạm tính:</b> ${this.formatNum(hd.tam_tinh || 0)} đ</p>
        <p><b>Hàng trả:</b> ${this.formatNum(hd.hang_tra || 0)} đ</p>
        <p><b>Nợ cũ:</b> ${this.formatNum(hd.no_cu || 0)} đ</p>
        <p><b>Trả NCC:</b> ${this.formatNum(hd.tra_tien || 0)} đ</p>
        <p><b>Hình thức TT:</b> ${hd.hinh_thuc_thanh_toan || "-"}</p>
        <hr>
        <h3 class="total">TỔNG CỘNG: ${this.formatNum(hd.tong_cong || 0)} đ</h3>
        <p><b>Ghi chú hóa đơn:</b> ${hd.ghi_chu || "-"}</p>

        <div class="sign">
          <p>Người lập phiếu nhập</p><br><br>
          <p>_________________________</p>
        </div>
      </div>
    </div>
    `;

    const style = `
    <style>
    .invoice-paper{width:1050px;margin:auto;padding:25px 45px;background:#fff;color:#1a1a1a;border:2px solid #003399;font-family:'Times New Roman',serif;}
    .invoice-header{text-align:center;border-bottom:2px solid #003399;margin-bottom:12px}
    .invoice-header h3{color:#003399;font-size:24px;font-weight:800;text-transform:uppercase;letter-spacing:1px}
    .shop-info p{margin:3px 0;font-size:15px;font-weight:600;color:#003399}
    .invoice-info p{margin:3px 0;font-size:15px;color:#1a1a1a}
    .invoice-table{width:100%;border-collapse:collapse;font-size:15px;border:1.5px solid #003399;margin-top:10px}
    .invoice-table th,.invoice-table td{border:1px solid #003399;padding:6px;text-align:center}
    .invoice-table th{background:#003399;color:#fff;font-weight:700;text-transform:uppercase}
    .invoice-table td.left{text-align:left;padding-left:8px}
    .green{color:#008000;font-weight:bold}
    .red{color:#cc0000;font-weight:bold}
    .invoice-footer{margin-top:20px;font-size:16px;line-height:1.6;color:#1a1a1a;text-align:right;padding-right:10px}
    .invoice-footer b{color:#003399}
    .invoice-footer .total{color:red;font-weight:700;font-size:18px;border-top:2px solid #003399;padding-top:6px;margin-top:6px}
    .note{text-align:left;font-style:italic;font-size:16px;margin-top:20px;color:#003366}
    .sign{margin-top:40px;text-align:right;font-size:15px;color:#003366}
    @media print {.invoice-paper{box-shadow:none;border:1px solid #003399}}
    </style>`;

    const temp = document.createElement("div");
    temp.innerHTML = style + html;
    temp.style.position = "absolute";
    temp.style.top = "-9999px";
    document.body.appendChild(temp);

    const canvas = await html2canvas(temp, {
      backgroundColor: "#fff",
      scale: 2,
      useCORS: true,
      logging: false
    });

    document.body.removeChild(temp);
    const imgData = canvas.toDataURL("image/png");

    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>Phiếu nhập ${hd.so_hoa_don}</title></head>
      <body style="text-align:center;background:#f5f5f5">
      <div style="padding:10px;background:#fff;border-bottom:1px solid #ccc;position:sticky;top:0">
        <button onclick="window.print()" style="padding:8px 16px;border-radius:6px;background:#007bff;color:#fff;border:none">🖨️ In hóa đơn</button>
        <button onclick="download()" style="padding:8px 16px;border-radius:6px;background:#28a745;color:#fff;border:none">⬇️ Tải ảnh</button>
      </div>
      <img id="img" src="${imgData}" style="max-width:100%;margin-top:10px;box-shadow:0 0 10px rgba(0,0,0,0.3);border:1px solid #ccc"/>
      <script>
        function download(){
          const a=document.createElement('a');
          a.href=document.getElementById('img').src;
          a.download='PhieuNhap_${hd.so_hoa_don||"HD"}.png';
          a.click();
        }
      <\/script>
      </body></html>`);
    win.document.close();
  } catch (e) {
    console.error("❌ Lỗi khi xuất hóa đơn nhập hàng:", e);
    alert("❌ Có lỗi khi xuất hóa đơn nhập hàng!");
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
        maNCC: "",
        tenNCC: "",
        maHD: "",
        soHD: "",
        fromDate: "",
        toDate: "",
        sortOrder: "desc",
        trangThai: "",
      };
      this.page = 1;
    },
  },

  mounted() {
    this.fetchHoaDon();
  },
};
</script>


