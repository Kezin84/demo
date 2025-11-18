<template>
  <div class="dashboard">
    <!-- Ô 1: BỘ LỌC (FULL WIDTH) -->
    <div class="section section-filter">
      <div class="header-content">
        <div class="header-icon">📊</div>
        <h1 class="header-title">THỐNG KÊ TỔNG HỢP</h1>
        <p class="header-subtitle">Dashboard Analytics & Insights</p>
      </div>

      <div class="filter-container">
        <div class="filter-inputs">
          <div class="input-group">
            <label class="input-label">
              <span class="label-icon">📅</span>
              Từ ngày
            </label>
            <input type="date" v-model="fromDate" class="date-input" />
          </div>

          <div class="input-group">
            <label class="input-label">
              <span class="label-icon">📅</span>
              Đến ngày
            </label>
            <input type="date" v-model="toDate" class="date-input" />
          </div>

          <div class="button-group">
            <button @click="applyFilter" class="btn-apply">
              <span class="btn-icon">✓</span>
              Áp dụng
            </button>
            <button @click="resetFilter" class="btn-reset">
              <span class="btn-icon">↻</span>
              Đặt lại
            </button>
          </div>
        </div>

        <button @click="fetchAll" class="btn-refresh">
          <span class="refresh-icon">⟳</span>
          <span>Làm mới dữ liệu</span>
        </button>
      </div>
    </div>

    <!-- ⏳ LOADING -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <p class="loading-text">Đang tải dữ liệu...</p>
    </div>

    <template v-else>
      <!-- Ô 2 + 3: SIDE BY SIDE (CÓ SCROLL) -->
      <div class="section-row">
        <!-- Ô 2: CÁC THẺ THỐNG KÊ -->
        <div class="section section-stats">
          <div class="section-header-inline">
            <div class="section-icon">📊</div>
            <h2 class="section-title-small">Các chỉ số</h2>
          </div>
          
          <div class="stats-scroll">
            <div class="stats-grid-vertical">
              <div
                v-for="(item, i) in cards"
                :key="i"
                class="stat-card"
                :class="['stat-' + item.color, metricSelected?.title === item.title ? 'active' : '']"
                @click="selectMetric(item)"
              >
                <div class="card-glow"></div>
                <div class="card-content">
                  <div class="card-icon-wrapper">
                    <div class="icon-bg"></div>
                    <span class="card-icon">{{ item.icon }}</span>
                  </div>
                  <div class="card-info">
                    <h3 class="card-title">{{ item.title }}</h3>
                    <div class="card-value">{{ displayValue(item) }}</div>
                  </div>
                </div>
                <div class="card-border"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ô 3: LỊCH NHIỆT ĐỘ -->
        <div class="section section-calendar">
          <div class="section-header-inline">
            <div class="section-icon">📅</div>
            <h2 class="section-title-small">
              <span v-if="metricSelected">{{ metricSelected.title }}</span>
              <span v-else>Chọn chỉ số để xem lịch</span>
            </h2>
          </div>

          <div v-if="metricSelected" class="calendar-scroll">
            <div class="months-grid-vertical">
              <div v-for="m in 12" :key="m" class="month-card">
                <div class="month-header">
                  <span class="month-name">{{ getMonthName(m) }}</span>
                  <span class="month-number">{{ m }}/2025</span>
                </div>

                <div class="days-grid">
                  <div
                    v-for="d in getDaysOfMonth(m)"
                    :key="d.key"
                    class="day-cell"
                    :style="getDayStyle(d.value)"
                    :title="`${d.day}/${m}: ${format(d.value)}`"
                  >
                    <span class="day-number">{{ d.day }}</span>
                    <span class="day-value">{{ shortFormat(d.value) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="empty-calendar">
            <div class="empty-icon">📅</div>
            <p>Vui lòng chọn một chỉ số bên trái</p>
          </div>
        </div>
      </div>

      <!-- Ô 4: BIỂU ĐỒ CỘT TĂNG TRƯỞNG (FULL WIDTH) -->
      <div v-if="metricSelected" class="section section-chart">
        <div class="section-header">
          <div class="section-icon">📈</div>
          <h2 class="section-title">
            Biểu đồ tăng trưởng: <span class="metric-name">{{ metricSelected.title }}</span>
          </h2>
          <div class="chart-controls">
            <div class="chart-date-filter">
              <label class="date-label">📅</label>
              <input 
                type="date" 
                v-model="chartFromDate" 
                class="chart-date-input" 
                @change="filterChartByDate"
              />
              <span class="date-separator">→</span>
              <input 
                type="date" 
                v-model="chartToDate" 
                class="chart-date-input" 
                @change="filterChartByDate"
              />
              <button @click="resetChartDate" class="btn-reset-chart">↻</button>
            </div>
            <div class="chart-tabs">
              <button
                v-for="period in ['Ngày', 'Tháng', 'Năm']"
                :key="period"
                :class="['tab-btn', chartPeriod === period ? 'active' : '']"
                @click="chartPeriod = period"
              >
                {{ period }}
              </button>
            </div>
          </div>
        </div>

        <div class="chart-container">
          <div class="chart-grid">
            <!-- Y-axis labels -->
            <div class="y-axis">
              <div class="y-axis-positive">
                <div v-for="tick in yAxisTicks.positive" :key="'pos-' + tick" class="y-tick">
                  {{ shortFormat(tick) }}
                </div>
              </div>
              <div class="y-axis-zero">0</div>
              <div class="y-axis-negative" v-if="yAxisTicks.negative.length > 0">
                <div v-for="tick in yAxisTicks.negative" :key="'neg-' + tick" class="y-tick">
                  {{ shortFormat(tick) }}
                </div>
              </div>
            </div>

            <!-- Chart bars -->
            <div class="chart-bars-wrapper">
              <div class="chart-bars">
                <div
                  v-for="(item, idx) in chartData"
                  :key="idx"
                  class="bar-wrapper"
                  :title="`${item.label}: ${format(item.value)}`"
                >
                  <!-- Container dương (phần trên trục 0) -->
                  <div class="bar-container positive">
                    <div
                      v-if="item.value >= 0"
                      class="bar"
                      :style="{
                        height: getBarHeight(item.value) + '%',
                        background: getBarColor(item.value),
                      }"
                    >
                      <span class="bar-value">{{ shortFormat(item.value) }}</span>
                    </div>
                  </div>
                  
                  <!-- Container âm (phần dưới trục 0) -->
                  <div class="bar-container negative">
                    <div
                      v-if="item.value < 0"
                      class="bar"
                      :style="{
                        height: getBarHeight(item.value) + '%',
                        background: getBarColor(item.value),
                      }"
                    >
                      <span class="bar-value">{{ shortFormat(item.value) }}</span>
                    </div>
                  </div>
                  
                  <div class="bar-label">{{ item.label }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ô 5: BẢNG LÃI HÓA ĐƠN (FULL WIDTH) -->
      <div class="section section-table">
        <div class="table-header">
          <div class="table-header-content">
            <span class="table-icon">📜</span>
            <h2 class="table-title">Danh sách hóa đơn bán hàng</h2>
          </div>
          <div class="table-badge">{{ tableRows.length }} hóa đơn</div>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th><div class="th-content">STT</div></th>
                <th><div class="th-content">Mã HĐ</div></th>
                <th><div class="th-content">Số HĐ</div></th>
                <th><div class="th-content">Mã KH</div></th>
                <th><div class="th-content">Tên khách hàng</div></th>
                <th><div class="th-content">Ngày tạo</div></th>
                <th><div class="th-content">Trạng thái</div></th>
                <th><div class="th-content">Tổng cộng</div></th>
                <th><div class="th-content">Thanh toán</div></th>
                <th><div class="th-content">Lãi</div></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(r, i) in tableRows" :key="i" class="table-row">
                <td class="td-center"><span class="row-number">{{ i + 1 }}</span></td>
                <td><span class="invoice-code">{{ r.ma_hoa_don }}</span></td>
                <td>{{ r.so_hoa_don || "—" }}</td>
                <td>{{ r.ma_khach_hang || "—" }}</td>
                <td class="td-customer">{{ r.ten_khach_hang || "—" }}</td>
                <td class="td-date">{{ formatDate(r.ngay_tao_duong_lich) }}</td>
                <td class="td-center">
                  <span class="status-badge">{{ r.trang_thai || "—" }}</span>
                </td>
                <td class="td-money">{{ format(r.tam_tinh) }}</td>
                <td class="td-money">{{ format(r.tra_tien) }}</td>
                <td class="td-money">
                  <span :class="['profit-value', r.lai_hoa_don >= 0 ? 'positive' : 'negative']">
                    {{ format(r.lai_hoa_don) }}
                  </span>
                </td>
              </tr>
              <tr v-if="tableRows.length === 0">
                <td colspan="10" class="empty-state">
                  <div class="empty-icon">📭</div>
                  <p>Không có dữ liệu</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";

const API =
  "https://script.google.com/macros/s/AKfycbz_vsTrvAjmYq51LTtQhe-nkdOzbMQcpMGslSU8tuSObycF9l5HT7cqYKhJ11uqrpL8/exec";

const loading = ref(true);
const data = ref({
  hoa_don_tong: [],
  hoa_don_nhap: [],
  hoa_don_chi_tiet: [],
  hoa_don_nhap_chi_tiet: [],
  so_thu_chi: [],
  khach_hang: [],
  nha_cung_cap: [],
  hang_hoa: [],
});
const v = ref({});
const fromDate = ref("");
const toDate = ref("");
const metricSelected = ref(null);
const monthlyData = ref({});
const chartPeriod = ref("Ngày");
const chartFromDate = ref("");
const chartToDate = ref("");

// ======================= FETCH DATA =======================
async function fetchAll() {
  loading.value = true;
  try {
    const [hdTong, hdNhap, hdct, hdnhct, soTC, kh, ncc, hh] = await Promise.all([
      axios.get(`${API}?action=getHoaDonTong`),
      axios.get(`${API}?action=getHoaDonNhapHangTong`),
      axios.get(`${API}?action=getHoaDonChiTiet`),
      axios.get(`${API}?action=getHoaDonNhapHangChiTiet`),
      axios.get(`${API}?action=getSoThuChi`),
      axios.get(`${API}?action=getKhachHang`),
      axios.get(`${API}?action=getNhaCungCap`),
      axios.get(`${API}?action=getHangHoa`),
    ]);

    const safe = (d) => {
      if (Array.isArray(d)) return d;
      if (typeof d === "object" && Array.isArray(d.data)) return d.data;
      try {
        const parsed = JSON.parse(d);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
      return [];
    };

    data.value.hoa_don_tong = safe(hdTong.data);
    data.value.hoa_don_nhap = safe(hdNhap.data);
    data.value.hoa_don_chi_tiet = safe(hdct.data);
    data.value.hoa_don_nhap_chi_tiet = safe(hdnhct.data);
    data.value.so_thu_chi = safe(soTC.data);
    data.value.khach_hang = safe(kh.data);
    data.value.nha_cung_cap = safe(ncc.data);
    data.value.hang_hoa = safe(hh.data);

    const today = new Date().toISOString().split("T")[0];
    fromDate.value = today;
    toDate.value = today;

    calcStats();
  } catch (err) {
    console.error("❌ Lỗi fetch:", err);
  } finally {
    loading.value = false;
  }
}

function parseDateVN(dateStr) {
  if (!dateStr) return null;
  let str = String(dateStr).trim().replace(/\s+/g, " ");
  
  const match1 = str.match(/^(\d{1,2}):(\d{1,2}):(\d{1,2}) (\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match1) {
    const [, hh, mm, ss, dd, MM, yyyy] = match1.map(Number);
    return new Date(yyyy, MM - 1, dd, hh, mm, ss);
  }

  const match2 = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/);
  if (match2) {
    const [, dd, MM, yyyy, hh, mm, ss] = match2.map(Number);
    return new Date(yyyy, MM - 1, dd, hh, mm, ss);
  }

  if (str.includes("T")) {
    const d = new Date(str);
    if (!isNaN(d)) return new Date(d.getTime() + 7 * 60 * 60 * 1000);
  }

  const match3 = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match3) {
    const [, dd, MM, yyyy] = match3.map(Number);
    return new Date(yyyy, MM - 1, dd);
  }

  return null;
}

function inRange(dateStr) {
  if (!fromDate.value && !toDate.value) return true;

  const d = parseDateVN(dateStr);
  if (!d || isNaN(d)) return false;

  const start = fromDate.value ? new Date(fromDate.value + "T00:00:00") : null;
  const end = toDate.value ? new Date(toDate.value + "T23:59:59") : null;

  return (!start || d >= start) && (!end || d <= end);
}

function formatDate(v) {
  if (!v) return "";
  const d = parseDateVN(v);
  if (!d) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function applyFilter() {
  if (!fromDate.value || !toDate.value) {
    alert("Vui lòng chọn đủ 'Từ ngày' và 'Đến ngày'");
    return;
  }
  calcStats();
  if (metricSelected.value) {
    calcMonthlyMetric(metricSelected.value);
  }
}

function resetFilter() {
  fromDate.value = "";
  toDate.value = "";
  calcStats();
  if (metricSelected.value) {
    calcMonthlyMetric(metricSelected.value);
  }
}

function calcStats() {
  const hdTong = data.value.hoa_don_tong.filter((r) => inRange(r.ngay_tao_duong_lich));
  const hdNhap = data.value.hoa_don_nhap.filter((r) => inRange(r.ngay_tao_duong_lich));
  const soTC = data.value.so_thu_chi.filter((r) => inRange(r.ngay_tao || r.thoi_gian));
  const kh = data.value.khach_hang;
  const ncc = data.value.nha_cung_cap;
  const hh = data.value.hang_hoa;

  const sum = (arr, field) => arr.reduce((t, r) => t + (Number(r[field]) || 0), 0);

  const doanhThu = sum(hdTong, "tam_tinh");
  const tienHangHoanTraKhach = sum(hdTong, "hang_tra");
  const tienKhachTra = sum(hdTong, "tra_tien");
  const tongCongNoKH = sum(kh, "cong_no");
  const tongCongNoNCC = sum(ncc, "cong_no");

  const tongThuThucTe =
    tienKhachTra +
    sum(
      soTC.filter(
        (r) =>
          Number(r.so_tien) > 0 &&
          (r.hinh_thuc_thanh_toan || "").toLowerCase() !== "nợ"
      ),
      "so_tien"
    );

  const tongChiThucTe =
    Math.abs(sum(soTC.filter((r) => Number(r.so_tien) < 0), "so_tien")) +
    sum(hdNhap, "tra_tien");

  const chiPhiNhapNCC = sum(hdNhap, "tam_tinh") - sum(hdNhap, "hang_tra");
  const loiNhuanUocTinh = doanhThu - chiPhiNhapNCC;
  const loiNhuanThucTe = tongThuThucTe - tongChiThucTe;

  const tongGiaTriTonKho = hh.reduce(
    (t, r) => t + (Number(r.so_luong_kho) || 0) * (Number(r.gia_goc) || 0),
    0
  );

  const mapNgayBan = Object.fromEntries(
    data.value.hoa_don_tong.map((r) => [r.ma_hoa_don?.trim(), r.ngay_tao_duong_lich])
  );
  const mapNgayNhap = Object.fromEntries(
    data.value.hoa_don_nhap.map((r) => [r.ma_hoa_don?.trim(), r.ngay_tao_duong_lich])
  );

  const getNgayBan = (r) =>
    r.ngay_tao_duong_lich ||
    r.ngay_tao ||
    r.thoi_gian ||
    mapNgayBan[r.ma_hoa_don?.trim()] ||
    "";
  const getNgayNhap = (r) =>
    r.ngay_tao_duong_lich ||
    r.ngay_tao ||
    r.thoi_gian ||
    mapNgayNhap[r.ma_hoa_don?.trim()] ||
    "";

  const hdctFiltered = data.value.hoa_don_chi_tiet.filter((r) => inRange(getNgayBan(r)));
  const hdnhctFiltered = data.value.hoa_don_nhap_chi_tiet.filter((r) =>
    inRange(getNgayNhap(r))
  );

  const normalize = (v) =>
    (v || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const tongHangBan = hdctFiltered
    .filter((r) => ["mua", "ban", "xuat"].includes(normalize(r.trang_thai)))
    .reduce((t, r) => t + (Number(r.so_luong) || 0), 0);

  const tongHangKhachTra = hdctFiltered
    .filter((r) => ["tra", "khach tra", "hang tra"].includes(normalize(r.trang_thai)))
    .reduce((t, r) => t + (Number(r.so_luong) || 0), 0);

  const tongHangNhap = hdnhctFiltered
    .filter((r) => ["nhap", "mua"].includes(normalize(r.trang_thai)))
    .reduce((t, r) => t + (Number(r.so_luong) || 0), 0);

  const tongHangTraNCC = hdnhctFiltered
    .filter((r) => ["tra", "tra hang", "tra ncc"].includes(normalize(r.trang_thai)))
    .reduce((t, r) => t + (Number(r.so_luong) || 0), 0);

  const tongHDban = hdTong.length;
  const tongHDnhap = hdNhap.length;

  v.value = {
    doanhThu,
    tienKhachTra,
    tienHangHoanTraKhach,
    tongCongNoKH,
    tongCongNoNCC,
    tongThuThucTe,
    tongChiThucTe,
    chiPhiNhapNCC,
    loiNhuanUocTinh,
    loiNhuanThucTe,
    tongGiaTriTonKho,
    tongHangBan,
    tongHangKhachTra,
    tongHangNhap,
    tongHangTraNCC,
    tongHDban,
    tongHDnhap,
  };
}

const cards = computed(() => [
  { title: "Doanh thu bán hàng", value: v.value.doanhThu, color: "success", icon: "💰", type: "money" },
  { title: "Tiền hàng khách thanh toán", value: v.value.tienKhachTra, color: "info", icon: "💵", type: "money" },
  { title: "Tiền hàng hoàn trả khách", value: v.value.tienHangHoanTraKhach, color: "danger", icon: "🔄", type: "money" },
  { title: "Tổng thu thực tế", value: v.value.tongThuThucTe, color: "primary", icon: "💸", type: "money" },
  { title: "Tổng chi thực tế", value: v.value.tongChiThucTe, color: "secondary", icon: "💳", type: "money" },
  { title: "Chi phí nhập hàng NCC", value: v.value.chiPhiNhapNCC, color: "danger", icon: "🏭", type: "money" },
  { title: "Lợi nhuận ước tính", value: v.value.loiNhuanUocTinh, color: "success", icon: "📈", type: "money" },
  { title: "Lợi nhuận thực tế", value: v.value.loiNhuanThucTe, color: "success", icon: "📊", type: "money" },
  { title: "Tổng công nợ khách hàng", value: v.value.tongCongNoKH, color: "warning", icon: "👥", type: "money" },
  { title: "Tổng công nợ NCC", value: v.value.tongCongNoNCC, color: "danger", icon: "🏢", type: "money" },
  { title: "Tổng giá trị tồn kho", value: v.value.tongGiaTriTonKho, color: "info", icon: "📦", type: "money" },
  { title: "Tổng SL hàng đã bán", value: v.value.tongHangBan, color: "primary", icon: "🛒", type: "count" },
  { title: "Tổng SL khách trả", value: v.value.tongHangKhachTra, color: "secondary", icon: "🔁", type: "count" },
  { title: "Tổng SL hàng nhập", value: v.value.tongHangNhap, color: "success", icon: "🚚", type: "count" },
  { title: "Tổng SL hàng trả NCC", value: v.value.tongHangTraNCC, color: "warning", icon: "📦", type: "count" },
  { title: "Tổng số hóa đơn bán hàng", value: v.value.tongHDban, color: "info", icon: "🧾", type: "invoice" },
  { title: "Tổng số hóa đơn nhập hàng", value: v.value.tongHDnhap, color: "info", icon: "📑", type: "invoice" },
]);

const tableRows = computed(() => {
  const hdTong = data.value.hoa_don_tong || [];
  const chiTiet = data.value.hoa_don_chi_tiet || [];
  const hangHoa = data.value.hang_hoa || [];

  const clean = (v) => Number(String(v || "0").replace(/[^\d.-]/g, ""));

  const mapGiaGoc = Object.fromEntries(
    hangHoa.map((h) => [String(h.ma_hang || "").trim(), clean(h.gia_goc)])
  );

  const chiTietByHD = {};
  chiTiet.forEach((c) => {
    const maHD = String(c.ma_hoa_don || "").trim();
    if (!chiTietByHD[maHD]) chiTietByHD[maHD] = [];
    chiTietByHD[maHD].push(c);
  });

  return hdTong
    .filter((h) => inRange(h.ngay_tao_duong_lich))
    .map((hd) => {
      const maHD = hd.ma_hoa_don?.trim();
      const dsChiTiet = chiTietByHD[maHD] || [];

      const trangThai = (hd.trang_thai || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const tongLaiGoc = dsChiTiet.reduce((sum, item) => {
        const donGia = clean(item.don_gia);
        const soLuong = clean(item.so_luong);
        const maHang = String(item.ma_hang || "").trim();
        const giaGoc = mapGiaGoc[maHang] || 0;
        return sum + (donGia - giaGoc) * soLuong;
      }, 0);

      const isReturn = ["tra", "khach tra", "hang tra", "tra hang"].includes(trangThai);
      const lai_hoa_don = isReturn ? -tongLaiGoc : tongLaiGoc;

      return { ...hd, lai_hoa_don };
    });
});

const format = (num) =>
  Number(num || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

function displayValue(item) {
  const val = Number(item.value || 0);
  if (item.type === "money") return format(val);
  if (item.type === "count") return val.toLocaleString("vi-VN") + " cái";
  if (item.type === "invoice") return val.toLocaleString("vi-VN") + " đơn";
  return val.toLocaleString("vi-VN");
}

function selectMetric(item) {
  metricSelected.value = item;
  calcMonthlyMetric(item);
}

function calcMonthlyMetric(item) {
  const hdTong = data.value.hoa_don_tong;
  const hdNhap = data.value.hoa_don_nhap;
  const hdct = data.value.hoa_don_chi_tiet;
  const hdnhct = data.value.hoa_don_nhap_chi_tiet;
  const soTC = data.value.so_thu_chi;
  const kh = data.value.khach_hang;
  const ncc = data.value.nha_cung_cap;
  const hh = data.value.hang_hoa;

  const mapGiaGoc = Object.fromEntries(
    hh.map((h) => [String(h.ma_hang || "").trim(), Number(h.gia_goc) || 0])
  );

  const daily = {};

  function addValue(dateStr, val) {
    const d = parseDateVN(dateStr);
    if (!d || isNaN(d)) return;
    const key = d.toISOString().split("T")[0];
    daily[key] ??= 0;
    daily[key] += val || 0;
  }

  const normalize = (v) =>
    (v || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  switch (item.title) {
    case "Doanh thu bán hàng":
      hdTong.forEach((h) => addValue(h.ngay_tao_duong_lich, Number(h.tam_tinh) || 0));
      break;
    case "Tiền hàng khách thanh toán":
      hdTong.forEach((h) => addValue(h.ngay_tao_duong_lich, Number(h.tra_tien) || 0));
      break;
    case "Tiền hàng hoàn trả khách":
      hdTong.forEach((h) => addValue(h.ngay_tao_duong_lich, Number(h.hang_tra) || 0));
      break;
    case "Tổng thu thực tế":
      soTC
        .filter((r) => Number(r.so_tien) > 0)
        .forEach((r) => addValue(r.ngay_tao || r.thoi_gian, Number(r.so_tien) || 0));
      hdTong.forEach((h) => addValue(h.ngay_tao_duong_lich, Number(h.tra_tien) || 0));
      break;
    case "Tổng chi thực tế":
      soTC
        .filter((r) => Number(r.so_tien) < 0)
        .forEach((r) => addValue(r.ngay_tao || r.thoi_gian, Math.abs(r.so_tien) || 0));
      hdNhap.forEach((h) => addValue(h.ngay_tao_duong_lich, Number(h.tra_tien) || 0));
      break;
    case "Chi phí nhập hàng NCC":
      hdNhap.forEach((h) =>
        addValue(h.ngay_tao_duong_lich, Number(h.tam_tinh || 0) - Number(h.hang_tra || 0))
      );
      break;
    case "Lợi nhuận ước tính":
      hdTong.forEach((h) => {
        const ds = hdct.filter((c) => c.ma_hoa_don === h.ma_hoa_don);
        const profit = ds.reduce((sum, c) => {
          const donGia = Number(c.don_gia) || 0;
          const soLuong = Number(c.so_luong) || 0;
          const giaGoc = mapGiaGoc[c.ma_hang?.trim()] || 0;
          return sum + (donGia - giaGoc) * soLuong;
        }, 0);
        addValue(h.ngay_tao_duong_lich, profit);
      });
      break;
    case "Lợi nhuận thực tế":
      const tongThu = {};
      const tongChi = {};
      soTC.forEach((r) => {
        const d = parseDateVN(r.ngay_tao || r.thoi_gian);
        if (!d) return;
        const key = d.toISOString().split("T")[0];
        const so = Number(r.so_tien) || 0;
        if (so > 0) tongThu[key] = (tongThu[key] || 0) + so;
        else tongChi[key] = (tongChi[key] || 0) + Math.abs(so);
      });
      for (const k in tongThu)
        daily[k] = (daily[k] || 0) + (tongThu[k] || 0) - (tongChi[k] || 0);
      break;
    case "Tổng công nợ khách hàng":
      kh.forEach((r) => addValue(r.ngay_cap_nhat || r.ngay_tao, Number(r.cong_no) || 0));
      break;
    case "Tổng công nợ NCC":
      ncc.forEach((r) => addValue(r.ngay_cap_nhat || r.ngay_tao, Number(r.cong_no) || 0));
      break;
    case "Tổng giá trị tồn kho":
      hh.forEach((r) =>
        addValue(new Date(), (Number(r.so_luong_kho) || 0) * (Number(r.gia_goc) || 0))
      );
      break;
    case "Tổng SL hàng đã bán":
      hdct
        .filter((r) => ["mua", "ban", "xuat"].includes(normalize(r.trang_thai)))
        .forEach((r) => addValue(r.ngay_tao_duong_lich, Number(r.so_luong) || 0));
      break;
    case "Tổng SL khách trả":
      hdct
        .filter((r) => ["tra", "hang tra", "khach tra"].includes(normalize(r.trang_thai)))
        .forEach((r) => addValue(r.ngay_tao_duong_lich, Number(r.so_luong) || 0));
      break;
    case "Tổng SL hàng nhập":
      hdnhct
        .filter((r) => ["nhap", "mua"].includes(normalize(r.trang_thai)))
        .forEach((r) => addValue(r.ngay_tao_duong_lich, Number(r.so_luong) || 0));
      break;
    case "Tổng SL hàng trả NCC":
      hdnhct
        .filter((r) => ["tra", "tra hang", "tra ncc"].includes(normalize(r.trang_thai)))
        .forEach((r) => addValue(r.ngay_tao_duong_lich, Number(r.so_luong) || 0));
      break;
    case "Tổng số hóa đơn bán hàng":
      hdTong.forEach((h) => addValue(h.ngay_tao_duong_lich, 1));
      break;
    case "Tổng số hóa đơn nhập hàng":
      hdNhap.forEach((h) => addValue(h.ngay_tao_duong_lich, 1));
      break;
  }

  monthlyData.value = daily;
}

function getMonthName(m) {
  return new Date(2025, m - 1).toLocaleString("vi-VN", { month: "long" });
}

function getDaysOfMonth(month) {
  const year = new Date().getFullYear();
  const days = [];
  const last = new Date(year, month, 0).getDate();
  for (let d = 1; d <= last; d++) {
    const key = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    days.push({
      key,
      day: d,
      value: monthlyData.value[key] || 0,
    });
  }
  return days;
}

function shortFormat(num) {
  if (!num) return "";
  const n = Math.abs(num);
  if (n >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toLocaleString("vi-VN");
}

function getDayStyle(value) {
  if (!value || value === 0) {
    return {
      background: "#f1f3f5",
      color: "#555",
    };
  }

  const val = Math.abs(value);
  const intensity = Math.min(1, Math.log10(val + 1) / 6);
  const baseColor = value >= 0 ? [25, 135, 84] : [220, 53, 69];
  const bg = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${0.15 + intensity * 0.6})`;
  const border = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, 0.4)`;
  const color = value >= 0 ? "#065f46" : "#7f1d1d";

  return {
    background: bg,
    border: `1px solid ${border}`,
    color,
  };
}

const chartData = computed(() => {
  if (!monthlyData.value || Object.keys(monthlyData.value).length === 0) return [];

  let sortedDates = Object.keys(monthlyData.value).sort();

  // Apply date filter if both dates are set
  if (chartFromDate.value && chartToDate.value) {
    const start = new Date(chartFromDate.value);
    const end = new Date(chartToDate.value);
    sortedDates = sortedDates.filter(dateStr => {
      const d = new Date(dateStr);
      return d >= start && d <= end;
    });
  }

  if (chartPeriod.value === "Ngày") {
    // Show filtered dates or last 30 days
    const datesToShow = sortedDates.length > 0 ? sortedDates : sortedDates.slice(-30);
    return datesToShow.map((date) => {
      const d = new Date(date);
      return {
        label: `${d.getDate()}/${d.getMonth() + 1}`,
        value: monthlyData.value[date],
      };
    });
  } else if (chartPeriod.value === "Tháng") {
    const monthlySum = {};
    sortedDates.forEach((date) => {
      const d = new Date(date);
      const key = `${d.getMonth() + 1}/${d.getFullYear()}`;
      monthlySum[key] = (monthlySum[key] || 0) + monthlyData.value[date];
    });
    return Object.entries(monthlySum)
      .sort()
      .slice(-12)
      .map(([label, value]) => ({ label, value }));
  } else {
    const yearlySum = {};
    sortedDates.forEach((date) => {
      const d = new Date(date);
      const key = d.getFullYear().toString();
      yearlySum[key] = (yearlySum[key] || 0) + monthlyData.value[date];
    });
    return Object.entries(yearlySum)
      .sort()
      .map(([label, value]) => ({ label, value }));
  }
});

const yAxisTicks = computed(() => {
  if (chartData.value.length === 0) return { positive: [0], negative: [] };
  
  const values = chartData.value.map((d) => d.value);
  const maxPositive = Math.max(...values.filter(v => v >= 0), 0);
  const minNegative = Math.min(...values.filter(v => v < 0), 0);
  
  const stepPositive = Math.ceil(maxPositive / 4);
  const stepNegative = Math.ceil(Math.abs(minNegative) / 4);
  
  const positive = maxPositive > 0 
    ? [maxPositive, stepPositive * 3, stepPositive * 2, stepPositive, 0].filter(v => v >= 0)
    : [0];
    
  const negative = minNegative < 0
    ? [stepNegative * -1, stepNegative * -2, stepNegative * -3, minNegative].filter(v => v < 0)
    : [];
  
  return { positive, negative };
});

function getBarHeight(value) {
  const values = chartData.value.map((d) => d.value);
  const maxPositive = Math.max(...values.filter(v => v >= 0), 0);
  const minNegative = Math.min(...values.filter(v => v < 0), 0);
  
  if (value >= 0) {
    // Nếu không có giá trị dương nào thì return 0
    if (maxPositive === 0) return 0;
    // Cột dương chiếm 50% chiều cao, scale theo maxPositive
    return (value / maxPositive) * 100;
  } else {
    // Nếu không có giá trị âm nào thì return 0
    if (minNegative === 0) return 0;
    // Cột âm chiếm 50% chiều cao, scale theo minNegative
    return (Math.abs(value) / Math.abs(minNegative)) * 100;
  }
}

function getBarColor(value) {
  if (value >= 0) {
    return "linear-gradient(180deg, #10b981 0%, #059669 100%)";
  }
  return "linear-gradient(180deg, #ef4444 0%, #dc2626 100%)";
}

function filterChartByDate() {
  // Trigger re-computation of chartData
  chartPeriod.value = chartPeriod.value;
}

function resetChartDate() {
  chartFromDate.value = "";
  chartToDate.value = "";
}

fetchAll();
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary: #141e30;
  --primary-dark: #0a1118;
  --primary-light: #243b55;
  --accent: #3a5a7f;
  --success: #10b981;
  --success-dark: #059669;
  --danger: #ef4444;
  --warning: #f59e0b;
  --info: #3b82f6;
  --secondary: #6b7280;
  --dark: #0f172a;
  --light: #f8fafc;
  --border: #e2e8f0;
  --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --radius: 16px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #141e30 0%, #243b55 100%);
  padding: 2rem;
  font-family: 'Inter', -apple-system, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section {
  background: white;
  border-radius: var(--radius);
  padding: 2rem;
  box-shadow: var(--shadow-lg);
}

/* ========== Ô 1: FILTER (FULL WIDTH) ========== */
.section-filter {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 3px solid transparent;
  background-clip: padding-box;
  position: relative;
}

.section-filter::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  background: linear-gradient(135deg, #141e30 0%, #243b55 100%);
  border-radius: var(--radius);
  z-index: -1;
}

.header-content {
  text-align: center;
  margin-bottom: 2rem;
}

.header-icon {
  font-size: 3rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.header-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #141e30 0%, #243b55 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0.5rem 0;
  letter-spacing: -0.5px;
}

.header-subtitle {
  color: var(--secondary);
  font-size: 1rem;
  font-weight: 500;
}

.filter-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.filter-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1.25rem;
  align-items: end;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--dark);
  font-size: 0.9rem;
}

.date-input {
  padding: 0.75rem 1rem;
  border: 2px solid var(--border);
  border-radius: 10px;
  font-size: 0.95rem;
  transition: var(--transition);
  background: var(--light);
}

.date-input:focus {
  outline: none;
  border-color: var(--primary);
  background: white;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.button-group {
  display: flex;
  gap: 0.625rem;
}

.btn-apply,
.btn-reset {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--transition);
}

.btn-apply {
  background: linear-gradient(135deg, #141e30 0%, #243b55 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(20, 30, 48, 0.4);
}

.btn-apply:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(20, 30, 48, 0.5);
}

.btn-reset {
  background: white;
  color: var(--secondary);
  border: 2px solid var(--border);
}

.btn-reset:hover {
  background: var(--light);
  border-color: var(--primary);
  color: var(--primary);
}

.btn-refresh {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #141e30 0%, #243b55 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 4px 14px rgba(20, 30, 48, 0.4);
}

.btn-refresh:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(20, 30, 48, 0.5);
}

.refresh-icon {
  font-size: 1.35rem;
  animation: rotate 2s linear infinite paused;
}

.btn-refresh:hover .refresh-icon {
  animation-play-state: running;
}

@keyframes rotate {
  to { transform: rotate(360deg); }
}

/* ========== LOADING ========== */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.loading-spinner {
  position: relative;
  width: 60px;
  height: 60px;
  margin-bottom: 1.25rem;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-ring:nth-child(2) {
  animation-delay: -0.3s;
  border-top-color: var(--info);
}

.spinner-ring:nth-child(3) {
  animation-delay: -0.15s;
  border-top-color: var(--success);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ========== Ô 2 + 3: SIDE BY SIDE ROW ========== */
.section-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

/* ========== Ô 2: STATS (CÓ SCROLL) ========== */
.section-stats {
  padding: 1.5rem;
  border: 3px solid transparent;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(135deg, #141e30, #243b55) border-box;
}

.section-header-inline {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.875rem;
  border-bottom: 2px solid var(--light);
}

.section-title-small {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--dark);
  margin: 0;
}

.stats-scroll {
  max-height: 600px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.stats-scroll::-webkit-scrollbar {
  width: 8px;
}

.stats-scroll::-webkit-scrollbar-track {
  background: var(--light);
  border-radius: 10px;
}

.stats-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #141e30 0%, #243b55 100%);
  border-radius: 10px;
}

.stats-scroll::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #0a1118 0%, #141e30 100%);
}

.stats-grid-vertical {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-card {
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #fafbff 100%);
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  transition: var(--transition);
  overflow: hidden;
  border: 2px solid rgba(20, 30, 48, 0.1);
  box-shadow: 0 2px 8px rgba(20, 30, 48, 0.08);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #141e30 0%, #243b55 100%);
  transform: scaleX(0);
  transition: var(--transition);
}

.stat-card.stat-success::before { background: linear-gradient(90deg, #10b981 0%, #14b8a6 100%); }
.stat-card.stat-danger::before { background: linear-gradient(90deg, #ef4444 0%, #f97316 100%); }
.stat-card.stat-warning::before { background: linear-gradient(90deg, #f59e0b 0%, #eab308 100%); }
.stat-card.stat-info::before { background: linear-gradient(90deg, #3b82f6 0%, #0ea5e9 100%); }
.stat-card.stat-primary::before { background: linear-gradient(90deg, #141e30 0%, #243b55 100%); }
.stat-card.stat-secondary::before { background: linear-gradient(90deg, #6b7280 0%, #9ca3af 100%); }

.stat-card:hover::before,
.stat-card.active::before {
  transform: scaleX(1);
}

.stat-card:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 20px rgba(20, 30, 48, 0.15);
  border-color: rgba(20, 30, 48, 0.3);
}

.stat-card.active {
  border-color: #141e30;
  box-shadow: 0 4px 24px rgba(20, 30, 48, 0.25);
  background: linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%);
}

.card-glow {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(79, 70, 229, 0.06) 0%, transparent 70%);
  opacity: 0;
  transition: var(--transition);
}

.stat-card:hover .card-glow {
  opacity: 1;
}

.card-content {
  position: relative;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.card-icon-wrapper {
  position: relative;
  flex-shrink: 0;
}

.icon-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--primary), #818cf8);
  border-radius: 50%;
  opacity: 0.1;
}

.stat-card.stat-success .icon-bg { background: linear-gradient(135deg, #6ee7b7, var(--success)); }
.stat-card.stat-danger .icon-bg { background: linear-gradient(135deg, #fca5a5, var(--danger)); }
.stat-card.stat-warning .icon-bg { background: linear-gradient(135deg, #fcd34d, var(--warning)); }
.stat-card.stat-info .icon-bg { background: linear-gradient(135deg, #93c5fd, var(--info)); }

.card-icon {
  font-size: 2rem;
  position: relative;
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--dark);
  margin-bottom: 0.375rem;
  line-height: 1.3;
}

.card-value {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--primary);
}

.stat-card.stat-success .card-value { color: var(--success); }
.stat-card.stat-danger .card-value { color: var(--danger); }
.stat-card.stat-warning .card-value { color: var(--warning); }
.stat-card.stat-info .card-value { color: var(--info); }
.stat-card.stat-secondary .card-value { color: var(--secondary); }

.card-border {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  opacity: 0;
  transition: var(--transition);
}

.stat-card:hover .card-border {
  opacity: 1;
}

/* ========== Ô 3: CALENDAR (CÓ SCROLL) ========== */
.section-calendar {
  padding: 1.5rem;
  border: 3px solid transparent;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(135deg, #14b8a6, #10b981) border-box;
}

.calendar-scroll {
  max-height: 600px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.calendar-scroll::-webkit-scrollbar {
  width: 8px;
}

.calendar-scroll::-webkit-scrollbar-track {
  background: var(--light);
  border-radius: 10px;
}

.calendar-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #14b8a6 0%, #10b981 100%);
  border-radius: 10px;
}

.calendar-scroll::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #0d9488 0%, #059669 100%);
}

.months-grid-vertical {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.month-card {
  background: linear-gradient(135deg, #f8fafb 0%, #ffffff 100%);
  border-radius: 10px;
  padding: 1rem;
  border: 2px solid rgba(20, 30, 48, 0.15);
  transition: var(--transition);
  box-shadow: 0 2px 8px rgba(20, 30, 48, 0.08);
}

.month-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(20, 30, 48, 0.15);
  border-color: rgba(20, 30, 48, 0.3);
}

.month-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid;
  border-image: linear-gradient(90deg, #141e30, #243b55) 1;
}

.month-name {
  font-size: 0.95rem;
  font-weight: 700;
  background: linear-gradient(90deg, #141e30, #243b55);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
}

.month-number {
  font-size: 0.8rem;
  color: var(--secondary);
  font-weight: 600;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.day-cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border-radius: 5px;
  transition: var(--transition);
  cursor: pointer;
  font-size: 0.7rem;
}

.day-cell:hover {
  transform: scale(1.08);
  z-index: 10;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
}

.day-number {
  font-size: 0.65rem;
  font-weight: 700;
  margin-bottom: 1px;
}

.day-value {
  font-size: 0.58rem;
  font-weight: 600;
  opacity: 0.9;
}

.empty-calendar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: var(--secondary);
}

.empty-calendar .empty-icon {
  font-size: 3.5rem;
  opacity: 0.3;
  margin-bottom: 1rem;
}

/* ========== Ô 4: CHART (FULL WIDTH) ========== */
.section-chart {
  padding: 2rem;
  border: 3px solid transparent;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(135deg, #141e30, #243b55) border-box;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.75rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--light);
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--dark);
  flex: 1;
  margin: 0 0 0 0.625rem;
  min-width: 200px;
}

.chart-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.chart-date-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--light);
  border-radius: 10px;
  border: 2px solid var(--border);
}

.date-label {
  font-size: 1rem;
}

.chart-date-input {
  padding: 0.375rem 0.5rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 0.8rem;
  transition: var(--transition);
  background: white;
  max-width: 140px;
}

.chart-date-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(20, 30, 48, 0.1);
}

.date-separator {
  color: var(--secondary);
  font-weight: 600;
}

.btn-reset-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 2px solid var(--border);
  background: white;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);
  color: var(--secondary);
}

.btn-reset-chart:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--light);
}

.metric-name {
  background: linear-gradient(135deg, #141e30 0%, #243b55 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.chart-tabs {
  display: flex;
  gap: 0.5rem;
}

.tab-btn {
  padding: 0.5rem 1rem;
  border: 2px solid var(--border);
  background: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: var(--transition);
  color: var(--secondary);
}

.tab-btn.active {
  background: linear-gradient(135deg, #141e30 0%, #243b55 100%);
  border-color: #141e30;
  color: white;
  box-shadow: 0 4px 12px rgba(20, 30, 48, 0.3);
}

.tab-btn:hover:not(.active) {
  border-color: #141e30;
  color: #141e30;
  background: rgba(20, 30, 48, 0.05);
}

.chart-container {
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafb 0%, #ffffff 100%);
  border-radius: 10px;
  min-height: 350px;
  border: 2px solid rgba(20, 30, 48, 0.1);
}

.chart-grid {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 1rem;
  height: 400px;
}

.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 0.875rem;
  border-right: 2px solid var(--border);
}

.y-axis-positive {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.y-axis-zero {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--dark);
  text-align: right;
  padding: 0.25rem 0;
  border-top: 2px solid #141e30;
  border-bottom: 2px solid #141e30;
}

.y-axis-negative {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.y-tick {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--secondary);
  text-align: right;
}

.chart-bars-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.chart-bars-wrapper::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
  background: linear-gradient(90deg, #141e30 0%, #243b55 100%);
  z-index: 1;
}

.chart-bars {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2rem 0;
  overflow-x: auto;
  height: 100%;
}

.chart-bars::-webkit-scrollbar {
  height: 6px;
}

.chart-bars::-webkit-scrollbar-track {
  background: var(--light);
  border-radius: 10px;
}

.chart-bars::-webkit-scrollbar-thumb {
  background: var(--secondary);
  border-radius: 10px;
}

.bar-wrapper {
  flex: 1;
  min-width: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
}

.bar-container {
  display: flex;
  width: 100%;
  position: relative;
  z-index: 2;
}

.bar-container.positive {
  height: 50%;
  align-items: flex-end;
  justify-content: center;
}

.bar-container.negative {
  height: 50%;
  align-items: flex-start;
  justify-content: center;
}

.bar {
  width: 100%;
  min-height: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px;
  transition: var(--transition);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  position: relative;
}

.bar-container.positive .bar {
  border-radius: 5px 5px 0 0;
  align-items: flex-start;
}

.bar-container.negative .bar {
  border-radius: 0 0 5px 5px;
  align-items: flex-end;
}

.bar:hover {
  transform: scaleY(1.03);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
}

.bar-value {
  font-size: 0.65rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.bar-label {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--dark);
  text-align: center;
  white-space: nowrap;
}

/* ========== Ô 5: TABLE (FULL WIDTH) ========== */
.section-table {
  padding: 0;
  overflow: hidden;
  border: 3px solid transparent;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(135deg, #141e30, #243b55) border-box;
}

.table-header {
  background: linear-gradient(135deg, #141e30 0%, #243b55 100%);
  padding: 1.35rem 1.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.table-icon {
  font-size: 1.35rem;
}

.table-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.table-badge {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.35rem 0.75rem;
  border-radius: 14px;
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
}

.table-container {
  overflow-x: auto;
  padding: 1.75rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.data-table th {
  padding: 0.875rem 0.75rem;
  text-align: left;
  font-weight: 700;
  color: var(--dark);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid var(--primary);
}

.th-content {
  display: flex;
  align-items: center;
}

.data-table tbody tr {
  transition: var(--transition);
  border-bottom: 1px solid var(--border);
}

.data-table tbody tr:hover {
  background: linear-gradient(90deg, rgba(79, 70, 229, 0.03) 0%, transparent 100%);
}

.data-table td {
  padding: 0.875rem 0.75rem;
  color: var(--dark);
  font-size: 0.85rem;
}

.td-center {
  text-align: center;
}

.td-money {
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}

.td-customer {
  font-weight: 600;
}

.td-date {
  color: var(--secondary);
  font-size: 0.8rem;
}

.row-number {
  display: inline-block;
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  background: linear-gradient(135deg, #141e30 0%, #243b55 100%);
  color: white;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.8rem;
  box-shadow: 0 2px 8px rgba(20, 30, 48, 0.3);
}

.invoice-code {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  background: linear-gradient(135deg, rgba(20, 30, 48, 0.12), rgba(36, 59, 85, 0.08));
  color: #141e30;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.8rem;
  border: 1px solid rgba(20, 30, 48, 0.25);
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.65rem;
  background: linear-gradient(135deg, #e0e7ff, #dbeafe);
  color: #141e30;
  border-radius: 14px;
  font-weight: 600;
  font-size: 0.75rem;
  border: 1px solid rgba(20, 30, 48, 0.2);
}

.profit-value {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.8rem;
}

.profit-value.positive {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(20, 184, 166, 0.08));
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.profit-value.negative {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(249, 115, 22, 0.08));
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.25);
}

.empty-state {
  text-align: center;
  padding: 2.5rem !important;
  color: var(--secondary);
}

.empty-state .empty-icon {
  font-size: 2.25rem;
  margin-bottom: 0.75rem;
  opacity: 0.4;
}

/* ========== RESPONSIVE ========== */
@media (max-width: 1200px) {
  .section-row {
    grid-template-columns: 1fr;
  }

  .stats-scroll,
  .calendar-scroll {
    max-height: 500px;
  }

  .chart-controls {
    width: 100%;
    justify-content: space-between;
  }

  .chart-date-filter {
    flex: 1;
    max-width: 500px;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
    gap: 1.5rem;
  }

  .section {
    padding: 1.25rem;
  }

  .header-title {
    font-size: 1.5rem;
  }

  .filter-inputs {
    grid-template-columns: 1fr;
  }

  .button-group {
    width: 100%;
    flex-direction: column;
  }

  .table-header {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .section-title {
    width: 100%;
  }

  .chart-controls {
    width: 100%;
    flex-direction: column;
  }

  .chart-date-filter {
    width: 100%;
    max-width: none;
  }

  .chart-tabs {
    width: 100%;
    justify-content: center;
  }
}
</style>