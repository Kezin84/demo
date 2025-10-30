<template>
  <div class="container py-4">
    <h2 class="text-center mb-3 fw-bold text-primary">📦 QUẢN LÝ HÓA ĐƠN NHẬP KHO</h2>

    <!-- 🔍 Bộ lọc tìm kiếm -->
    <div class="card p-3 mb-4 shadow-sm">
      <div class="row g-3">
        <div class="col-md-3">
          <label class="form-label fw-bold">Tìm theo MÃ NCC</label>
          <input v-model.trim="filters.maNCC" class="form-control" placeholder="Nhập mã nhà cung cấp..." />
        </div>
        <div class="col-md-3">
          <label class="form-label fw-bold">Tìm theo TÊN NCC</label>
          <input v-model.trim="filters.tenNCC" class="form-control" placeholder="Nhập tên nhà cung cấp..." />
        </div>
        <div class="col-md-3">
          <label class="form-label fw-bold">Tìm theo MÃ HĐ</label>
          <input v-model.trim="filters.maHD" class="form-control" placeholder="Nhập mã hóa đơn..." />
        </div>
        <div class="col-md-3">
          <label class="form-label fw-bold">Tìm theo SỐ HĐ</label>
          <input v-model.trim="filters.soHD" class="form-control" placeholder="Nhập số hóa đơn..." />
        </div>
      </div>

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
        <div class="col-md-3">
          <label class="form-label fw-bold">Trạng thái HĐ</label>
          <select v-model="filters.trangThai" class="form-select">
            <option value="">-- Tất cả --</option>
            <option value="Nhập hàng NCC">Nhập hàng NCC</option>
            <option value="Trả hàng NCC">Trả hàng NCC</option>
             <option value="Nhập & Trả hàng NCC">Nhập & Trả hàng NCC</option> <!-- ✅ thêm dòng mới -->
          </select>
        </div>
      </div>

      <div class="text-end mt-3">
        <button class="btn btn-secondary" @click="resetFilters">🔄 Làm mới</button>
      </div>
    </div>

    <!-- 🧾 Bảng hóa đơn -->
    <div class="table-responsive">
      <table class="table table-bordered table-hover align-middle">
        <thead class="table-primary text-center">
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
          <tr v-for="(hd, idx) in paginatedHoaDon" :key="hd.ma_hoa_don" class="text-center">
            <td>{{ (page - 1) * perPage + idx + 1 }}</td>
<td>
  <a href="#" class="link-primary fw-bold" @click.prevent="xuatAnhHoaDonNhap(hd)">
    {{ hd.ma_hoa_don }}
  </a>
</td>
<td>
  <a href="#" class="link-primary" @click.prevent="xuatAnhHoaDonNhap(hd)">
    {{ hd.so_hoa_don }}
  </a>
</td>
            <td>{{ hd.ma_nha_cung_cap }}</td>
            <td>{{ hd.ten_nha_cung_cap }}</td>
            <td>{{ formatDateTime(hd.ngay_tao_duong_lich) }}</td>

            <td>
              <span
                :class="{
                  'text-success fw-bold': hd.trang_thai === 'Nhập hàng NCC',
                  'text-danger fw-bold': hd.trang_thai === 'Trả hàng NCC',
                   'text-warning fw-bold': hd.trang_thai === 'Nhập & Trả hàng NCC', // ✅ thêm màu vàng
                }"
              >
                {{ hd.trang_thai }}
              </span>
            </td>
            <td class="text-end">{{ formatNum(hd.tong_cong) }}</td>
            <td>{{ hd.hinh_thuc_thanh_toan }}</td>
            <td>{{ hd.ghi_chu }}</td>
          </tr>
          <tr v-if="filteredHoaDon.length === 0">
            <td colspan="10" class="text-center text-muted py-3">Không có hóa đơn nào phù hợp</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 🔢 Phân trang -->
    <div class="pagination-wrapper text-center mt-3">
      <button class="btn btn-outline-primary btn-sm me-2" :disabled="page === 1" @click="prevPage">← Trước</button>
      <span>Trang {{ page }} / {{ totalPages }}</span>
      <button class="btn btn-outline-primary btn-sm ms-2" :disabled="page === totalPages" @click="nextPage">Sau →</button>
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
