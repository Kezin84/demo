<template>

  <div class="container-xl py-4">
    <h2 class="text-center fw-bold mb-4 title-gradient">HÓA ĐƠN BÁN HÀNG</h2>

    <div class="row g-4">
      <!-- CỘT 1: THÔNG TIN KHÁCH -->
      <div class="col-md-4">
        <div class="panel">
          <div class="panel__header">THÔNG TIN KHÁCH HÀNG</div>
          <div class="panel__body">
            <div class="mb-3">
              <label class="form-label">MÃ HÓA ĐƠN</label>
              <input v-model="maHoaDon" class="form-control form-control-sm" readonly />
              
            </div>
            <div class="mb-3">
  <label class="form-label">SỐ HÓA ĐƠN</label>
  <input v-model="soHoaDon" class="form-control form-control-sm" placeholder="VD: 0012/HĐB/10-2025" />
</div>
<div class="mb-3">
  <label class="form-label">📁 Import từ Excel</label>
  <input type="file" accept=".xlsx, .xls" @change="importExcel" class="form-control form-control-sm" />
</div>

<div class="mb-3">
  <label class="form-label">MÃ KHÁCH HÀNG</label>
  <input list="maKhachList" v-model="maKhach" @change="onKhachChange"
    class="form-control form-control-sm" placeholder="VD: KH001" />
  <datalist id="maKhachList">
    <option v-for="kh in dsKhachHang" :key="kh.ma_khach_hang" :value="kh.ma_khach_hang" />
  </datalist>
</div>
      <div class="mb-3">
  <label class="form-label">TÊN KHÁCH HÀNG</label>
  <input list="tenKhachList" v-model="tenKhach" @change="onKhachChange"
    class="form-control form-control-sm" placeholder="VD: Lê Phi Sơn" />
  <datalist id="tenKhachList">
    <option v-for="kh in dsKhachHang" :key="kh.ten_khach_hang" :value="kh.ten_khach_hang" />
  </datalist>
</div>

            <div class="mb-3">
              <label class="form-label">SỐ ĐIỆN THOẠI</label>
              <input v-model="sdt" class="form-control form-control-sm" />
            </div>
            <div class="mb-3">
  <label class="form-label">ĐỊA CHỈ KHÁCH HÀNG</label>
  <input v-model="diaChiKhach" class="form-control form-control-sm" placeholder="Nhập địa chỉ khách hàng..." />
</div>

            <div class="mb-3">
              <label class="form-label">NỢ CŨ</label>
              <input :value="formatNum(noCu)" @input="formatNumInput($event, 'noCu')" class="form-control form-control-sm" />
            </div>

            <div>
              <label class="form-label">GHI CHÚ KHÁCH HÀNG</label>
              <textarea v-model="ghiChuKhach" class="form-control form-control-sm" rows="3"></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- CỘT 2: FORM NHẬP HÀNG -->
      <div class="col-md-4">
        <div class="panel">
          <div class="panel__header">FORM NHẬP HÀNG</div>
          <div class="panel__body">
            <div class="mb-3">
  <label class="form-label">MÃ HÀNG</label>
  <div class="input-group input-group-sm">
    <input list="hangOptions" v-model="maHang" @change="onHangChange"
      class="form-control form-control-sm" placeholder="Chọn hoặc nhập..." />
    <button class="btn btn-outline-primary" type="button" @click="tuSinhMaHang">
      🔄 Tạo mã
    </button>
  </div>
  <datalist id="hangOptions">
    <option v-for="hh in dsHangHoa" :key="hh.ma_hang" :value="hh.ma_hang" />
  </datalist>
</div>

       <div class="mb-3">
  <label class="form-label">TÊN HÀNG</label>
  <input list="tenHangList" v-model="tenHang" @change="onTenHangChange"
         class="form-control form-control-sm" placeholder="Nhập hoặc chọn hàng..." />
  <datalist id="tenHangList">
    <option v-for="hh in dsHangHoa" :key="hh.ma_hang" :value="hh.ten_hang" />
  </datalist>
</div>



            <div class="mb-3">
              <label class="form-label">DANH MỤC</label>
              <input v-model="danhMuc" class="form-control form-control-sm" placeholder="Nhập danh mục..." />
            </div>

        <div class="mb-3">
  <label class="form-label">MÃ NHÀ CUNG CẤP</label>
  <div class="input-group input-group-sm">
    <input
      list="maNccList"
      v-model="maNcc"
      @change="onNccChange"
      class="form-control form-control-sm"
      placeholder="VD: NCC01"
    />
    <button class="btn btn-outline-secondary" type="button" @click="taoMaNCC">🧩TẠO MÃ NCC</button>
  </div>
  <datalist id="maNccList">
    <option v-for="ncc in dsNhaCungCap" :key="ncc.ma_nha_cung_cap" :value="ncc.ma_nha_cung_cap" />
  </datalist>
</div>


            <div class="mb-3">
              <label class="form-label">NHÀ CUNG CẤP</label>
              <input v-model="nhaCungCap" class="form-control form-control-sm"  />
            </div>

            <div class="mb-3">
              <label class="form-label">ĐỊA CHỈ NCC</label>
              <input v-model="diaChiNcc" class="form-control form-control-sm"  />
            </div>

            <div class="row g-3 mb-1">
              <div class="col-6">
                <label class="form-label">DVT</label>
                <input v-model="dvt" class="form-control form-control-sm"  />
              </div>
              <div class="col-6">
                <label class="form-label">SIZE</label>
                <input v-model="size" class="form-control form-control-sm"  />
              </div>
            </div>

            <div class="row g-3 mb-1">
              <div class="col-6">
                <label class="form-label">TRONG KHO</label>
                <input v-model="soLuongKho" class="form-control form-control-sm"  />
              </div>
              <div class="col-6">
                <label class="form-label">SỐ LƯỢNG</label>
                <input v-model.number="soLuong" type="number" class="form-control form-control-sm" />
              </div>
            </div>
<div class="row g-3 mb-1">
  <div class="col-6">
    <label class="form-label">GIÁ GỐC</label>
    <input :value="formatNum(giaGoc)" @input="formatNumInput($event, 'giaGoc')"class="form-control form-control-sm"  />
  </div>
  <div class="col-6">
    <label class="form-label">%</label>
   <input v-model.number="phanTram" type="number" class="form-control form-control-sm" @input="capNhatGiaNhapTheoGiaBan" />

  </div>
