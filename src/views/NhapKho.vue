<template>
  <div class="container py-4">
    <h2 class="text-center fw-bold text-primary mb-4">📦 NHẬP KHO HÀNG</h2>

    <!-- 🧾 Thông tin nhà cung cấp -->
    <div class="card p-3 mb-4 shadow-sm">
      <h5 class="fw-bold mb-3">🧾 Thông tin hóa đơn & nhà cung cấp</h5>
      <div class="row g-3">
        <div class="col-md-2">
          <label class="form-label">Mã HĐ</label>
          <input v-model="form.maHD" class="form-control" readonly />
        </div>
        <div class="col-md-2">
          <label class="form-label">Số HĐ</label>
          <input v-model="form.soHD" class="form-control" readonly />
        </div>
    <div class="col-md-3">
  <label class="form-label">TÊN NHÀ CUNG CẤP</label>
  <input
    list="tenNccList"
    v-model="form.tenNCC"
    @change="onNccChange"
    class="form-control form-control-sm"
    placeholder="VD: Công ty A"
  />
  <datalist id="tenNccList">
    <option v-for="ncc in dsNhaCungCap" :key="ncc.ten_nha_cung_cap" :value="ncc.ten_nha_cung_cap" />
  </datalist>
</div>
        <div class="col-md-3">
          <label class="form-label">Địa chỉ NCC</label>
          <input v-model="form.diaChi" class="form-control" @input="genMaNCC" placeholder="Địa chỉ" />
        </div>
        <div class="col-md-3">
  <label class="form-label">MÃ NHÀ CUNG CẤP</label>
  <input
    list="maNccList"
    v-model="form.maNCC"
    @change="onNccChange"
    class="form-control form-control-sm"
    placeholder="VD: NCC01"
  />
  <datalist id="maNccList">
    <option v-for="ncc in dsNhaCungCap" :key="ncc.ma_nha_cung_cap" :value="ncc.ma_nha_cung_cap" />
  </datalist>
</div>

        <div class="col-md-2">
          <label class="form-label">SĐT</label>
          <input v-model="form.sdt" class="form-control" placeholder="Số điện thoại" />
        </div>
        <div class="col-md-2">
          <label class="form-label">Công nợ</label>
         <input
  type="text"
  class="form-control"
  :value="formatView(form.congNo)"
  @input="formatLive($event, 'congNo', 'form')"
  placeholder="Công nợ"
/>
        </div>

        <div class="col-md-2">
  <label class="form-label">Trạng thái NCC</label>
  <input
    v-model="form.trangThaiNCC"
    class="form-control"
    readonly
    :class="{
      'text-danger fw-bold': form.trangThaiNCC.includes('Mình nợ'),
      'text-success fw-bold': form.trangThaiNCC.includes('NCC còn nợ'),
      'text-secondary fw-bold': form.trangThaiNCC.includes('Đã thanh toán')
    }"
  />
</div>

        <!-- 🔸 Ghi chú của NCC -->
<div class="col-md-4">
  <label class="form-label">Ghi chú NCC</label>
  <textarea
    v-model="form.ghiChuNCC"
    rows="1"
    class="form-control"
    placeholder="Ghi chú riêng cho nhà cung cấp..."
  ></textarea>
</div>

<!-- 🔸 Ghi chú hóa đơn -->
<div class="col-md-4">
  <label class="form-label">Ghi chú hóa đơn</label>
  <textarea
    v-model="form.ghiChuHoaDon"
    rows="1"
    class="form-control"
    placeholder="Ghi chú riêng cho hóa đơn này..."
  ></textarea>
</div>
      </div>
    </div>

    <!-- 📦 Nhập hàng -->
    <div class="card p-3 mb-4 shadow-sm">
      <h5 class="fw-bold mb-3">📦 Nhập hàng</h5>
      <div class="row g-3 align-items-end">
  <div class="col-md-3">
  <label class="form-label fw-bold">MÃ HÀNG (Tự sinh hoặc chọn)</label>
  <input
    list="maHangList"
    v-model="hang.maHang"
    @change="onHangChange"
    class="form-control form-control-sm fw-bold text-primary"
    placeholder="Chọn mã cũ hoặc tự sinh"
  />
  <datalist id="maHangList">
    <option
      v-for="hh in getHangHoaTheoNCC()"
      :key="hh.ma_hang"
      :value="hh.ma_hang"
    />
  </datalist>
</div>

