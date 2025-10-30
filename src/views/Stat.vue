<template>
  <div class="dashboard">
    <h2 class="fw-bold text-primary text-center mb-4">📊 THỐNG KÊ TỔNG HỢP</h2>

    <!-- 🧭 Bộ lọc -->
    <div class="filter-bar shadow-sm p-3 mb-4 bg-white rounded-3">
      <div class="row g-3 align-items-end justify-content-center">
        <div class="col-md-3">
          <label class="form-label fw-bold">Từ ngày</label>
          <input type="date" v-model="fromDate" class="form-control" />
        </div>
        <div class="col-md-3">
          <label class="form-label fw-bold">Đến ngày</label>
          <input type="date" v-model="toDate" class="form-control" />
        </div>
        <div class="col-md-3 d-flex gap-2">
          <button @click="applyFilter" class="btn btn-primary w-100 fw-bold">
            🔍 Áp dụng
          </button>
          <button @click="resetFilter" class="btn btn-outline-secondary w-100">
            ♻️ Xóa
          </button>
        </div>
      </div>
    </div>

    <!-- 🔄 Làm mới -->
    <div class="text-center mb-3">
      <button @click="fetchAll" class="btn btn-outline-primary fw-bold px-3 py-2">
        🔄 Làm mới dữ liệu
      </button>
    </div>

    <!-- ⏳ Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2">Đang tải dữ liệu...</p>
    </div>

    <!-- 📊 GRID CARD -->
    <div v-else class="stats-grid">
   <div
  v-for="(item, i) in cards"
  :key="i"
  class="stat-card shadow-sm"
  :class="'border-' + item.color"
  @click="selectMetric(item)"
  style="cursor: pointer"
>


        <div class="icon">{{ item.icon }}</div>
        <div class="title">{{ item.title }}</div>
      <div :class="'value text-' + item.color">
  {{ displayValue(item) }}
</div>

      </div>
      
    </div>
    <!-- 🧾 DANH SÁCH HÓA ĐƠN -->
    <!-- 📆 LỊCH CHỈ SỐ -->
<div v-if="metricSelected" class="calendar mt-5">
  <h4 class="fw-bold text-center mb-4">
    📅 Lịch chỉ số: <span class="text-primary">{{ metricSelected.title }}</span>
  </h4>

  <div class="month-grid">
    <div v-for="m in 12" :key="m" class="month-block shadow-sm">
      <div class="month-header">
        <strong>{{ getMonthName(m).toUpperCase() }}</strong>
      </div>

      <div class="days-grid">
        <div
          v-for="d in getDaysOfMonth(m)"
          :key="d.key"
          class="day"
          :style="getDayStyle(d.value)"
          :title="`${d.day}/${m}: ${format(d.value)}`"
        >
          <small class="fw-bold">{{ d.day }}</small>
          <div class="val">{{ shortFormat(d.value) }}</div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="card shadow-sm mt-5">
  <div class="card-header fw-bold bg-primary text-white">
    📜 DANH SÁCH HÓA ĐƠN BÁN HÀNG
  </div>
  <div class="table-responsive">
    <table class="table table-bordered table-hover align-middle mb-0">
      <thead class="table-light text-center">
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
          <th class="text-success">LÃI</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, i) in tableRows" :key="i">
          <td class="text-center fw-bold">{{ i + 1 }}</td>
          <td class="fw-bold text-primary">{{ r.ma_hoa_don }}</td>
          <td>{{ r.so_hoa_don || "-" }}</td>
          <td>{{ r.ma_khach_hang || "-" }}</td>
          <td>{{ r.ten_khach_hang || "-" }}</td>
          <td>{{ formatDate(r.ngay_tao_duong_lich) }}</td>
          <td class="text-center">{{ r.trang_thai || "-" }}</td>
          <td class="text-end fw-bold">{{ format(r.tam_tinh) }}</td>
          <td class="text-end">{{ format(r.tra_tien) }}</td>
         <td
  class="text-end fw-bold"
  :class="r.lai_hoa_don >= 0 ? 'text-success' : 'text-danger'"
>
  {{ format(r.lai_hoa_don) }}