</div>
            <div class="row g-3 mb-1">
              <div class="col-6">
                <label class="form-label">ĐƠN GIÁ</label>
                <input :value="formatNum(donGia)" @input="formatNumInput($event, 'donGia')" class="form-control form-control-sm" />
              </div>
              <div class="col-6">
                <label class="form-label">GIẢM GIÁ</label>
                <input :value="formatNum(giamGia)" @input="formatNumInput($event, 'giamGia')" class="form-control form-control-sm" />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">GHI CHÚ HÀNG</label>
              <textarea v-model="ghiChuHang" rows="2" class="form-control form-control-sm"></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">GHI CHÚ HÓA ĐƠN</label>
              <textarea v-model="ghiChuDon" rows="2" class="form-control form-control-sm"></textarea>
            </div>

            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary flex-fill" @click="traHang">TRẢ HÀNG</button>
              <button v-if="editIndex===null" class="btn btn-success flex-fill" @click="themHang">MUA HÀNG</button>
              <button v-else class="btn btn-warning flex-fill" @click="capNhatHang">CẬP NHẬT</button>
            </div>
          </div>
        </div>
      </div>

      <!-- CỘT 3: CHI TIẾT + THANH TOÁN -->
      <div class="col-md-4">
        <div class="panel">
          <div class="panel__header">CHI TIẾT HÓA ĐƠN</div>
          <div class="panel__body">
           <div class="table-responsive mb-3">
  <table class="table table-bordered table-sm text-center align-middle">
    <thead>
      <tr>
        <th>STT</th>
        <th>TÊN HÀNG</th>
        <th>SIZE</th>
        <th>SL</th>
        <th>DVT</th>
        <th>THÀNH TIỀN</th>
        <th>TT</th>
        <th>HÀNH ĐỘNG</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="chiTiet.length===0">
        <td colspan="8" class="text-muted py-3">Chưa có sản phẩm</td>
      </tr>
      <tr v-for="(item, i) in chiTiet" :key="i" @click="moModalChinhSua(i)" style="cursor:pointer">

        <td>{{ i + 1 }}</td>
        <td class="text-start">{{ item.tenHang }}</td>
        <td>{{ item.size }}</td>
        <td>{{ item.soLuong }}</td>
        <td>{{ item.dvt }}</td>
        <td :class="item.trangThai === 'Mua' ? 'text-success' : 'text-danger'">
          {{ formatNum(item.thanhTien) }}
        </td>
        <td>
          <span :class="item.trangThai === 'Mua' ? 'badge bg-success' : 'badge bg-danger'">
            {{ item.trangThai }}
          </span>
        </td>
        <td>
         <button class="btn btn-sm btn-warning me-1" @click="moModalChinhSua(i)">✏️</button>

          <button class="btn btn-sm btn-danger" @click="xoaHang(i)">🗑️</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>


            <ul class="list-group list-group-sm calc-list mb-3">
              <li class="list-group-item d-flex justify-content-between"><span>TỔNG GIẢM GIÁ</span><strong>{{formatNum(tongGiamGia)}}</strong></li>
              <li class="list-group-item d-flex justify-content-between"><span>TẠM TÍNH</span><strong>{{formatNum(tamTinh)}}</strong></li>
              <li class="list-group-item d-flex justify-content-between"><span>HÀNG TRẢ</span><strong>{{formatNum(hangTra)}}</strong></li>
              <li class="list-group-item d-flex justify-content-between"><span>NỢ CŨ</span><strong>{{formatNum(noCu)}}</strong></li>
              <li class="list-group-item d-flex justify-content-between"><span>KHÁCH TRẢ</span><strong>{{formatNum(khachTra)}}</strong></li>
              <li class="list-group-item d-flex justify-content-between"><span>HÌNH THỨC THANH TOÁN</span><strong>{{hinhThuc||'-'}}</strong></li>
              <li class="list-group-item d-flex justify-content-between total-row">
                <span class="fw-bold">TỔNG CỘNG</span><span class="fw-bold text-danger">{{formatNum(tongCong)}}</span>
              </li>
            </ul>

            <div class="border rounded p-3 bg-light">
              <h6 class="fw-bold mb-2 text-primary">THANH TOÁN CÔNG NỢ</h6>
              <div class="mb-2">
                <label class="form-label mb-1">HÌNH THỨC</label>
                <div class="btn-group w-100">
                  <button v-for="opt in ['Tiền mặt','Chuyển khoản','Nợ']" :key="opt"
                    class="btn btn-outline-secondary btn-sm"
                    :class="{active:hinhThucThanhToan===opt}"
                    @click="chonHinhThuc(opt)">{{opt}}</button>
                </div>
              </div>
              <div class="mb-2" v-if="hinhThucThanhToan!=='Nợ'">
                <label class="form-label mb-1">SỐ TIỀN KHÁCH TRẢ</label>
                <input :value="formatNum(tienThanhToan)" @input="formatNumInput($event, 'tienThanhToan')" class="form-control form-control-sm" />
              </div>
              <button class="btn btn-warning w-100 mt-2" @click="xacNhanThanhToan">XÁC NHẬN THANH TOÁN</button>
            </div>
            <button class="btn btn-danger w-100 mt-2" @click="xuatAnhHoaDonGiay">
  📄 XUẤT ẢNH HÓA ĐƠN KIỂU GIẤY
</button>
            <button class="btn btn-primary w-100 mt-3" @click="xuatHoaDonTong">XUẤT HÓA ĐƠN</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- TEMPLATE XUẤT ẢNH HÓA ĐƠN -->
<!-- MODAL CHỈNH SỬA HÀNG -->
<!-- MODAL CHỈNH SỬA HÀNG -->
<!-- MODAL CHỈNH SỬA HÀNG -->
<div class="modal fade" id="editModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-primary text-white py-2">
        <h5 class="modal-title">✏️ Chỉnh sửa sản phẩm</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body">
        <!-- HÀNG 1 -->
        <div class="row g-2 mb-2">
          <div class="col-6">
            <label class="form-label">Mã hàng</label>
            <input v-model="editItem.maHang" class="form-control form-control-sm" readonly />
          </div>
          <div class="col-6">
            <label class="form-label">Tên hàng</label>
            <input v-model="editItem.tenHang" class="form-control form-control-sm" readonly />
          </div>
        </div>

        <!-- HÀNG 2 -->
        <div class="row g-2 mb-2">
          <div class="col-6">
            <label class="form-label">Size</label>
            <input v-model="editItem.size" class="form-control form-control-sm" readonly />
          </div>
          <div class="col-6">
            <label class="form-label">ĐVT</label>
            <input v-model="editItem.dvt" class="form-control form-control-sm" readonly />
          </div>
        </div>

        <!-- HÀNG 3 -->
        <div class="row g-2 mb-2">
          <div class="col-6">
            <label class="form-label">Số lượng</label>
            <input v-model.number="editItem.soLuong" type="number" class="form-control form-control-sm" />
          </div>
          <div class="col-6">
            <label class="form-label">Đơn giá</label>
            <input v-model.number="editItem.donGia" type="number" class="form-control form-control-sm" />
          </div>
        </div>

        <!-- HÀNG 4 -->
        <div class="row g-2 mb-2">
          <div class="col-6">
            <label class="form-label">Giảm giá</label>
            <input v-model.number="editItem.giamGia" type="number" class="form-control form-control-sm" />
          </div>
          <div class="col-6">
            <label class="form-label">Trạng thái</label>
            <select v-model="editItem.trangThai" class="form-select form-select-sm">
              <option value="Mua">Mua</option>
              <option value="Trả">Trả</option>
            </select>
          </div>
        </div>

        <!-- GHI CHÚ -->
        <div class="mb-2">
          <label class="form-label">Ghi chú</label>
          <textarea v-model="editItem.ghiChuDon" class="form-control form-control-sm" rows="2"></textarea>
        </div>
      </div>

      <div class="modal-footer py-2 d-flex justify-content-between">
        <button class="btn btn-danger btn-sm" @click="xoaTuModal">🗑️ Xóa sản phẩm</button>
        <div>
          <button class="btn btn-secondary btn-sm me-1" data-bs-dismiss="modal">Đóng</button>
          <button class="btn btn-success btn-sm" @click="luuChinhSua">Lưu thay đổi</button>
        </div>
      </div>
    </div>
  </div>