<div class="col-md-3">
  <label class="form-label">TÊN HÀNG</label>
  <input
    list="tenHangList"
    v-model="hang.tenHang"
    @change="onTenHangChange"
    class="form-control form-control-sm"
    placeholder="Nhập hoặc chọn hàng..."
  />
  <datalist id="tenHangList">
    <option
      v-for="hh in getHangHoaTheoNCC()"
      :key="hh.ten_hang"
      :value="hh.ten_hang"
    />
  </datalist>
</div>
<div class="col-md-2 d-flex align-items-center">
  <div class="form-check mt-4">
    <input
      class="form-check-input"
      type="checkbox"
      id="nhapTheoLo"
      v-model="hang.nhapTheoLo"
    />
    <label class="form-check-label" for="nhapTheoLo">Nhập theo lô</label>
  </div>
</div>
<template v-if="hang.nhapTheoLo">
  <div class="col-md-3">
  <label class="form-label">Giá 1 lô</label>
  <input
    type="text"
    class="form-control"
    :value="formatView(hang.giaLo)"
    @input="formatLive($event, 'giaLo', 'hang'); tinhTheoLo()"  
    placeholder="VD: 420000"
  />
</div>

<!-- Số lô -->
<div class="col-md-2">
  <label class="form-label">Số lô</label>
  <input
    type="number"
    v-model.number="hang.soLo"
    @input="tinhTheoLo" 
    class="form-control"
    placeholder="VD: 10"
  />
</div>

<!-- Số cái / 1 lô -->
<div class="col-md-2">
  <label class="form-label">Số cái / 1 lô</label>
  <input
    type="number"
    v-model.number="hang.soCaiMotLo"
    @input="tinhTheoLo"  
    class="form-control"
    placeholder="VD: 4"
  />
</div>
</template>

        <div class="col-md-3">
          <label class="form-label">SL</label>
          <input v-model.number="hang.soLuong" type="number" class="form-control" />
        </div>
        <div class="col-md-3">
          <label class="form-label">Danh mục</label>
          <input v-model="hang.danhMuc" class="form-control" placeholder="VD: Áo thun" />
        </div>
        <div class="col-md-3">
          <label class="form-label">Size</label>
          <input v-model="hang.size" class="form-control" />
        </div>
        <div class="col-md-3">
          <label class="form-label">ĐVT</label>
          <input v-model="hang.dvt" class="form-control" placeholder="Cái" />
        </div>
        <div class="col-md-3">
          <label class="form-label">Giá nhập</label>
          <input
  type="text"
  class="form-control"
  :value="formatView(hang.giaNhap)"
  @input="formatLive($event, 'giaNhap', 'hang')"
  placeholder="Giá nhập"
/>
        </div>
        <div class="col-md-3">
  <label class="form-label">Lợi nhuận (%)</label>
  <input
    v-model.number="hang.loiNhuan"
    type="number"
    class="form-control"
    placeholder="% lời"
    @change="capNhatGiaBanTuPhanTram"
  />
</div>

        <div class="col-md-3">
          <label class="form-label">Đơn giá (bán)</label>
          <input
  type="text"
  class="form-control"
  :value="formatView(hang.donGia)"
  @input="formatLive($event, 'donGia', 'hang')"
  placeholder="Giá bán"
/>
        </div>
        <div class="col-md-2">
  <label class="form-label">GHI CHÚ NHẬP HÀNG</label>
  <textarea v-model="ghiChuNhap" class="form-control form-control-sm" rows="2"></textarea>
</div>

        <div class="col-md-2 d-flex gap-2">
          <button class="btn btn-success flex-fill" @click="themHang('Nhập')">📥 Nhập</button>
          <button class="btn btn-danger flex-fill" @click="themHang('Trả')">📤 Trả</button>
        </div>
      </div>
    </div>

    <!-- 📋 Chi tiết hàng nhập -->
    <div class="card p-3 mb-4 shadow-sm">
      <h5 class="fw-bold mb-3">📋 Chi tiết hàng nhập</h5>
      <table class="table table-bordered align-middle">
        <thead class="table-light text-center">
          <tr>
            <th>STT</th>
            <th>Mã hàng</th>
            <th>Tên hàng</th>
            <th>Số lượng</th>
            <th>Danh mục</th>
            <th>Size</th>
            <th>ĐVT</th>
            <th>Giá nhập</th>
            <th>Đơn giá</th>
            <th>Thành tiền</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in chiTiet" :key="i" class="text-center">
            <td>{{ i + 1 }}</td>
            <td>{{ item.maHang }}</td>
            <td>{{ item.tenHang }}</td>
            <td>{{ item.soLuong }}</td>
            <td>{{ item.danhMuc }}</td>
            <td>{{ item.size }}</td>
            <td>{{ item.dvt }}</td>
            <td>{{ format(item.giaNhap) }}</td>
            <td>{{ format(item.donGia) }}</td>
            <td class="fw-bold">{{ format(item.thanhTien) }}</td>
            <td :class="{'text-success fw-bold': item.trangThai==='Nhập', 'text-danger fw-bold': item.trangThai==='Trả'}">
              {{ item.trangThai }}
            </td>
          </tr>

          <!-- 💵 Hàng bổ sung sau khi xác nhận thanh toán -->
          
        </tbody>
      </table>

      <!-- Tổng kết -->