</td>

        </tr>
        <tr v-if="tableRows.length === 0">
          <td colspan="10" class="text-center text-muted py-3">
            Không có dữ liệu
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- 📆 LỊCH CHỈ SỐ -->


</div>

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

    // 🟢 Tự động set ngày hiện tại
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


// ======================= FILTER DATE =======================
// ======================= FILTER DATE (chuẩn hóa cho "HH:mm:ss dd/MM/yyyy") =======================
function parseDateVN(dateStr) {
  if (!dateStr) return null;
  let str = String(dateStr).trim().replace(/\s+/g, " "); // loại bỏ khoảng trắng dư
  
  // ✅ Dạng "08:52:58 30/10/2025"
  const match1 = str.match(/^(\d{1,2}):(\d{1,2}):(\d{1,2}) (\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match1) {
    const [, hh, mm, ss, dd, MM, yyyy] = match1.map(Number);
    return new Date(yyyy, MM - 1, dd, hh, mm, ss);
  }

  // ✅ Dạng "30/10/2025 08:52:58"
  const match2 = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/);
  if (match2) {
    const [, dd, MM, yyyy, hh, mm, ss] = match2.map(Number);
    return new Date(yyyy, MM - 1, dd, hh, mm, ss);
  }

  // ✅ Dạng ISO (2025-10-30T08:33:29Z)
  if (str.includes("T")) {
    const d = new Date(str);
    if (!isNaN(d)) return new Date(d.getTime() + 7 * 60 * 60 * 1000);
  }

  // ✅ Dạng chỉ ngày "30/10/2025"
  const match3 = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match3) {
    const [, dd, MM, yyyy] = match3.map(Number);
    return new Date(yyyy, MM - 1, dd);
  }

  return null;
}

// ✅ Hàm kiểm tra trong khoảng ngày lọc
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
// ======================= APPLY & RESET =======================
function applyFilter() {
  if (!fromDate.value || !toDate.value) {
    alert("Vui lòng chọn đủ 'Từ ngày' và 'Đến ngày'");
    return;
  }
  calcStats();
}
function resetFilter() {
  fromDate.value = "";
  toDate.value = "";
  calcStats();
}