</div>



</template>

<script>
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import { nextTick } from "vue"; // ⚡️ Thêm dòng này

export default {
  data(){
    return{
      apiUrl:"https://script.google.com/macros/s/AKfycbz_vsTrvAjmYq51LTtQhe-nkdOzbMQcpMGslSU8tuSObycF9l5HT7cqYKhJ11uqrpL8/exec",
      maHoaDon:"", soHoaDon: "", maKhach: "",tenKhach:"",sdt:"",diaChiKhach: "",noCu:0,ghiChuKhach:"",
      dsKhachHang:[],dsHangHoa:[],dsNhaCungCap:[],
      maHang:"",tenHang:"", danhMuc: "",dvt:"",size:"",soLuongKho:0,soLuong:0,donGia:0,giamGia:0,giaGoc: 0,           // 🟢 thêm dòng này
    phanTram: 0,         // 🟢 thêm dòng này
      maNcc:"",nhaCungCap:"",diaChiNcc:"",
      khachTra:0,hinhThuc:"",ghiChuDon:"",ghiChuHang:"",chiTiet:[],
      tienThanhToan:0,hinhThucThanhToan:"",daXacNhanThanhToan:false,
      editItem: {},  // <== Dùng cho modal
      editIndex:null
    };
  },
  computed:{
    tamTinh(){return this.chiTiet.filter(i=>i.trangThai==="Mua").reduce((s,i)=>s+i.thanhTien,0);},
    hangTra(){return this.chiTiet.filter(i=>i.trangThai==="Trả").reduce((s,i)=>s+i.thanhTien,0);},
    tongGiamGia(){return this.chiTiet.reduce((s,i)=>s+(Number(i.giamGia)||0),0);},
    tongCong(){return this.tamTinh-this.hangTra+Number(this.noCu||0)-Number(this.khachTra||0);}
  },



  methods:{


formatNumInput(e, field) {
  let val = e.target.value.replace(/[^\d]/g, "");
  this[field] = val ? Number(val) : 0;
  e.target.value = new Intl.NumberFormat().format(this[field]);

  // ✅ Khi người dùng nhập "đơn giá" thì tự động cập nhật "giá gốc" theo %
  if (field === "donGia") {
    this.capNhatGiaNhapTheoGiaBan();
  }
}

,
 capNhatGiaNhapTheoGiaBan() {
  const donGia = Number(this.donGia) || 0;
  const phanTram = Number(this.phanTram) || 0;

  if (donGia > 0 && phanTram >= 0) {
    // Giá gốc = giá bán / (1 + % lợi nhuận)
    let giaGoc = donGia / (1 + phanTram / 100);

    // ✅ Làm tròn xuống đến đơn vị 1.000 đồng (bỏ phần thập phân)
    giaGoc = Math.floor(giaGoc);

    this.giaGoc = giaGoc;
  } else {
    this.giaGoc = 0;
  }
},

    formatDateTimeVN() {
  const now = new Date();
  const pad = n => String(n).padStart(2, "0");
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
},
  capNhatGiaBanTheoPhanTram() {
    if (this.giaGoc > 0 && this.phanTram >= 0) {
      let giaMoi = this.giaGoc * (1 + this.phanTram / 100);

      // Chỉ làm tròn đơn giá lên nghìn kế tiếp
      const remainder = giaMoi % 1000;
      if (remainder > 0) giaMoi += 1000 - remainder;

      this.donGia = giaMoi;
    }
  },


capNhatNguocTuDonGia() {
  if (this.donGia > 0 && this.phanTram > 0 && !this.giaGoc) {
    this.giaGoc = Math.round(this.donGia / (1 + this.phanTram / 100));
  } else if (this.donGia > 0 && this.giaGoc > 0) {
    this.phanTram = (((this.donGia - this.giaGoc) / this.giaGoc) * 100).toFixed(1);
  }
},

taoMaNCC() {
  const ten = (this.nhaCungCap || "").trim();
  const diaChi = (this.diaChiNcc || "").trim();
  if (!ten || !diaChi) {
    alert("⚠️ Vui lòng nhập tên và địa chỉ nhà cung cấp trước khi tạo mã!");
    return;
  }

  const getInitials = (str) =>
    str
      .normalize("NFD") // bỏ dấu tiếng Việt
      .replace(/[\u0300-\u036f]/g, "")
      .split(/\s+/)
      .map((w) => w[0]?.toUpperCase() || "")
      .join("");

  const tenPart = getInitials(ten);
  const diaChiPart = getInitials(diaChi);

  this.maNcc = (tenPart + diaChiPart).toUpperCase().slice(0, 8);
},

     tuSinhMaKhach() {
    if (!this.tenKhach || !this.diaChiKhach) return;
      
    const removeAccents = (str) =>
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const initialsTen = removeAccents(this.tenKhach)
      .split(/\s+/)
      .filter(w => w.trim() !== "")
      .map(w => w[0].toUpperCase())
      .join("");

    const initialsDiaChi = removeAccents(this.diaChiKhach)
      .split(/\s+/)
      .filter(w => w.trim() !== "")
      .map(w => w[0].toUpperCase())
      .join("");

    this.maKhach = initialsTen + initialsDiaChi;
  },
 tuSinhMaHang() {
  if (!this.nhaCungCap || !this.tenHang) return;

  const removeAccents = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // 🧩 [1] Chữ cái đầu NCC (viết hoa, bỏ dấu)
  const initials = removeAccents(this.nhaCungCap)
    .split(/\s+/)
    .filter(w => w)
    .map(w => w[0].toUpperCase())
    .join("");
  const phan1 = initials || "XX";

  // 🧩 [2] Hai số cuối của năm
  const phan2 = new Date().getFullYear().toString().slice(-2);

  // 🧩 [3] Giá nhập 1 cái × 2 (bỏ 3 số cuối)
  const giaNhap = Number(this.giaGoc) || 0;
  const bo000 = Math.floor(giaNhap / 1000);
  const phan3 = bo000 * 2;

  // 🧩 [4] Không có ĐVT → bỏ qua
  const phan4 = "";

  // 🧩 [5] Mã giá bán ẩn
  const loiNhuan = Number(this.phanTram) || 0;
  let giaBan = giaNhap * (1 + loiNhuan / 100);

  // Làm tròn lên nghìn kế tiếp
  const remainder = giaBan % 1000;
  if (remainder > 0) giaBan += 1000 - remainder;

  const base = Math.floor(giaBan / 1000);
  const len = base.toString().length;
  const cong = len === 1 ? 1 : len === 2 ? 10 : len === 3 ? 100 : 1000;

  const random = Math.floor(Math.random() * 9) + 1;
  const phan5 = random.toString() + (base + cong).toString();

  // ✅ Mã hàng cuối cùng
  this.maHang = `${phan1}${phan2}${phan3}${phan4}${phan5}`;
},



  onNccChange() {
  const input = (this.maNcc || this.nhaCungCap || "").trim().toLowerCase();

  // 🔹 Tìm NCC trong danh sách
  const ncc = this.dsNhaCungCap.find(
    n =>
      (n.ma_nha_cung_cap && n.ma_nha_cung_cap.toLowerCase() === input) ||
      (n.ten_nha_cung_cap && n.ten_nha_cung_cap.toLowerCase() === input)
  );

  if (ncc) {
    // ✅ Nếu có sẵn trong danh sách → tự điền thông tin
    this.maNcc = ncc.ma_nha_cung_cap || "";
    this.nhaCungCap = ncc.ten_nha_cung_cap || "";
    this.diaChiNcc = ncc.dia_chi || "";
  } else {
    // 🆕 Nếu NCC mới → tự sinh mã NCC từ chữ cái đầu của tên
    if (this.nhaCungCap) {
      const initials = this.nhaCungCap
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .split(/\s+/)
        .filter(w => w.trim() !== "")
        .map(w => w[0].toUpperCase())
        .join("");
      this.maNcc = initials;
    } else {
      this.maNcc = "";
      this.diaChiNcc = "";
    }
  }

  // ✅ Cập nhật lại mã hàng vì mã hàng phụ thuộc vào mã NCC

},

 onTenHangChange() {
  const ten = (this.tenHang || "").trim().toLowerCase();
  if (!ten) return;

  // 🔹 Tìm hàng trong danh sách
  const hh = this.dsHangHoa.find(h => 
    h.ten_hang && h.ten_hang.trim().toLowerCase() === ten
  );

  if (hh) {
    this.maHang = hh.ma_hang || "";
    this.dvt = hh.dvt || "";
    this.size = hh.size || "";
    this.soLuongKho = Number(hh.so_luong_kho) || 0;
    this.donGia = Number(hh.don_gia) || 0;
    this.danhMuc = hh.danh_muc || "";
    this.maNcc = hh.ma_nha_cung_cap || "";

    // 🔹 Lấy thông tin nhà cung cấp tương ứng
    const ncc = this.dsNhaCungCap.find(n => n.ma_nha_cung_cap === this.maNcc);
    this.nhaCungCap = ncc ? ncc.ten_nha_cung_cap : "";
    this.diaChiNcc = ncc ? (ncc.dia_chi || "") : "";

  } else {
    // 🔹 Nếu hàng chưa tồn tại, reset các ô và tạo mã mới
    this.maHang = "";
    this.dvt = "";
    this.size = "";
    this.soLuongKho = 0;
    this.donGia = 0;
    this.danhMuc = "";
    this.nhaCungCap = "";
    this.diaChiNcc = "";

    // Tự sinh mã mới dựa trên tên hàng + mã NCC
   
  }
},


  async importExcel(event) {
  const file = event.target.files[0];
  if (!file) return alert("⚠️ Chưa chọn file Excel!");

  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    if (rows.length === 0) return alert("⚠️ File Excel trống!");

    // ✅ Lấy thông tin khách hàng từ dòng đầu tiên
    const kh = rows[0];
    if ("ma_khach_hang" in kh) this.maKhach = kh.ma_khach_hang || kh.ma_khach || "";
    if ("ten_khach_hang" in kh) this.tenKhach = kh.ten_khach_hang || "";
    if ("so_dien_thoai" in kh) this.sdt = kh.so_dien_thoai || "";
    if ("dia_chi_khach" in kh) this.diaChiKhach = kh.dia_chi_khach || "";
    if ("no_cu" in kh) this.noCu = Number(kh.no_cu) || 0;
    if ("ghi_chu_khach" in kh) this.ghiChuKhach = kh.ghi_chu_khach || "";

    if (this.maKhach) await this.onKhachChange();

    // ✅ Duyệt từng dòng hàng hóa
    this.chiTiet = rows.map((r) => {
      // ⚙️ 1. Xử lý mã hàng: nếu trống → tự sinh
      let ma = (r.ma_hang || "").trim();
      if (!ma) {
        const removeAccents = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const initialsTenHang = removeAccents(r.ten_hang || "")
          .split(/\s+/)
          .filter(w => w.trim() !== "")
          .map(w => w[0].toUpperCase())
          .join("");
        const maNcc = (r.ma_nha_cung_cap || "").toUpperCase();
        ma = `${initialsTenHang}-${maNcc}`.slice(0, 12); // giới hạn 12 ký tự
      }

      // ⚙️ 2. Kiểm tra hàng có tồn tại trong sheet chưa
      const matched = this.dsHangHoa.find(h => h.ma_hang === ma);
      const trangThai = (r.TT || r.trang_thai || "").trim() || "Mua";

      if (matched) {
        const ncc = this.dsNhaCungCap.find(n => n.ma_nha_cung_cap === matched.ma_nha_cung_cap);
        return {
          maHang: matched.ma_hang,
          tenHang: matched.ten_hang || r.ten_hang || "",
          danhMuc: matched.danh_muc || "",
          size: matched.size || "",
          dvt: matched.dvt || "Cái",
          soLuongKho: Number(matched.so_luong_kho) || 0,
          soLuong: Number(r.so_luong) || 0,
          donGia: Number(r.don_gia) || Number(matched.don_gia) || 0,
          giamGia: Number(r.giam_gia) || 0,
          thanhTien:
            (Number(r.so_luong) || 0) * (Number(r.don_gia) || Number(matched.don_gia) || 0) -
            (Number(r.giam_gia) || 0),
          trangThai,
          maNcc: matched.ma_nha_cung_cap || "",
          nhaCungCap: ncc ? ncc.ten_nha_cung_cap : "",
          diaChiNcc: ncc ? ncc.dia_chi || "" : "",
          ghiChuDon: r.ghi_chu || "",
        };
      }

      // ⚙️ 3. Nếu hàng chưa có trong sheet → giữ dữ liệu Excel + mã vừa sinh
      return {
        maHang: ma,
        tenHang: r.ten_hang || "",
        danhMuc: r.danh_muc || "",
        size: r.size || "",
        dvt: r.dvt || "Cái",
        soLuongKho: 0,
        soLuong: Number(r.so_luong) || 0,
        donGia: Number(r.don_gia) || 0,
        giamGia: Number(r.giam_gia) || 0,
        thanhTien:
          (Number(r.so_luong) || 0) * (Number(r.don_gia) || 0) - (Number(r.giam_gia) || 0),
        trangThai,
        maNcc: r.ma_nha_cung_cap || "",
        nhaCungCap: r.ten_nha_cung_cap || "",
        diaChiNcc: r.dia_chi_ncc || "",
        ghiChuDon: r.ghi_chu || "",
      };
    });

    alert("✅ Import thành công! Đã tự động điền thông tin khách và hàng vào bảng.");
  } catch (err) {
    console.error("❌ Lỗi đọc Excel:", err);
    alert("❌ File không đúng định dạng mẫu hoặc bị lỗi. Kiểm tra lại nhé!");
  }
}

,

    formatNum(v){return new Intl.NumberFormat().format(v||0);},
    genMaHoaDon(){
      const d=new Date(),p=n=>n.toString().padStart(2,"0");
      this.maHoaDon=`HD${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;

      
    },
    async loadKhachHang(){
      const r=await fetch(this.apiUrl+"?action=getKhachHang");
      this.dsKhachHang=await r.json();
    },
    async loadHangHoa(){
      const r=await fetch(this.apiUrl+"?action=getHangHoa");
      this.dsHangHoa=await r.json();
      const r2=await fetch(this.apiUrl+"?action=getNhaCungCap");
      this.dsNhaCungCap=await r2.json();
    },
async onKhachChange() {
  const input = (this.tenKhach || this.maKhach || "").toLowerCase().trim();
  const kh = this.dsKhachHang.find(k =>
    (k.ma_khach_hang && k.ma_khach_hang.toLowerCase() === input) ||
    (k.ten_khach_hang && k.ten_khach_hang.toLowerCase() === input)
  );

  if (kh) {
    this.maKhach = kh.ma_khach_hang || "";
    this.tenKhach = kh.ten_khach_hang || "";
    this.sdt = kh.so_dien_thoai || "";
    this.noCu = Number(kh.cong_no) || 0;
    this.diaChiKhach = kh.dia_chi || "";
    this.ghiChuKhach = kh.ghi_chu || "";

    // ✅ Sau khi chọn khách => tự generate số hóa đơn theo quy tắc BE
    const res = await fetch(this.apiUrl + "?action=getHoaDonTong");
    const dsHD = await res.json();
    const hoaDonKhach = dsHD.filter(
      h => String(h.ma_khach_hang).trim().toUpperCase() === String(this.maKhach).trim().toUpperCase()
    );

    const stt = (hoaDonKhach.length + 1).toString().padStart(2, "0");
    this.soHoaDon = `${this.maKhach}-${stt}`;
  } else {
    // Nếu không tìm thấy khách
    this.sdt = "";
    this.noCu = 0;
    this.diaChiKhach = "";
    this.ghiChuKhach = "";
    this.soHoaDon = "";
    this.tuSinhMaKhach(); // 🟢 Gọi thêm dòng này
  }
},

    onHangChange(){
      const hh=this.dsHangHoa.find(h=>h.ma_hang===this.maHang);
      if(hh){
        this.tenHang=hh.ten_hang||"";this.dvt=hh.dvt||"";this.size=hh.size||"";
        this.soLuongKho=Number(hh.so_luong_kho)||0;this.donGia=Number(hh.don_gia)||0;this.giaGoc = Number(hh.gia_goc) || 0;

        this.maNcc=hh.ma_nha_cung_cap||"";this.danhMuc=hh.danh_muc||"";
        const ncc=this.dsNhaCungCap.find(n=>n.ma_nha_cung_cap===this.maNcc);
        this.nhaCungCap=ncc?ncc.ten_nha_cung_cap:"";this.diaChiNcc=ncc?ncc.dia_chi||"":""; 
      }
    },
   themHang() {
    if (!this.giaGoc && this.phanTram) {
  this.giaGoc = Math.round(this.donGia / (1 + this.phanTram / 100));
}

  if (!this.tenHang || this.soLuong <= 0)
    return alert("⚠️ Nhập hàng hợp lệ!");

  const ma = this.maHang || "";
  const trangThai = "Mua";
  const soLuong = Number(this.soLuong) || 0;
  const donGia = Number(this.donGia) || 0;
  const giamGia = Number(this.giamGia) || 0;
  const thanhTien = soLuong * donGia - giamGia;

  // ✅ Nếu có sẵn hàng cùng mã + trạng thái => cộng dồn
  const exist = this.chiTiet.find(i => i.maHang === ma && i.trangThai === trangThai);
  if (exist) {
    exist.soLuong += soLuong;
    exist.giamGia += giamGia;
    exist.thanhTien += thanhTien;
    return this.resetFormHang();
  }

  // ✅ Nếu chưa có thì thêm mới
  this.chiTiet.push({
    maHang: ma,
    maNcc: this.maNcc || "",
    tenHang: this.tenHang || "",
    danhMuc: this.danhMuc || "",
    dvt: this.dvt || "N/A",
    size: this.size || "N/A",
    nhaCungCap: this.nhaCungCap || "",
      soLuongKho: Number(this.soLuongKho) || 0,  // ✅ thêm dòng này
    soLuong,
    donGia,
     giaGoc: this.giaGoc || 0,   // 🟢 thêm dòng này
    giamGia,
    thanhTien,
    trangThai,
    ghiChuDon: this.ghiChuHang || ""
  });

  this.resetFormHang();
},

traHang() {
  if (!this.tenHang || this.soLuong <= 0)
    return alert("⚠️ Nhập thông tin hàng trả!");

  const ma = this.maHang || "";
  const trangThai = "Trả";
  const soLuong = Number(this.soLuong) || 0;
  const donGia = Number(this.donGia) || 0;
  const giamGia = Number(this.giamGia) || 0;
  const thanhTien = soLuong * donGia - giamGia;

  // ✅ Nếu có sẵn hàng cùng mã + trạng thái => cộng dồn
  const exist = this.chiTiet.find(i => i.maHang === ma && i.trangThai === trangThai);
  if (exist) {
    exist.soLuong += soLuong;
    exist.giamGia += giamGia;
    exist.thanhTien += thanhTien;
    return this.resetFormHang();
  }

  // ✅ Nếu chưa có thì thêm mới
  this.chiTiet.push({
    maHang: ma,
    maNcc: this.maNcc || "",
    tenHang: this.tenHang || "",
    danhMuc: this.danhMuc || "",
    dvt: this.dvt || "N/A",
    size: this.size || "N/A",
    nhaCungCap: this.nhaCungCap || "",
    soLuong,
    donGia,
     giaGoc: this.giaGoc || 0,   // 🟢 thêm dòng này
    giamGia,
    thanhTien,
    trangThai,
    ghiChuDon: this.ghiChuHang || ""
  });

  this.resetFormHang();
},

    suaHang(i) {
  const item = this.chiTiet[i];
  this.maHang = item.maHang;
  this.tenHang = item.tenHang;
  this.danhMuc = item.danhMuc;
  this.dvt = item.dvt;
  this.size = item.size;
  this.soLuong = item.soLuong;
  this.donGia = item.donGia;
  this.giamGia = item.giamGia;
  this.ghiChuHang = item.ghiChuDon;
  this.maNcc = item.maNcc;
  this.nhaCungCap = item.nhaCungCap;

  // ✅ Lấy lại địa chỉ NCC dựa vào mã NCC (vì chi tiết không có trường này)
  const ncc = this.dsNhaCungCap.find(n => n.ma_nha_cung_cap === this.maNcc);
  this.diaChiNcc = ncc ? ncc.dia_chi || "" : "";

  this.editIndex = i;
}
,
    capNhatHang(){
      if(this.editIndex===null)return alert("⚠️ Không có hàng nào để cập nhật!");
      const item=this.chiTiet[this.editIndex];
      Object.assign(item,{
        soLuong:Number(this.soLuong),donGia:Number(this.donGia),giamGia:Number(this.giamGia),
        thanhTien:Number(this.soLuong)*Number(this.donGia)-Number(this.giamGia||0),
        ghiChuDon:this.ghiChuHang||""
      });
      this.resetFormHang();this.editIndex=null;
      alert("✅ Đã cập nhật hàng!");
    },
    xoaHang(i){
      if(!confirm("❌ Xóa sản phẩm này khỏi hóa đơn?"))return;
      this.chiTiet.splice(i,1);
    },
    // Mở modal chỉnh sửa
moModalChinhSua(i) {
  this.editIndex = i;
  this.editItem = { ...this.chiTiet[i] }; // copy dữ liệu ra modal
  const modal = new bootstrap.Modal(document.getElementById("editModal"));
  modal.show();
},

luuChinhSua() {
  if (this.editIndex === null) return;
  const updated = this.editItem;
  updated.thanhTien =
    Number(updated.soLuong) * Number(updated.donGia) - Number(updated.giamGia || 0);

  this.chiTiet[this.editIndex] = { ...updated };
  this.editIndex = null;

  const modalEl = document.getElementById("editModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();

  alert("✅ Đã lưu thay đổi cho sản phẩm!");
},
xoaTuModal() {
  if (this.editIndex === null) return;
  if (!confirm("❌ Xóa sản phẩm này khỏi hóa đơn?")) return;

  this.chiTiet.splice(this.editIndex, 1);
  this.editIndex = null;

  const modalEl = document.getElementById("editModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();

  alert("🗑️ Đã xóa sản phẩm khỏi danh sách!");
},

    resetFormHang(){
      this.maHang="";this.tenHang="";this.dvt="";this.size="";
      this.soLuong=0;this.donGia=0;this.giamGia=0;
      this.maNcc="";this.nhaCungCap="";this.diaChiNcc="";this.danhMuc="";this.ghiChuHang="";
      this.giaGoc = 0;
this.phanTram = 0;

    },
    chonHinhThuc(opt){this.hinhThucThanhToan=opt;if(opt==="Nợ")this.tienThanhToan=0;},
    xacNhanThanhToan(){
      if(this.hinhThucThanhToan!=="Nợ"&&this.tienThanhToan<=0)return alert("⚠️ Nhập số tiền hợp lệ!");
      this.khachTra=this.hinhThucThanhToan==="Nợ"?0:this.tienThanhToan;
      this.hinhThuc=this.hinhThucThanhToan;this.daXacNhanThanhToan=true;
      alert("✅ Đã xác nhận thanh toán!");
    },
   async xuatHoaDonTong() {
  const hasMua = this.chiTiet.some(i => i.trangThai === "Mua");
  const hasTra = this.chiTiet.some(i => i.trangThai === "Trả");

  if (this.chiTiet.length === 0)
    return alert("⚠️ Chưa có sản phẩm nào!");

  if (hasMua && !this.hinhThucThanhToan)
    return alert("⚠️ Hóa đơn có mua hàng — vui lòng chọn hình thức thanh toán!");

  if (hasMua && !this.daXacNhanThanhToan && 
      !confirm("⚠️ Chưa xác nhận thanh toán, vẫn muốn xuất?"))
    return;

  // ✅ Xác định trạng thái tổng hợp của hóa đơn
  let trangThaiTongHop = "-";
  if (hasMua && hasTra) trangThaiTongHop = "Mua & Trả";
  else if (hasMua) trangThaiTongHop = "Mua";
  else if (hasTra) trangThaiTongHop = "Trả";

const data = {
  // ===== THÔNG TIN CHUNG =====
  ma_hoa_don: this.maHoaDon,
  so_hoa_don: this.soHoaDon,
  ngay_tao_duong_lich: this.formatDateTimeVN(),


  // ===== KHÁCH HÀNG =====
  ma_khach_hang: this.maKhach || "",
  ten_khach_hang: this.tenKhach || "",
  so_dien_thoai_khach: this.sdt || "",
  dia_chi_khach: this.diaChiKhach || "",
  no_cu: Number(this.noCu) || 0,

  // ===== HÓA ĐƠN =====
  tam_tinh: Number(this.tamTinh) || 0,
  hang_tra: Number(this.hangTra) || 0,
  tong_giam_gia: Number(this.tongGiamGia) || 0,
  tong_cong: Number(this.tongCong) || 0,
  tra_tien: Number(this.khachTra) || 0,
  hinh_thuc_thanh_toan: this.hinhThucThanhToan || "",
  ghi_chu: this.ghiChuDon || "",
  dia_chi_ncc: this.diaChiNcc || "",
  trang_thai_tonghop: trangThaiTongHop || "-",

  // ===== CHI TIẾT SẢN PHẨM =====
  chi_tiet: this.chiTiet.map(item => ({
    maHang: item.maHang || "",
    maNcc: item.maNcc || "",
    tenHang: item.tenHang || "",
    danhMuc: item.danhMuc || "",
    size: item.size || "",
    dvt: item.dvt || "",
     soLuongKho: Number(item.soLuongKho) || 0,  // ✅ thêm dòng này
    soLuong: Number(item.soLuong) || 0,
      giaGoc: Number(item.giaGoc) || 0,   // 🟢 thêm dòng này
    donGia: Number(item.donGia) || 0,
    giamGia: Number(item.giamGia) || 0,
    thanhTien: Number(item.thanhTien) || 0,
    trangThai: item.trangThai || "Mua",
    ghiChuDon: item.ghiChuDon || ""
  }))
};


  await fetch(this.apiUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "xuatHoaDonTong", data })
  });

  alert("✅ Đã gửi hóa đơn!");
  this.chiTiet = [];
  this.khachTra = 0;
  this.hinhThuc = "";
  this.hinhThucThanhToan = "";
  this.daXacNhanThanhToan = false;
  this.tienThanhToan = 0;
  this.ghiChuDon = "";
  this.genMaHoaDon();
}
,

watch: {
  donGia() {
    this.capNhatGiaNhapTheoGiaBan(); // ✅ đơn giá → tính lại giá gốc
  },
  phanTram() {
    this.capNhatGiaNhapTheoGiaBan(); // ✅ đổi % → tính lại giá gốc
  },
  giaGoc() {
    this.capNhatGiaBanTheoPhanTram(); // ✅ nhập giá gốc → tính ra đơn giá (làm tròn)
  },
},




async xuatAnhHoaDonGiay() {
  try {
    if (this.chiTiet.length === 0) return alert("⚠️ Chưa có sản phẩm nào trong hóa đơn!");

    await nextTick();

    // 🔹 1. Tạo HTML thực có dữ liệu
    const rows = this.chiTiet
      .map(
        (item, i) => `
        <tr>
          <td>${i + 1}</td>
          <td class="left">${item.tenHang}</td>
          <td>${item.size}</td>
          <td>${item.soLuong}</td>
          <td>${item.dvt}</td>
          <td>${this.formatNum(item.donGia)}</td>
          <td>${this.formatNum(item.giamGia)}</td>
          <td>${this.formatNum(item.thanhTien)}</td>
          <td class="${item.trangThai === "Mua" ? "green" : "red"}">${item.trangThai}</td>
        </tr>`
      )
      .join("");

    const htmlContent = `
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

          
          <h4>HÓA ĐƠN BÁN HÀNG</h4>
          <div class="invoice-info">
           <p><b>Mã HĐ:</b> ${this.soHoaDon} &nbsp;&nbsp;&nbsp;
             <b>Ngày lập:</b> ${new Date().toLocaleString()}</p>
          <p><b>Tên khách hàng:</b> ${this.tenKhach || "-"} &nbsp;&nbsp;&nbsp;
             <b>SĐT:</b> ${this.sdt || "-"} &nbsp;&nbsp;&nbsp;
              <b>Địa chỉ KH:</b> ${this.diaChiKhach || "-"}</p>
               </div>
        </div>

        <table class="invoice-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>TÊN HÀNG</th>
              <th >SIZE</th>
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
        <p class="note">Hàng đổi trả trong vòng 30 ngày kèm hóa đơn mua hàng.</p>

        <div class="invoice-footer">
          <p><b>Tổng giảm giá:</b> ${this.formatNum(this.tongGiamGia)} đ</p>
          <p><b>Tạm tính:</b> ${this.formatNum(this.tamTinh)} đ</p>
          <p><b>Hàng trả:</b> ${this.formatNum(this.hangTra)} đ</p>
          <p><b>Nợ cũ:</b> ${this.formatNum(this.noCu)} đ</p>
          <p><b>Khách trả:</b> ${this.formatNum(this.khachTra)} đ</p>
          <p>
  <b>Hình thức TT:</b>
  <span class="${
    this.hinhThuc === 'Tiền mặt'
      ? 'cash'
      : this.hinhThuc === 'Chuyển khoản'
      ? 'transfer'
      : this.hinhThuc === 'Nợ'
      ? 'debt'
      : ''
  }">${this.hinhThuc || '-'}</span>
</p>

          <hr>
          <h3 class="total">TỔNG CỘNG: ${this.formatNum(this.tongCong)} đ</h3>
          <p><b>Ghi chú:</b> ${this.ghiChuDon || "-"}</p>
          <div class="sign">
            <p>Người lập hóa đơn</p><br><br>
            <p>_________________________</p>
          </div>
        </div>
      </div>
    `;

    // 🔹 2. Thêm CSS tạm để chụp đúng form
 const style = `
<style>
.invoice-paper {
  width: 1050px;
  margin: 0 auto;
  padding: 25px 45px;
  background: #ffffff; /* giấy trắng tinh */
  color: #1a1a1a; /* chữ đen nhẹ */
  border: 2px solid #003399; /* viền xanh navy */
  font-family: 'Times New Roman', serif;
}

/* ===== HEADER ===== */
.invoice-header {
  text-align: center;
  border-bottom: 2px solid #003399;
  margin-bottom: 12px;
  font-family: 'Arial', serif;
}
.invoice-header h3 {
  color: #003399;
  font-size: 24px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
}
  
.invoice-header h4 {
  color: #003399;
  font-size: 18px;
  text-decoration: underline;
  margin: 6px 0;
  font-weight: bold;
}
/* ===== HEADER CHIA RIÊNG ===== */
.invoice-header .shop-info p {
  margin: 3px 0;
  font-size: 15px;
  font-weight: 600;
  color: #003399; /* ✅ xanh cho phần địa chỉ, sđt, stk */
  letter-spacing: 0.3px;
}

.invoice-header .invoice-info p {
  margin: 3px 0;
  font-size: 15px;
  color: #1a1a1a; /* ✅ đen như bản cũ */
  font-weight: normal;
}



/* ===== BẢNG CHI TIẾT ===== */
.invoice-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
  border: 1.5px solid #003399;
  margin-top: 10px;
}
.invoice-table th, .invoice-table td {
  border: 1px solid #003399;
  padding: 6px;
  text-align: center;
}
.invoice-table th {
  background: #003399; /* nền xanh navy đậm */
  color: #ffffff;      /* chữ trắng */
  font-weight: 700;
  text-transform: uppercase;
  border: 1px solid #003399; /* khung đồng màu */
  padding: 6px;
}
.invoice-table td {
  border: 1px solid #00339933; /* xanh nhạt trong suốt nhẹ */
  color: #1a1a1a;
  background: #ffffff;
}