<div class="text-end pe-3">
  <p><b>Tạm tính:</b> {{ format(tamTinh) }} ₫</p>
  <p><b>Hàng trả:</b> {{ format(traLai) }} ₫</p>
  <p><b>Nợ cũ:</b> {{ format(form.congNo) }} ₫</p>
  <!-- 💰 Công nợ mới (ước tính) -->
<div class="col-md-12 text-end mt-1">
 <p
  class="fw-bold fs-6"
  :class="{
    'text-danger': congNoSauNhap < 0,
    'text-success': congNoSauNhap > 0,
    'text-secondary': congNoSauNhap === 0
  }"
>
  💰 Công nợ mới (ước tính):
  <span>{{ format(congNoSauNhap) }} ₫</span>
  <span v-if="congNoSauNhap < 0" class="ms-2 badge bg-danger">
    Mình nợ NCC
  </span>
  <span v-else-if="congNoSauNhap > 0" class="ms-2 badge bg-success">
    NCC còn nợ mình
  </span>

</p>

</div>

  <p><b>Trả tiền:</b> {{ format(form.daThanhToan ? form.traTien : 0) }} ₫</p>
  <p><b>Hình thức thanh toán:</b> 
    {{ form.daThanhToan ? form.hinhThuc : 'Chưa chọn' }}
  </p>
  <p class="fs-5"><b>Tổng cộng:</b> {{ format(tongCong) }} ₫</p>
</div>


    </div>

    <!-- 💰 Thanh toán -->
    <div class="card p-3 shadow-sm">
      <h5 class="fw-bold mb-3">💰 Thanh toán cho nhà cung cấp</h5>

      <div class="d-flex gap-3 mb-3" v-if="!form.daThanhToan">
        <button
          v-for="hinhthuc in ['Tiền mặt', 'Chuyển khoản', 'Nợ']"
          :key="hinhthuc"
          class="btn flex-fill"
          :class="{
            'btn-primary': thanhToan.hinhThuc === hinhthuc,
            'btn-outline-secondary': thanhToan.hinhThuc !== hinhthuc
          }"
          @click="chonHinhThuc(hinhthuc)"
        >
          {{ hinhthuc }}
        </button>
      </div>

      <div v-if="['Tiền mặt', 'Chuyển khoản'].includes(thanhToan.hinhThuc) && !form.daThanhToan" class="mb-3">
        <label class="form-label fw-bold">💵 Số tiền trả NCC</label>
        <input
  type="text"
  class="form-control"
  :value="formatView(thanhToan.soTien)"
  @input="formatLive($event, 'soTien', 'thanhToan')"
  placeholder="Nhập số tiền thanh toán"
