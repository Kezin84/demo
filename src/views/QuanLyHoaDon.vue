<template>
  <div class="container py-4">
    <h2 class="text-center mb-3 fw-bold text-primary">📄 QUẢN LÝ HÓA ĐƠN</h2>

    <!-- 🔍 Bộ lọc tìm kiếm -->
    <div class="card p-3 mb-4 shadow-sm">
      <div class="row g-3">
        <!-- 🔹 1️⃣ Tìm theo mã khách hàng -->
        <div class="col-md-3">
          <label class="form-label fw-bold">Tìm theo MÃ KH</label>
          <input
            v-model.trim="filters.maKH"
            type="text"
            class="form-control"
            placeholder="Nhập mã khách hàng..."
          />
        </div>

        <!-- 🔹 2️⃣ Tìm theo tên khách hàng -->
        <div class="col-md-3">
          <label class="form-label fw-bold">Tìm theo TÊN KHÁCH</label>
          <input
            v-model.trim="filters.tenKH"
            type="text"
            class="form-control"
            placeholder="Nhập tên khách hàng..."
          />
        </div>

        <!-- 🔹 3️⃣ Tìm theo mã hóa đơn -->
        <div class="col-md-3">
          <label class="form-label fw-bold">Tìm theo MÃ HÓA ĐƠN</label>
          <input
            v-model.trim="filters.maHD"
            type="text"
            class="form-control"
            placeholder="Nhập mã hóa đơn..."
          />
        </div>

        <!-- 🔹 4️⃣ Tìm theo số hóa đơn -->
        <div class="col-md-3">
          <label class="form-label fw-bold">Tìm theo SỐ HÓA ĐƠN</label>
          <input
            v-model.trim="filters.soHD"
            type="text"
            class="form-control"
            placeholder="Nhập số hóa đơn..."
          />
        </div>
      </div>
      <!-- 🔹 5️⃣ Lọc theo ngày và sắp xếp -->
<div class="row g-3 mt-2">
  <div class="col-md-3">
    <label class="form-label fw-bold">TỪ NGÀY</label>
    <input v-model="filters.fromDate" type="date" class="form-control" />
  </div>

  <div class="col-md-3">
    <label class="form-label fw-bold">ĐẾN NGÀY</label>
    <input v-model="filters.toDate" type="date" class="form-control" />
  </div>

  <div class="col-md-3">
    <label class="form-label fw-bold">SẮP XẾP</label>
    <select v-model="filters.sortOrder" class="form-select">
      <option value="desc">Mới nhất → Cũ nhất</option>
      <option value="asc">Cũ nhất → Mới nhất</option>
    </select>
  </div>

</div>
<!-- 🔹 6️⃣ Lọc theo Trạng thái và Hình thức thanh toán -->
<div class="row g-3 mt-2">
  <div class="col-md-3">
    <label class="form-label fw-bold">Trạng thái HĐ</label>
    <select v-model="filters.trangThai" class="form-select">
      <option value="">-- Tất cả --</option>
      <option value="Mua">Mua</option>
      <option value="Trả">Trả</option>
      <option value="Mua & Trả">Mua & Trả</option>
    </select>
  </div>

  <div class="col-md-3">
    <label class="form-label fw-bold">Hình thức thanh toán</label>
    <select v-model="filters.thanhToan" class="form-select">
      <option value="">-- Tất cả --</option>
      <option value="Tiền mặt">Tiền mặt</option>
      <option value="Chuyển khoản">Chuyển khoản</option>
      <option value="Nợ">Nợ</option>
    </select>
  </div>
</div>

      <!-- Nút reset -->
      <div class="text-end mt-3">
        <button class="btn btn-secondary" @click="resetFilters">🔄 Làm mới</button>
      </div>
    </div>

    <!-- 🧾 Bảng hóa đơn -->
   <!-- 🧾 Bảng hóa đơn -->
<div class="table-responsive">
  <table class="table table-bordered table-hover align-middle">
    <thead class="table-primary text-center">
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
        class="text-center hover-row"
      >
        <td>{{ (page - 1) * perPage + idx + 1 }}</td>
        <td>
  <a
    href="#"
    class="link-primary fw-bold"
    @click.prevent="xuatAnhHoaDonGiay(hd)"
  >
    {{ hd.ma_hoa_don || hd.MA_HOA_DON }}
  </a>
</td>
<td>
  <a
    href="#"
    class="link-primary"
    @click.prevent="xuatAnhHoaDonGiay(hd)"
  >
    {{ hd.so_hoa_don || hd.SO_HOA_DON }}
  </a>
</td>

        <td>{{ hd.ma_khach_hang || hd.MA_KHACH_HANG }}</td>
        <td>{{ hd.ten_khach_hang || hd.TEN_KHACH_HANG }}</td>
        <td>{{ hd.ngay_tao_duong_lich || hd.NGAY_TAO_DUONG_LICH }}</td>
        
        <!-- Cột TRẠNG THÁI -->
        <td>
          <span
            :class="{
              'text-success fw-bold': trangThai(hd) === 'Mua',
              'text-danger fw-bold': trangThai(hd) === 'Trả',
              'text-primary fw-bold': trangThai(hd) === 'Mua & Trả',
            }"
          >
            {{ trangThai(hd) }}
          </span>
        </td>

        <td class="text-end">{{ formatNum(hd.tong_cong || hd.TONG_CONG) }}</td>
        <td>{{ hd.hinh_thuc_thanh_toan || hd.HINH_THUC_THANH_TOÁN }}</td>
        <td>{{ hd.ghi_chu || hd.GHI_CHU }}</td>
      </tr>

      <tr v-if="filteredHoaDon.length === 0">
        <td colspan="10" class="text-center text-muted py-3">
          Không có hóa đơn nào phù hợp
        </td>
      </tr>
    </tbody>
  </table>
</div>


    <!-- 🔢 Phân trang -->
    <div class="pagination-wrapper text-center mt-3">
      <button
        class="btn btn-outline-primary btn-sm me-2"
        :disabled="page === 1"
        @click="prevPage"
      >
        ← Trước
      </button>
      <span>Trang {{ page }} / {{ totalPages }}</span>
      <button
        class="btn btn-outline-primary btn-sm ms-2"
        :disabled="page === totalPages"
        @click="nextPage"
      >
        Sau →
      </button>
    </div>
  </div>
</template>

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

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}
.hover-row:hover {
  background-color: #f3f7ff;
  cursor: pointer;
}
.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.card label {
  font-size: 0.9rem;
}
</style>
