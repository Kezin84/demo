<template>
  <div class="container-xl py-4">
    <h2 class="text-center fw-bold mb-4 text-primary">📘 SỔ THU - CHI</h2>

    <!-- ================= FORM NHẬP ================= -->
    <div class="card p-4 shadow-sm mb-4">
      <h5 class="fw-bold mb-3">🧾 Nhập giao dịch thu - chi</h5>

      <div class="row g-3">
        <!-- Mã & Số hóa đơn -->
        <div class="col-md-3">
          <label class="form-label">Mã hóa đơn</label>
          <input v-model="form.ma_hoa_don" class="form-control" placeholder="Tự động hoặc nhập tay" />
        </div>
        <div class="col-md-3">
          <label class="form-label">Số hóa đơn</label>
          <input v-model="form.so_hoa_don" class="form-control" placeholder="Tự động sinh theo mã KH/NCC/DV" readonly />
        </div>

        <!-- Mã KH + Tên KH -->
        <div class="col-md-3">
          <label class="form-label">Mã khách hàng</label>
          <select v-model="form.ma_khach_hang" class="form-select">
            <option value="">-- Chọn khách hàng --</option>
            <option v-for="k in khachHang" :key="k.ma_khach_hang" :value="k.ma_khach_hang">
              {{ k.ma_khach_hang }} - {{ k.ten_khach_hang }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Tên khách hàng</label>
          <input v-model="tenKH" class="form-control" readonly />
        </div>

        <!-- Mã NCC + Tên NCC -->
        <div class="col-md-3">
          <label class="form-label">Mã NCC</label>
          <select v-model="form.ma_nha_cung_cap" class="form-select">
            <option value="">-- Chọn NCC --</option>
            <option v-for="n in nhaCungCap" :key="n.ma_nha_cung_cap" :value="n.ma_nha_cung_cap">
              {{ n.ma_nha_cung_cap }} - {{ n.ten_nha_cung_cap }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Tên NCC</label>
          <input v-model="tenNCC" class="form-control" readonly />
        </div>

        <!-- Mã DV + Tên DV -->
        <div class="col-md-3">
          <label class="form-label">Mã dịch vụ</label>
          <input v-model="form.ma_dich_vu" class="form-control" placeholder="Tự động từ tên dịch vụ" readonly />
        </div>
        <div class="col-md-3">
          <label class="form-label">Tên dịch vụ</label>
          <input v-model="form.ten_dich_vu" class="form-control" placeholder="VD: Quảng cáo, điện nước..." />
        </div>

        <!-- Số tiền -->
        <div class="col-md-3">
          <label class="form-label">Số tiền</label>
          <input v-model.number="form.so_tien" type="number" class="form-control" />
        </div>

        <!-- Nội dung -->
        <div class="col-md-6">
          <label class="form-label">Nội dung</label>
          <input v-model="form.noi_dung" class="form-control" placeholder="VD: Thu nợ khách, Chi điện nước..." />
        </div>

        <!-- Hình thức TT -->
        <div class="col-md-3">
          <label class="form-label">Hình thức thanh toán</label>
          <select v-model="form.hinh_thuc_thanh_toan" class="form-select">
            <option value="Tiền mặt">Tiền mặt</option>
            <option value="Chuyển khoản">Chuyển khoản</option>
            <option value="Nợ">Nợ</option>
          </select>
        </div>

        <!-- Nút hành động -->
        <div class="col-12 text-end mt-3">
          <button class="btn btn-success me-2" @click="submit('Thu')">💰 Nhận tiền</button>
          <button class="btn btn-danger" @click="submit('Chi')">💸 Chi tiền</button>
        </div>
      </div>
    </div>
<!-- 🔍 BỘ LỌC -->
<div class="card p-3 mb-3 shadow-sm">
  <div class="row g-3">
    <div class="col-md-2">
      <label class="form-label fw-bold">📅 Từ ngày</label>
      <input v-model="filters.fromDate" type="date" class="form-control" />
    </div>
    <div class="col-md-2">
      <label class="form-label fw-bold">📅 Đến ngày</label>
      <input v-model="filters.toDate" type="date" class="form-control" />
    </div>

    <div class="col-md-2">
      <label class="form-label fw-bold">↕️ Sắp xếp</label>
      <select v-model="filters.sortOrder" class="form-select">
        <option value="desc">Mới nhất → Cũ nhất</option>
        <option value="asc">Cũ nhất → Mới nhất</option>
      </select>
    </div>

    <div class="col-md-2">
      <label class="form-label fw-bold">💳 Hình thức</label>
      <select v-model="filters.hinhThuc" class="form-select">
        <option value="">-- Tất cả --</option>
        <option value="Tiền mặt">Tiền mặt</option>
        <option value="Chuyển khoản">Chuyển khoản</option>
        <option value="Nợ">Nợ</option>
      </select>
    </div>

    <div class="col-md-3">
      <label class="form-label fw-bold">📘 Trạng thái</label>
      <select v-model="filters.trangThai" class="form-select">
        <option value="">-- Tất cả --</option>

        <optgroup label="💰 Giao dịch tiền tệ">
          <option value="Thu tiền">Thu tiền</option>
          <option value="Chi tiền">Chi tiền</option>
        </optgroup>

        <optgroup label="📗 Khách hàng (Bán hàng)">
          <option value="Bán thu tiền">Bán thu tiền</option>
          <option value="Bán ghi nợ">Bán ghi nợ</option>
          <option value="Trả hàng">Trả hàng</option>
        </optgroup>

        <optgroup label="📘 Nhà cung cấp (Nhập hàng)">
          <option value="Nhập hàng (đã trả tiền)">Nhập hàng (đã trả tiền)</option>
          <option value="Nhập hàng (ghi nợ)">Nhập hàng (ghi nợ)</option>
          <option value="Nhập hàng khác">Nhập hàng khác</option>
          <option value="Trả hàng NCC">Trả hàng NCC</option>
        </optgroup>
      </select>
    </div>

    <div class="col-md-1 d-flex align-items-end">
      <button class="btn btn-secondary w-100" @click="resetFilters">🔄</button>
    </div>
  </div>

  <hr class="my-3" />

  <div class="row g-3">
    <div class="col-md-2">
      <label class="form-label fw-bold">🔹 Mã KH</label>
      <input v-model.trim="filters.maKH" class="form-control" placeholder="VD: KH001" />
    </div>
    <div class="col-md-2">
      <label class="form-label fw-bold">🔹 Tên KH</label>
      <input v-model.trim="filters.tenKH" class="form-control" placeholder="VD: Nguyễn Văn A" />
    </div>
    <div class="col-md-2">
      <label class="form-label fw-bold">🏢 Mã NCC</label>
      <input v-model.trim="filters.maNCC" class="form-control" placeholder="VD: NCC01" />
    </div>
    <div class="col-md-2">
      <label class="form-label fw-bold">🏢 Tên NCC</label>
      <input v-model.trim="filters.tenNCC" class="form-control" placeholder="VD: Cty ABC" />
    </div>
    <div class="col-md-2">
      <label class="form-label fw-bold">🧾 Mã DV</label>
      <input v-model.trim="filters.maDV" class="form-control" placeholder="VD: DV01" />
    </div>
    <div class="col-md-2">
      <label class="form-label fw-bold">🧾 Tên DV</label>
      <input v-model.trim="filters.tenDV" class="form-control" placeholder="VD: Quảng cáo" />
    </div>
  </div>
</div>

    <!-- ================= DANH SÁCH ================= -->
    <div class="card p-3 shadow-sm">
      <h5 class="fw-bold mb-3">📋 Danh sách sổ thu - chi</h5>

      <table class="table table-bordered table-striped align-middle text-center">
        <thead class="table-primary">
          <tr>
            <th>#</th>
            <th>Mã HĐ</th>
            <th>Số HĐ</th>
            <th>Thời gian</th>
            <th>Mã KH</th>
            <th>Tên KH</th>
            <th>Mã NCC</th>
            <th>Tên NCC</th>
            <th>Mã DV</th>
            <th>Tên DV</th>
            <th>Trạng thái</th>
            <th>Số tiền</th>
            <th>Nội dung</th>
            <th>HTTT</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in paginated" :key="i">
            <td>{{ (currentPage - 1) * perPage + i + 1 }}</td>
            <td>{{ r.ma_hoa_don }}</td>
            <td>{{ r.so_hoa_don }}</td>
            <td>{{ formatDate(r.ngay_tao) }}</td>
            <td>{{ r.ma_khach_hang }}</td>
            <td>{{ r.ten_khach_hang }}</td>
            <td>{{ r.ma_nha_cung_cap }}</td>
            <td>{{ r.ten_nha_cung_cap }}</td>
            <td>{{ r.ma_dich_vu }}</td>
            <td>{{ r.ten_dich_vu }}</td>
            <td :class="r.trang_thai.includes('Chi') ? 'text-danger' : 'text-success'">{{ r.trang_thai }}</td>
            <td>{{ formatMoney(r.so_tien) }}</td>
            <td>{{ r.noi_dung }}</td>
            <td>{{ r.hinh_thuc_thanh_toan }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Phân trang -->
      <div class="d-flex justify-content-between align-items-center mt-2">
        <button
          class="btn btn-sm btn-outline-primary"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          ← Trước
        </button>
        <span>Trang {{ currentPage }} / {{ totalPages }}</span>
        <button
          class="btn btn-sm btn-outline-primary"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Sau →
        </button>
      </div>
    </div>
  </div>
</template>

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
  so_tien: 0,
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
    so_tien: tien,
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

<style scoped>
.table td,
.table th {
  vertical-align: middle;
}
</style>