/>

      </div>

      <div class="d-flex gap-3">
        <button class="btn btn-warning w-50 py-2 fw-bold" @click="xacNhanThanhToan" :disabled="form.daThanhToan">
          ✅ Xác nhận thanh toán
        </button>
        <button class="btn btn-success w-50 py-2 fw-bold" @click="xuatHoaDonNhap">
          📦 Xuất hóa đơn nhập
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      apiUrl:
        "https://script.google.com/macros/s/AKfycbz_vsTrvAjmYq51LTtQhe-nkdOzbMQcpMGslSU8tuSObycF9l5HT7cqYKhJ11uqrpL8/exec",
     form: {
  maHD: "",
  soHD: "",
  maNCC: "",
  tenNCC: "",
  sdt: "",
  diaChi: "",
  congNo: 0,
  trangThaiNCC: "", // 🆕 Trạng thái NCC (Mình nợ / NCC còn nợ / Đã thanh toán)

  ghiChuNCC: "", // 🆕 Ghi chú riêng cho NCC
  ghiChuHoaDon: "", // 🆕 Ghi chú riêng cho hóa đơn
  hinhThuc: "",
  traTien: 0,
  daThanhToan: false,
},
      thanhToan: { hinhThuc: "", soTien: 0 },
      hang: { maHang: "", tenHang: "", soLuong: 0, danhMuc: "", size: "", dvt: "", giaNhap: 0, donGia: 0 },
      chiTiet: [],
      hoaDonNCC: {},
    };
  },
  created() {
    this.genMaHoaDon();
  },
  computed: {
  tamTinh() {
    return this.chiTiet.filter(h => h.trangThai === "Nhập").reduce((s, h) => s + h.thanhTien, 0);
  },
  traLai() {
    return this.chiTiet.filter(h => h.trangThai === "Trả").reduce((s, h) => s + h.thanhTien, 0);
  },
congNoSauNhap() {
  // ✅ Công nợ mới = nợ cũ - tổng nhập + hàng trả + tiền trả NCC
  const noCu = Number(this.form.congNo || 0);
  const tongNhap = this.tamTinh;
  const traLai = this.traLai;
  const traTien = Number(this.form.traTien || 0);
  return noCu - tongNhap + traLai + traTien;
},


tongCong() {
  const noCu = Number(this.form.congNo || 0);
  const tongNhap = this.tamTinh;
  const traLai = this.traLai;
  const traTien = Number(this.form.traTien || 0);
  return noCu - tongNhap + traLai + traTien;
},

},
async mounted() {
  await this.loadDanhSach();
},
  methods: {
    formatLive(e, field, obj) {
  // Xóa ký tự không phải số
  const raw = e.target.value.replace(/[^\d]/g, '');
  const num = Number(raw || 0);
  // Cập nhật model (ví dụ this.hang.giaNhap)
  this[obj][field] = num;
  // Format lại hiển thị
  e.target.value = num ? num.toLocaleString('vi-VN') : '';
},
formatView(n) {
  return n ? n.toLocaleString('vi-VN') : '';
},
lamTronLenNghin(so) {
  if (!so) return 0;
  const remainder = so % 1000;
  return remainder === 0 ? so : so + (1000 - remainder);
},

tinhTheoLo() {
  if (this.hang.nhapTheoLo && this.hang.giaLo && this.hang.soLo && this.hang.soCaiMotLo) {
    // Tính tổng số lượng
    this.hang.soLuong = this.hang.soLo * this.hang.soCaiMotLo;

    // Tính giá nhập mỗi cái (đúng giá thực tế, KHÔNG làm tròn)
    const giaMotCai = this.hang.giaLo / this.hang.soCaiMotLo;

    this.hang.giaNhap = giaMotCai;

    // ✅ Cập nhật lại giá bán theo % + mã hàng
    this.capNhatGiaBanTuPhanTram();
    this.capNhatMaHang();
  }
},



    async loadDanhSach() {
    try {
      const [resNCC, resHang] = await Promise.all([
        fetch(`${this.apiUrl}?action=getNhaCungCap`),
        fetch(`${this.apiUrl}?action=getHangHoa`)
      ]);
      this.dsNhaCungCap = await resNCC.json();
      this.dsHangHoa = await resHang.json();
    } catch (err) {
      console.error("❌ Lỗi tải danh sách:", err);
    }
  },
onNccChange() {
  const input = (this.form.maNCC || this.form.tenNCC || "").trim().toLowerCase();
  const ncc = this.dsNhaCungCap.find(n =>
    (n.ma_nha_cung_cap && n.ma_nha_cung_cap.toLowerCase() === input) ||
    (n.ten_nha_cung_cap && n.ten_nha_cung_cap.toLowerCase() === input)
  );

  if (ncc) {
    this.form.maNCC = ncc.ma_nha_cung_cap || "";
    this.form.tenNCC = ncc.ten_nha_cung_cap || "";
    this.form.diaChi = ncc.dia_chi || "";
    this.form.sdt = ncc.so_dien_thoai || "";
    this.form.congNo = Number(ncc.cong_no) || 0;
    this.form.ghiChuNCC = ncc.ghi_chu || ""; // ✅ Chỉ ghi chú NCC
    this.form.trangThaiNCC = ncc.trang_thai || ""; // 🆕 Lấy trạng thái NCC từ sheet
  } else {
    this.form.maNCC = this.genMaNCCAuto();
    this.form.sdt = "";
    this.form.ghiChuNCC = "";
  }

  this.genSoHoaDon();
},



getHangHoaTheoNCC() {
  const maNCC = (this.form.maNCC || "").trim().toUpperCase();
  if (!maNCC) return this.dsHangHoa; // nếu chưa có NCC thì trả tất cả

  // ✅ chỉ lấy những hàng hóa có cùng mã NCC
  return this.dsHangHoa.filter(h => (h.ma_nha_cung_cap || "").toUpperCase() === maNCC);
},

onHangChange() {
  const input = (this.hang.maHang || "").trim().toLowerCase();
  const hh = this.dsHangHoa.find(h =>
    h.ma_hang && h.ma_hang.toLowerCase() === input
  );

  if (hh) {
    this.hang.tenHang = hh.ten_hang || "";
    this.hang.danhMuc = hh.danh_muc || "";
    this.hang.size = hh.size || "";
    this.hang.dvt = hh.dvt || "";
    this.hang.giaNhap = Number(hh.gia_goc) || 0;
    this.hang.donGia = Number(hh.don_gia) || 0;
    this.hang.maNcc = hh.ma_nha_cung_cap || "";

    const ncc = this.dsNhaCungCap.find(n => n.ma_nha_cung_cap === this.hang.maNcc);
    this.form.tenNCC = ncc ? ncc.ten_nha_cung_cap : "";
    this.form.diaChi = ncc ? ncc.dia_chi : "";
  }
},
onTenHangChange() {
  const input = (this.hang.tenHang || "").trim().toLowerCase();
  const hh = this.dsHangHoa.find(h =>
    h.ten_hang && h.ten_hang.toLowerCase() === input
  );

  if (hh) {
    this.hang.maHang = hh.ma_hang || "";
    this.hang.danhMuc = hh.danh_muc || "";
    this.hang.size = hh.size || "";
    this.hang.dvt = hh.dvt || "";
    this.hang.giaNhap = Number(hh.gia_goc) || 0;
    this.hang.donGia = Number(hh.don_gia) || 0;
    this.hang.maNcc = hh.ma_nha_cung_cap || "";

    const ncc = this.dsNhaCungCap.find(n => n.ma_nha_cung_cap === this.hang.maNcc);
    this.form.tenNCC = ncc ? ncc.ten_nha_cung_cap : "";
    this.form.diaChi = ncc ? ncc.dia_chi : "";
  }
},
// 📦 LẤY THÔNG TIN NHÀ CUNG CẤP TỪ SHEET
async getNCCByMa(ma) {
  if (!ma) return;
  try {
    const url = `${this.apiUrl}?action=getNCCByMa&ma=${encodeURIComponent(ma)}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log("📡 NCC từ sheet:", data);
    if (data && data.ma_nha_cung_cap) {
      this.form.tenNCC = data.ten_nha_cung_cap || "";
      this.form.diaChi = data.dia_chi || "";
      this.form.congNo = Number(data.cong_no) || 0;
      this.form.ghiChu = data.ghi_chu || "";
    }
  } catch (err) {
    console.error("❌ Lỗi lấy NCC:", err);
  }
},

// 📦 LẤY THÔNG TIN HÀNG HÓA TỪ SHEET
async getHangByMa(ma) {
  if (!ma) return;
  try {
    const url = `${this.apiUrl}?action=getHangByMa&ma=${encodeURIComponent(ma)}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log("📡 Hàng từ sheet:", data);
    if (data && data.ma_hang) {
      this.hang.tenHang = data.ten_hang || "";
      this.hang.danhMuc = data.danh_muc || "";
      this.hang.size = data.size || "";
      this.hang.dvt = data.dvt || "";
      this.hang.giaNhap = Number(data.gia_goc) || 0;
      this.hang.donGia = Number(data.don_gia) || 0;
    }
  } catch (err) {
    console.error("❌ Lỗi lấy hàng:", err);
  }
},
// 📦 LẤY THÔNG TIN NHÀ CUNG CẤP (tự phát hiện nhập mã hoặc tên)
async getNCCInfo() {
  const ma = (this.form.maNCC || "").trim().toUpperCase();
  const ten = (this.form.tenNCC || "").trim().toLowerCase();
  if (!ma && !ten) return;

  try {
    const url = `${this.apiUrl}?action=getNhaCungCap`;
    const res = await fetch(url);
    const list = await res.json();
    const found = list.find(n =>
      (n.ma_nha_cung_cap && n.ma_nha_cung_cap.toUpperCase() === ma) ||
      (n.ten_nha_cung_cap && n.ten_nha_cung_cap.toLowerCase() === ten)
    );
    console.log("📡 NCC khớp:", found);
    if (found) {
      this.form.maNCC = found.ma_nha_cung_cap || "";
      this.form.tenNCC = found.ten_nha_cung_cap || "";
      this.form.diaChi = found.dia_chi || "";
      this.form.congNo = Number(found.cong_no) || 0;
      this.form.ghiChu = found.ghi_chu || "";
    }
  } catch (err) {
    console.error("❌ Lỗi lấy thông tin NCC:", err);
  }
},

// 📦 LẤY THÔNG TIN HÀNG HÓA (tự phát hiện nhập mã hoặc tên)
async getHangInfo() {
  const ma = (this.hang.maHang || "").trim().toUpperCase();
  const ten = (this.hang.tenHang || "").trim().toLowerCase();
  if (!ma && !ten) return;

  try {
    const url = `${this.apiUrl}?action=getHangHoa`;
    const res = await fetch(url);
    const list = await res.json();
    const found = list.find(h =>
      (h.ma_hang && h.ma_hang.toUpperCase() === ma) ||
      (h.ten_hang && h.ten_hang.toLowerCase() === ten)
    );
    console.log("📡 Hàng khớp:", found);
    if (found) {
      this.hang.maHang = found.ma_hang || "";
      this.hang.tenHang = found.ten_hang || "";
      this.hang.danhMuc = found.danh_muc || "";
      this.hang.size = found.size || "";
      this.hang.dvt = found.dvt || "";
      this.hang.giaNhap = Number(found.gia_goc) || 0;
      this.hang.donGia = Number(found.don_gia) || 0;
    }
  } catch (err) {
    console.error("❌ Lỗi lấy thông tin hàng:", err);
  }
},

    format(n) {
      return n ? n.toLocaleString("vi-VN") : "0";
    },
    removeAccents(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  },

    genMaHoaDon() {
      const now = new Date();
      const pad = n => n.toString().padStart(2, "0");
      this.form.maHD = `HDN${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    },
  genMaNCC() {
  if (!this.form.tenNCC || !this.form.diaChi) return (this.form.maNCC = "");
  const t = this.removeAccents(this.form.tenNCC).split(" ");
  const a = this.removeAccents(this.form.diaChi).split(" ");
  this.form.maNCC = (t.map(w => w[0]).join("") + a.map(w => w[0]).join("")).toUpperCase().slice(0, 6);
  this.genSoHoaDon(); // ✅ cập nhật lại số hóa đơn mỗi khi đổi thông tin
  this.capNhatMaHang();
},


async genSoHoaDon() {
  const ma = (this.form.maNCC || "").trim().toUpperCase();
  if (!ma) {
    this.form.soHD = "";
    return;
  }

  try {
    // 🧩 Lấy danh sách hóa đơn tổng từ Sheet
    const res = await fetch(`${this.apiUrl}?action=getHoaDonTong`);
    const data = await res.json();

    // ✅ Lọc các HĐ có cùng mã NCC
    const hoaDonCungNCC = data.filter(hd => 
      (hd.ma_nha_cung_cap || "").toUpperCase() === ma
    );

    // ✅ Tìm STT lớn nhất trong danh sách cũ
    let stt = 1;
    if (hoaDonCungNCC.length > 0) {
      const soCuoi = hoaDonCungNCC.map(hd => {
        const match = (hd.so_hoa_don || "").match(/\d+$/);
        return match ? parseInt(match[0], 10) : 0;
      });
      stt = Math.max(...soCuoi) + 1;
    }

    // ✅ Format lại STT 2 chữ số (01, 02, ...)
    const sttFormatted = stt.toString().padStart(2, "0");

    // 🎯 Tạo số hóa đơn chuẩn
    this.form.soHD = `${ma}${sttFormatted}`;
    console.log(`✅ Số HĐ mới: ${this.form.soHD}`);
  } catch (err) {
    console.error("❌ Lỗi tạo số hóa đơn:", err);
    // fallback tạm
    this.form.soHD = `${ma}01`;
  }
},

 capNhatMaHang() {
  const tenNCC = (this.form.tenNCC || "").trim();
  if (!tenNCC) return (this.hang.maHang = "");

  const nhapTheoLo = this.hang.nhapTheoLo;
  const giaLo = Number(this.hang.giaLo) || 0;
  const soCaiMotLo = Number(this.hang.soCaiMotLo) || 0;
  const giaNhap = Number(this.hang.giaNhap) || 0;
  const loiNhuan = Number(this.hang.loiNhuan) || 0;

  // 🧩 1️⃣ Chữ cái đầu mỗi từ NCC (bỏ dấu, in hoa)
  const phan1 = this.removeAccents(tenNCC)
    .split(" ")
    .filter(w => w)
    .map(w => w[0].toUpperCase())
    .join("");

  // 🧩 2️⃣ Hai số cuối năm
  const phan2 = new Date().getFullYear().toString().slice(-2);

  // 🧩 3️⃣ Giá nhập ×2 (bỏ 3 số cuối)
  let phan3;
  if (nhapTheoLo) {
    const bo000 = Math.floor(giaLo / 1000);
    phan3 = bo000 * 2;
  } else {
    const bo000 = Math.floor(giaNhap / 1000);
    phan3 = bo000 * 2;
  }

  // 🧩 4️⃣ Nếu có tick nhập theo lô → số cái / 1 lô, không thì bỏ trống
  const phan4 = nhapTheoLo ? String(soCaiMotLo) : "";

  // 🧩 5️⃣ Mã giá bán ẩn (chuẩn mới)
  let giaNhap1Cai = nhapTheoLo ? (giaLo / (soCaiMotLo || 1)) : giaNhap;
  let giaBan = giaNhap1Cai * (1 + loiNhuan / 100);

  // Làm tròn lên nghìn kế tiếp
  giaBan = this.lamTronLenNghin(giaBan);

  // Lấy phần ngàn (VD: 53 000 → 53)
  const base = Math.floor(giaBan / 1000);

  // Cộng X theo độ dài
  const len = base.toString().length;
  const cong = len === 1 ? 1 : len === 2 ? 10 : len === 3 ? 100 : 1000;

  // Kết hợp
  const giaMa = base + cong;
  const random = Math.floor(Math.random() * 9) + 1;
  const phan5 = random.toString() + giaMa.toString();

  // 🎯 Mã hoàn chỉnh
  this.hang.maHang = `${phan1}${phan2}${phan3}${phan4}${phan5}`;
},




// Khi thay đổi % lợi nhuận → tự tính lại giá bán
capNhatGiaBanTuPhanTram() {
  const { giaNhap, loiNhuan, donGia } = this.hang;
  if (!giaNhap || loiNhuan == null) return;

  let giaMoi = giaNhap * (1 + loiNhuan / 100);

  // 🔹 Làm tròn lên nghìn kế tiếp (VD: 50002 → 51000)
  giaMoi = this.lamTronLenNghin(giaMoi);

  if (giaMoi !== donGia) this.hang.donGia = giaMoi;
},



// Khi thay đổi giá bán → tự tính % lợi nhuận
capNhatPhanTramTuGiaBan() {
  const { giaNhap, donGia, loiNhuan } = this.hang;
  if (!giaNhap || !donGia) return;

  const phanTramMoi = Number((((donGia - giaNhap) / giaNhap) * 100).toFixed(1));
  if (phanTramMoi !== loiNhuan) this.hang.loiNhuan = phanTramMoi;
},


// Khi thay đổi giá nhập → cập nhật lại % lợi nhuận (nếu đang có giá bán)
capNhatTuGiaNhap() {
  const { giaNhap, donGia } = this.hang;
  if (donGia && giaNhap) {
    this.hang.loiNhuan = Number((((donGia - giaNhap) / giaNhap) * 100).toFixed(1));
  }
}
,

    chonHinhThuc(ht) {
      this.thanhToan.hinhThuc = ht;
      if (ht === "Nợ") this.thanhToan.soTien = 0;
    },
   themHang(trangThai) {
  if (!this.hang.tenHang || !this.hang.soLuong || !this.hang.giaNhap)
    return alert("⚠️ Điền đủ thông tin hàng!");
  if (!this.hang.maHang) this.capNhatMaHang();

  const thanhTien = this.hang.soLuong * this.hang.giaNhap;
  const hangFull = {
    ...this.hang,
    maNcc: this.form.maNCC,  // ✅ gán mã NCC đang chọn
    tenNcc: this.form.tenNCC, // ✅ để backend biết NCC
    ghiChuNhap: this.ghiChuNhap || "", // ✅ thêm ghi chú nhập hàng
    thanhTien,
    trangThai
  };

  // Nếu trùng mã hàng + trạng thái → cộng dồn
  const existing = this.chiTiet.find(h => h.maHang === hangFull.maHang && h.trangThai === trangThai);
  if (existing) {
    existing.soLuong += hangFull.soLuong;
    existing.thanhTien += hangFull.thanhTien;
  } else {
    this.chiTiet.push(hangFull);
  }

  // Reset lại form nhập hàng
  this.hang = { maHang: "", tenHang: "", soLuong: 0, danhMuc: "", size: "", dvt: "", giaNhap: 0, donGia: 0 };
  this.ghiChuNhap = ""; // ✅ reset ghi chú
},

    xacNhanThanhToan() {
      if (!this.thanhToan.hinhThuc) return alert("⚠️ Chọn hình thức thanh toán!");
      if (["Tiền mặt", "Chuyển khoản"].includes(this.thanhToan.hinhThuc) && !this.thanhToan.soTien)
        return alert("⚠️ Nhập số tiền thanh toán!");
      this.form.hinhThuc = this.thanhToan.hinhThuc;
      this.form.traTien = this.thanhToan.soTien;
      this.form.daThanhToan = true;
      alert("✅ Đã xác nhận thanh toán!");
    },
async xuatHoaDonNhap() {
  console.log("🚀 Gọi hàm xuatHoaDonNhap()");

  // ✅ Kiểm tra loại hóa đơn
  const coNhap = this.chiTiet.some(h => h.trangThai === "Nhập");
  const chiTra = this.chiTiet.every(h => h.trangThai === "Trả");

  // ✅ Nếu chỉ có trả hàng → bỏ qua xác nhận thanh toán
  if (!coNhap && chiTra) {
    this.form.daThanhToan = true;
    this.form.hinhThuc = "Trả hàng NCC";
    this.form.traTien = 0;
  }

  // ✅ Nếu có nhập (hoặc nhập + trả) mà chưa xác nhận thanh toán thì dừng
  if (coNhap && !this.form.daThanhToan) {
    return alert("⚠️ Cần xác nhận thanh toán trước khi xuất hóa đơn nhập hàng!");
  }

  // ✅ Chuẩn bị dữ liệu gửi đi
 const data = {
  ma_hoa_don: this.form.maHD,
  so_hoa_don: this.form.soHD,
  ma_nha_cung_cap: this.form.maNCC,
  ten_nha_cung_cap: this.form.tenNCC,
  so_dien_thoai: this.form.sdt,
  dia_chi: this.form.diaChi,
  cong_no: this.form.congNo,
  ghi_chu_ncc: this.form.ghiChuNCC, // 🆕 Ghi chú NCC
  ghi_chu_hoa_don: this.form.ghiChuHoaDon, // 🆕 Ghi chú hóa đơn
    trang_thai_ncc: this.form.trangThaiNCC, // 🆕 gửi kèm cho BE
  tam_tinh: this.tamTinh,
  hang_tra: this.traLai,
  tong_cong: this.tongCong,
  tra_tien: this.form.traTien,
  hinh_thuc_thanh_toan: this.form.hinhThuc,
  trang_thai_tonghop: coNhap ? "Nhập hàng NCC" : "Trả hàng NCC",
  chi_tiet: this.chiTiet,
};


  console.log("📦 Payload gửi đi:", data);

  // ✅ Gửi theo kiểu form-data (giống Postman)
  const formData = new FormData();
  formData.append("action", "xuatHoaDonNhapHang");
  formData.append("payload", JSON.stringify(data));

  try {
    await fetch(this.apiUrl, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    });

    alert("✅ Đã gửi yêu cầu nhập hàng! Dữ liệu sẽ được ghi sau vài giây.");

    // ✅ Reset form sau khi gửi
    this.genMaHoaDon();
    this.form = {
  maHD: "",
  soHD: "",
  maNCC: "",
  tenNCC: "",
  sdt: "",
  diaChi: "",
  congNo: 0,
  trangThaiNCC: "",      // 🆕 reset trạng thái NCC
  ghiChuNCC: "",         // 🆕 reset ghi chú NCC
  ghiChuHoaDon: "",      // 🆕 reset ghi chú hóa đơn
  hinhThuc: "",
  traTien: 0,
  daThanhToan: false,
};

    this.thanhToan = { hinhThuc: "", soTien: 0 };
    this.chiTiet = [];

    console.log("✅ Đã gửi xong request và reset form!");
  } catch (err) {
    console.error("❌ Fetch error:", err);
    alert("❌ Gửi dữ liệu thất bại! Kiểm tra console log.");
  }
},


  },
watch: {
  'hang.tenHang': 'capNhatMaHang',
  'hang.soLuong': 'capNhatMaHang',
  'hang.dvt': 'capNhatMaHang',

  // Khi thay đổi giá nhập → cập nhật giá bán theo % và mã hàng
  'hang.giaNhap': function() {
    this.tinhTheoLo(); // ✅ nếu có tick nhập theo lô thì auto tính
    this.capNhatGiaBanTuPhanTram(); // ✅ chỉ còn chiều này thôi
    this.capNhatMaHang();
  },

  // ❌ Bỏ chiều ngược (giá bán → %)
  // Nếu người dùng nhập giá bán thì không tính lại % nữa
  'hang.donGia': function() {
    this.capNhatMaHang(); // chỉ cập nhật mã hàng thôi
  },

  // Khi đổi % lợi nhuận → cập nhật giá bán theo %
  'hang.loiNhuan': function() {
    this.capNhatGiaBanTuPhanTram();
    this.capNhatMaHang();
  },

  // Khi đổi NCC → sinh lại mã hàng
  'form.tenNCC': 'capNhatMaHang'
}


};
</script>

<style scoped>
.card {
  border-radius: 12px;
}
.table th,
.table td {
  text-align: center;
}
</style>