.invoice-table td.left {
  text-align: left;
  padding-left: 8px;
}

/* ===== FOOTER ===== */
.invoice-footer {
  margin-top: 20px;
  font-size: 16px;
  line-height: 1.6;
  color: #1a1a1a;
  text-align: right;
  padding-right: 10px;
}
.invoice-footer b {
  color: #003399;
}
.invoice-footer .total {
  color: red;
  font-weight: 700;
  font-size: 18px;
  border-top: 2px solid #003399;
  padding-top: 6px;
  margin-top: 6px;
}

/* ===== CHỮ KÝ & GHI CHÚ ===== */
.sign {
  margin-top: 40px;
  text-align: right;
  font-size: 15px;
  color: #003366;
}
.note {
  text-align: left;
  font-style: italic;
  font-size: 16px;
  margin-top: 20px;
  color: #003366;
}

/* ===== KHI IN / XUẤT ẢNH ===== */
@media print {
  body {
    background: #ffffff;
  }
  .invoice-paper {
    box-shadow: none;
    border: 1px solid #003399;
  }
}
/* Hình thức thanh toán màu động */
.cash, .transfer {
  color: #006400 !important;   /* ✅ xanh lá đậm */
  font-weight: bold;
}
.debt {
  color: #cc0000 !important;   /* 🔴 đỏ đậm */
  font-weight: bold;
}
  /* ===== TÊN SHOP ===== */