// ======================= MAIN CALCULATION =======================
function calcStats() {
  // 🧭 Lọc ngày đúng key (đều là "ngay_tao_duong_lich")
  const hdTong = data.value.hoa_don_tong.filter((r) => inRange(r.ngay_tao_duong_lich));
  const hdNhap = data.value.hoa_don_nhap.filter((r) => inRange(r.ngay_tao_duong_lich));
  const soTC = data.value.so_thu_chi.filter((r) => inRange(r.ngay_tao || r.thoi_gian));
  const kh = data.value.khach_hang;
  const ncc = data.value.nha_cung_cap;
  const hh = data.value.hang_hoa;

  const sum = (arr, field) => arr.reduce((t, r) => t + (Number(r[field]) || 0), 0);

  // 🔹 1. Doanh thu bán hàng
  const doanhThu = sum(hdTong, "tam_tinh");
// 🔹 💸 Tiền hàng hoàn trả khách
const tienHangHoanTraKhach = sum(hdTong, "hang_tra");
  // 🔹 2. Tiền hàng khách trả
  const tienKhachTra = sum(hdTong, "tra_tien");

  // 🔹 3. Tổng công nợ khách hàng / NCC
  const tongCongNoKH = sum(kh, "cong_no");
  const tongCongNoNCC = sum(ncc, "cong_no");

  // 🔹 4. Tổng thu thực tế
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

  // 🔹 5. Tổng chi thực tế
  const tongChiThucTe =
    Math.abs(sum(soTC.filter((r) => Number(r.so_tien) < 0), "so_tien")) +
    sum(hdNhap, "tra_tien");

  // 🔹 6. Chi phí nhập NCC
  const chiPhiNhapNCC = sum(hdNhap, "tam_tinh") - sum(hdNhap, "hang_tra");

  // 🔹 7. Lợi nhuận
  const loiNhuanUocTinh = doanhThu - chiPhiNhapNCC;
  const loiNhuanThucTe = tongThuThucTe - tongChiThucTe;

  // 🔹 8. Tổng giá trị tồn kho
  const tongGiaTriTonKho = hh.reduce(
    (t, r) => t + (Number(r.so_luong_kho) || 0) * (Number(r.gia_goc) || 0),
    0
  );

  // 🔹 9. Map mã hóa đơn → ngày tạo
  const mapNgayBan = Object.fromEntries(
    data.value.hoa_don_tong.map((r) => [r.ma_hoa_don?.trim(), r.ngay_tao_duong_lich])
  );
  const mapNgayNhap = Object.fromEntries(
    data.value.hoa_don_nhap.map((r) => [r.ma_hoa_don?.trim(), r.ngay_tao_duong_lich])
  );

  // 🔹 10. Lấy ngày tạo linh hoạt (auto nhận field)
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

  // 🔹 11. Lọc chi tiết theo ngày
  const hdctFiltered = data.value.hoa_don_chi_tiet.filter((r) => inRange(getNgayBan(r)));
  const hdnhctFiltered = data.value.hoa_don_nhap_chi_tiet.filter((r) =>
    inRange(getNgayNhap(r))
  );

  // 🔹 12. Tổng SL hàng (fix chuẩn trạng thái viết hoa/thường)
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

  // 🔹 13. Số lượng hóa đơn
  const tongHDban = hdTong.length;
  const tongHDnhap = hdNhap.length;

  // ✅ Debug log
  console.log({
    hdctFiltered: hdctFiltered.length,
    hdnhctFiltered: hdnhctFiltered.length,
    tongHangBan,
    tongHangKhachTra,
    tongHangNhap,
    tongHangTraNCC,
  });
console.log("🧾 1 dòng từ hoa_don_chi_tiet:", data.value.hoa_don_chi_tiet[0]);
console.log("🧾 1 dòng từ hoa_don_nhap_hang_chi_tiet:", data.value.hoa_don_nhap_chi_tiet[0]);

  // 🔹 14. Gán kết quả
  v.value = {
    doanhThu,
    tienKhachTra,
      tienHangHoanTraKhach, // 🟢 thêm dòng này
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




// ======================= CARD HIỂN THỊ =======================
const cards = computed(() => [
  // 💰 TIỀN
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

  // 📦 SỐ LƯỢNG HÀNG
  { title: "Tổng SL hàng đã bán", value: v.value.tongHangBan, color: "primary", icon: "🛒", type: "count" },
  { title: "Tổng SL khách trả", value: v.value.tongHangKhachTra, color: "secondary", icon: "🔁", type: "count" },
  { title: "Tổng SL hàng nhập", value: v.value.tongHangNhap, color: "success", icon: "🚚", type: "count" },
  { title: "Tổng SL hàng trả NCC", value: v.value.tongHangTraNCC, color: "warning", icon: "📦", type: "count" },

  // 🧾 HÓA ĐƠN
  { title: "Tổng số hóa đơn bán hàng", value: v.value.tongHDban, color: "info", icon: "🧾", type: "invoice" },
  { title: "Tổng số hóa đơn nhập hàng", value: v.value.tongHDnhap, color: "info", icon: "📑", type: "invoice" },
]);

// ======================= BẢNG HÓA ĐƠN BÁN HÀNG =======================
// ======================= BẢNG HÓA ĐƠN BÁN HÀNG (TÍNH LÃI CHUẨN) =======================
const tableRows = computed(() => {
  const hdTong = data.value.hoa_don_tong || [];
  const chiTiet = data.value.hoa_don_chi_tiet || [];
  const hangHoa = data.value.hang_hoa || [];

  // Map mã hàng → giá gốc
  const mapGiaGoc = Object.fromEntries(
    hangHoa.map((h) => [String(h.ma_hang || "").trim(), Number(h.gia_goc) || 0])
  );

  // Gom chi tiết theo mã hóa đơn
  const chiTietByHD = {};
  chiTiet.forEach((c) => {
    const maHD = String(c.ma_hoa_don || "").trim();
    if (!chiTietByHD[maHD]) chiTietByHD[maHD] = [];
    chiTietByHD[maHD].push(c);
  });

  // Tính lãi từng hóa đơn
  return hdTong
    .filter((h) => inRange(h.ngay_tao_duong_lich))
    .map((hd) => {
      const maHD = hd.ma_hoa_don?.trim();
      const dsChiTiet = chiTietByHD[maHD] || [];

      // Xác định trạng thái hóa đơn
      const trangThai = (hd.trang_thai || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      // Tính tổng lãi gốc (chưa xét âm dương)
      const tongLaiGoc = dsChiTiet.reduce((sum, item) => {
        const donGia = Number(item.don_gia) || 0;
        const soLuong = Number(item.so_luong) || 0;
        const maHang = String(item.ma_hang || "").trim();
        const giaGoc = mapGiaGoc[maHang] || 0;
        return sum + (donGia - giaGoc) * soLuong;
      }, 0);

      // Nếu hóa đơn là "Trả" thì đảo dấu
      const isReturn = ["tra", "khach tra", "hang tra", "tra hang"].includes(trangThai);
      const lai_hoa_don = isReturn ? -tongLaiGoc : tongLaiGoc;

      return { ...hd, lai_hoa_don };
    });
});

const format = (num) =>
  Number(num || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
function displayValue(item) {
  const val = Number(item.value || 0);
  if (item.type === "money") return format(val) + " VND";
  if (item.type === "count") return val.toLocaleString("vi-VN") + " cái";
  if (item.type === "invoice") return val.toLocaleString("vi-VN") + " đơn";
  return val.toLocaleString("vi-VN");
}
// ======================= 📅 LỊCH CHỈ SỐ =======================
const metricSelected = ref(null);
const monthlyData = ref({});

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
    // 💰 Tiền tệ
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
        addValue(
          new Date(),
          (Number(r.so_luong_kho) || 0) * (Number(r.gia_goc) || 0)
        )
      );
      break;

    // 📦 Số lượng hàng
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

    // 🧾 Số lượng hóa đơn
    case "Tổng số hóa đơn bán hàng":
      hdTong.forEach((h) => addValue(h.ngay_tao_duong_lich, 1));
      break;

    case "Tổng số hóa đơn nhập hàng":
      hdNhap.forEach((h) => addValue(h.ngay_tao_duong_lich, 1));
      break;

    default:
      console.log("⚠️ Chưa có case xử lý cho:", item.title);
      break;
  }

  monthlyData.value = daily;
  console.log("📅 Dữ liệu lịch:", daily);
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

// 🎨 Heatmap màu dựa theo giá trị
function getDayStyle(value) {
  if (!value || value === 0) {
    return {
      background: "#f1f3f5",
      color: "#555",
    };
  }

  const val = Math.abs(value);
  const intensity = Math.min(1, Math.log10(val + 1) / 6); // log scale
  const baseColor = value >= 0 ? [25, 135, 84] : [220, 53, 69]; // xanh / đỏ
  const bg = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${0.15 + intensity * 0.6})`;
  const border = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, 0.4)`;
  const color = value >= 0 ? "#065f46" : "#7f1d1d";

  return {
    background: bg,
    border: `1px solid ${border}`,
    color,
  };
}

fetchAll();
</script>

<style scoped>
.dashboard {
  width: 100%;
  min-height: 100vh;
  padding: 30px 40px;
  background: #f8f9fb;
  overflow-x: hidden;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.stat-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.25s ease;
}
.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}
.icon {
  font-size: 2rem;
  margin-bottom: 8px;
}
.title {
  font-weight: 600;
  color: #444;
  text-align: center;
  margin-bottom: 4px;
}
.value {
  font-size: 1.25rem;
  font-weight: bold;
}
.calendar {
  background: #fff;
  border-radius: 14px;
  padding: 30px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.month-block {
  background: #fafbfc;
  border-radius: 10px;
  padding: 14px;
  transition: all 0.2s ease;
}

.month-block:hover {
  background: #f1f7ff;
  transform: translateY(-3px);
}

.month-header {
  text-align: center;
  color: #0d6efd;
  font-weight: 600;
  margin-bottom: 10px;
  letter-spacing: 1px;
  font-size: 0.95rem;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.day {
  border-radius: 8px;
  padding: 5px 0;
  font-size: 0.75rem;
  text-align: center;
  transition: transform 0.15s ease;
  cursor: pointer;
  min-height: 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.day:hover {
  transform: scale(1.05);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
}

.val {
  font-weight: 600;
  font-size: 0.7rem;
  opacity: 0.9;
}


</style>