.shop-name {
  text-align: center;
  font-family: 'Times New Roman', serif;
  margin-bottom: 6px;
  color: #b30000; /* đỏ sang như bảng hiệu */
}

.shop-name .prefix {
  font-size: 22px;
  letter-spacing: 0.3px;
  margin-right: 6px;
}

.shop-name .main {
  font-size: 36px;         /* ✅ to nhất, nổi bật */
  font-weight: 900;
  letter-spacing: 1px;
  margin: 0 6px;
  text-transform: uppercase;
}

.shop-name .suffix {
  font-size: 22px;
  font-style: italic;
  margin-left: 6px;
  font-weight: 600;
}
/* ===== TRẠNG THÁI MUA / TRẢ ===== */
.green {
  color: #008000 !important; /* ✅ xanh lá cây tươi */
  font-weight: bold;
}
.red {
  color: #cc0000 !important; /* 🔴 đỏ đậm */
  font-weight: bold;
}
tbody{
      font-family: 'Arial', serif;
 }

 /* ẨN CỘT SIZE, CỘT GIẢM, VÀ HÀNG TỔNG GIẢM GIÁ KHI XUẤT ẢNH */
.invoice-table th:nth-child(3),
.invoice-table td:nth-child(3),   /* SIZE */
.invoice-table th:nth-child(7),
.invoice-table td:nth-child(7) {  /* GIẢM */
  display: none !important;
}

/* ẨN HÀNG TỔNG GIẢM GIÁ */
.invoice-footer p:nth-child(1) {
  display: none !important;
}

</style>
`;


    // 🔹 3. Render vùng tạm ngoài DOM
    const temp = document.createElement("div");
    temp.innerHTML = style + htmlContent;
    temp.style.position = "absolute";
    temp.style.top = "-9999px";
    document.body.appendChild(temp);

    // 🔹 4. Mở tab chờ
    const newWin = window.open("", "_blank", "width=900,height=700");
    newWin.document.write(`<html><head><title>Đang tạo hóa đơn...</title></head>
      <body><p>Đang xử lý hóa đơn, vui lòng chờ...</p></body></html>`);

    // 🔹 5. Chụp lại đúng vùng này
    const canvas = await html2canvas(temp, {
      backgroundColor: "#fff",
      scale: 2,
      useCORS: true,
      logging: false,
    });

    document.body.removeChild(temp);

    const imgData = canvas.toDataURL("image/png");

    // 🔹 6. Hiển thị trong tab mới
    const htmlFinal = `
<html>
<head>
<title>Hóa đơn ${this.maHoaDon}</title>
<style>
  body {
    margin: 0;
    padding: 0;
    background: #f5f5f5;
    text-align: center;
  }
  img {
    max-width: 100%;
    height: auto;
    margin-top: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
    border: 1px solid #ccc;
  }
  .btn-bar {
    background: #fff;
    padding: 10px;
    border-bottom: 1px solid #ddd;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  button {
    background: #007bff;
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    margin: 0 4px;
  }
  button:hover {
    background: #0056b3;
  }

  /* ✅ ẨN NÚT KHI IN */
  @media print {
    .btn-bar {
      display: none !important;
    }
    body {
      background: #fff !important;
    }
    img {
      box-shadow: none !important;
      border: none !important;
      margin: 0;
    }
  }

  /* ✅ Giữ lề giấy đầy đủ tránh bị cắt */
  @page {
    margin: 10mm 10mm 10mm 10mm; /* trên, phải, dưới, trái */
    size: A4 portrait;
  }
</style>
</head>
<body>
  <div class="btn-bar">
    <button onclick="window.print()">🖨️ In hóa đơn</button>
    <button onclick="download()">⬇️ Tải ảnh</button>
  </div>
  <img id="hoaDonImg" src="${imgData}" alt="Hóa đơn ${this.maHoaDon}">
  <script>
    function download() {
      const a = document.createElement('a');
      a.href = document.getElementById('hoaDonImg').src;
      a.download = '${this.maHoaDon}_hoadon.png';
      a.click();
    }
  <\/script>
</body>
</html>
`;

    newWin.document.open();
    newWin.document.write(htmlFinal);
    newWin.document.close();

  } catch (e) {
    console.error("❌ Lỗi render:", e);
    alert("❌ Lỗi khi xuất ảnh hóa đơn!");
  }
}

  },
  mounted(){this.genMaHoaDon();this.loadKhachHang();this.loadHangHoa();}

  
};

</script>

<style scoped>
.panel__header{background:#007bff;color:#fff;font-weight:600;text-transform:uppercase;font-size:.9rem;padding:8px 12px;border-radius:10px 10px 0 0}
.panel__body{padding:12px;background:#fafafa}
.panel{border:1px solid #ccc;border-radius:10px;background:#fff;box-shadow:0 2px 5px rgba(0,0,0,0.05)}
.table thead th{background:#f2f2f2;font-weight:600}
.total-row{background:#eef7ff}
.calc-list strong{font-family:monospace}
.btn.active{background-color:#007bff!important;color:#fff!important}
.title-gradient{background:linear-gradient(90deg,#0066ff,#00ccff);-webkit-background-clip:text;background-clip:text;color:transparent}

.nav-item {
  display: block;
  padding: 8px 14px;
  text-decoration: none;
  color: #333;
}
.nav-item.router-link-exact-active {
  background: #007bff;
  color: #fff;
  border-radius: 6px;
  font-weight: 600;
}
</style>
