<template>
  <div class="container py-4">
    <h2 class="text-center text-primary mb-4">HÓA ĐƠN BÁN HÀNG</h2>

    <div class="row">
      <!-- Thông tin hóa đơn & khách -->
      <div class="col-md-4">
        <div class="card shadow-sm mb-3">
          <div class="card-header bg-primary text-white">
            Thông tin hóa đơn & khách
          </div>
          <div class="card-body">
            <div class="mb-2">
              <label class="form-label">Mã hóa đơn</label>
              <input v-model="maHoaDon" class="form-control" readonly />
            </div>
            <div class="mb-2">
              <label class="form-label">Tên khách hàng</label>
              <input
                list="khachOptions"
                v-model="tenKhach"
                @focus="loadKhachHang"
                @change="onKhachChange"
                class="form-control"
                placeholder="Chọn hoặc nhập..."
              />
              <datalist id="khachOptions">
                <option
                  v-for="kh in dsKhachHang"
                  :key="kh.ma"
                  :value="kh.ten"
                />
              </datalist>
            </div>
            <div class="mb-2">
              <label class="form-label">Số điện thoại</label>
              <input v-model="sdt" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="form-label">Nợ cũ</label>
              <input v-model.number="noCu" type="number" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="form-label">Ghi chú khách hàng</label>
              <textarea v-model="ghiChuKhach" class="form-control"></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Form nhập hóa đơn -->
      <div class="col-md-4">
        <div class="card shadow-sm mb-3">
          <div class="card-header bg-primary text-white">Form nhập hóa đơn</div>
          <div class="card-body">
            <div class="row mb-2">
              <div class="col">
                <label class="form-label">Mã hàng</label>
                <input
                  list="hangOptions"
                  v-model="maHang"
                  @focus="loadHangHoa"
                  @change="onHangChange"
                  class="form-control"
                  placeholder="Chọn hoặc nhập..."
                />
                <datalist id="hangOptions">
                  <option
                    v-for="hh in dsHangHoa"
                    :key="hh.ma"
                    :value="hh.ma"
                  />
                </datalist>
              </div>
              <div class="col">
                <label class="form-label">Tên hàng</label>
                <input v-model="tenHang" class="form-control" />
              </div>
            </div>

            <div class="row mb-2">
              <div class="col">
                <label class="form-label">ĐVT</label>
                <input v-model="dvt" class="form-control" />
              </div>
              <div class="col">
                <label class="form-label">SL trong kho</label>
                <input v-model="soLuongKho" class="form-control" readonly />
              </div>
            </div>

            <div class="row mb-2">
              <div class="col">
                <label class="form-label">Số lượng</label>
                <input
                  v-model.number="soLuong"
                  type="number"
                  class="form-control"
                />
              </div>
              <div class="col">
                <label class="form-label">Đơn giá</label>
                <input
                  v-model.number="donGia"
                  type="number"
                  class="form-control"
                />
              </div>
            </div>

            <div class="mb-2">
              <label class="form-label">Giảm giá</label>
              <input
                v-model.number="giamGia"
                type="number"
                class="form-control"
              />
            </div>

            <div class="mb-2">
              <label class="form-label">Khách trả</label>
              <input
                v-model.number="khachTra"
                type="number"
                class="form-control"
              />
            </div>

            <div class="mb-2">
              <label class="form-label">Hình thức thanh toán</label><br />
              <div class="btn-group">
                <button
                  v-for="opt in ['Tiền mặt','Chuyển khoản','Nợ']"
                  :key="opt"
                  type="button"
                  class="btn btn-outline-primary"
                  :class="{ active: hinhThuc === opt }"
                  @click="hinhThuc = opt"
                >
                  {{ opt }}
                </button>
              </div>
            </div>

            <div class="mb-2">
              <label class="form-label">Ghi chú đơn hàng</label>
              <textarea v-model="ghiChuDon" class="form-control"></textarea>
            </div>

            <div class="d-flex gap-2">
              <button class="btn btn-success flex-fill" @click="themHang">
                ➕ Thêm hàng
              </button>
              <button class="btn btn-danger flex-fill" @click="traHang">
                ↩ Trả hàng
              </button>
            </div>
            <button
              class="btn btn-primary mt-2 w-100"
              @click="xuatHoaDonTong"
            >
              📄 Xuất hóa đơn tổng
            </button>
          </div>
        </div>
      </div>

      <!-- Chi tiết hóa đơn -->
      <div class="col-md-4">
        <div class="card shadow-sm mb-3">
          <div class="card-header bg-primary text-white">Chi tiết hóa đơn</div>
          <div class="card-body">
            <table
              class="table table-bordered table-sm text-center align-middle"
            >
              <thead>
                <tr>
                  <th>Tên hàng</th>
                  <th>SL</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="chiTiet.length === 0">
                  <td colspan="5" class="text-muted">Chưa có sản phẩm</td>
                </tr>
                <tr v-for="(item, idx) in chiTiet" :key="idx">
                  <td>{{ item.tenHang }}</td>
                  <td>{{ item.soLuong }}</td>
                  <td>{{ formatNum(item.donGia) }}</td>
                  <td>{{ formatNum(item.thanhTien) }}</td>
                  <td>
                    <span
                      :class="
                        item.trangThai === 'Mua'
                          ? 'badge bg-success'
                          : 'badge bg-danger'
                      "
                    >
                      {{ item.trangThai }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <ul class="list-group small">
              <li class="list-group-item d-flex justify-content-between">
                <span>Tạm tính:</span> <strong>{{ formatNum(tamTinh) }}</strong>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span>Hàng trả:</span> <strong>{{ formatNum(hangTra) }}</strong>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span>Nợ cũ:</span> <strong>{{ formatNum(noCu) }}</strong>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span>Khách trả:</span>
                <strong>{{ formatNum(khachTra) }}</strong>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span>Hình thức:</span>
                <span class="badge bg-primary">{{ hinhThuc }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="fw-bold">TỔNG CỘNG:</span>
                <span class="fw-bold text-danger">{{
                  formatNum(tongCong)
                }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      apiUrl:
        "https://script.google.com/macros/s/AKfycbwXOmlE7zkGCj1p5xNCpUbvwYRGeSwKS1bt7LhYBcxAkXNXE0keCznfdVGCX9X08nGv_w/exec",

      // khách
      maHoaDon: "",
      tenKhach: "",
      sdt: "",
      noCu: 0,
      ghiChuKhach: "",
      dsKhachHang: [],

      // hàng hóa
      maHang: "",
      tenHang: "",
      dvt: "",
      soLuongKho: 0,
      soLuong: 0,
      donGia: 0,
      giamGia: 0,
      khachTra: 0,
      hinhThuc: "Tiền mặt",
      ghiChuDon: "",
      dsHangHoa: [],

      // chi tiết
      chiTiet: [],
    };
  },
  computed: {
    tamTinh() {
      return this.chiTiet
        .filter((i) => i.trangThai === "Mua")
        .reduce((sum, i) => sum + i.thanhTien, 0);
    },
    hangTra() {
      return this.chiTiet
        .filter((i) => i.trangThai === "Trả")
        .reduce((sum, i) => sum + i.thanhTien, 0);
    },
    tongCong() {
      return this.tamTinh - this.hangTra + Number(this.noCu) - Number(this.khachTra);
    },
  },
  methods: {
    formatNum(v) {
      return new Intl.NumberFormat().format(v || 0);
    },
    genMaHoaDon() {
      const d = new Date();
      const pad = (n) => n.toString().padStart(2, "0");
      this.maHoaDon =
        "HD" +
        d.getFullYear() +
        pad(d.getMonth() + 1) +
        pad(d.getDate()) +
        pad(d.getHours()) +
        pad(d.getMinutes()) +
        pad(d.getSeconds());
    },
    async loadKhachHang() {
      if (this.dsKhachHang.length > 0) return;
      try {
        const res = await fetch(this.apiUrl + "?action=getKhachHang");
        this.dsKhachHang = await res.json();
      } catch (err) {
        console.error("❌ Lỗi load khách:", err);
      }
    },
    async loadHangHoa() {
      if (this.dsHangHoa.length > 0) return;
      try {
        const res = await fetch(this.apiUrl + "?action=getHangHoa");
        this.dsHangHoa = await res.json();
      } catch (err) {
        console.error("❌ Lỗi load hàng:", err);
      }
    },
    onKhachChange() {
      const kh = this.dsKhachHang.find((k) => k.ten === this.tenKhach);
      if (kh) {
        this.sdt = kh.sdt;
        this.noCu = kh.no_cu;
        this.ghiChuKhach = kh.ghi_chu;
      }
    },
    onHangChange() {
      const hh = this.dsHangHoa.find((h) => h.ma === this.maHang);
      if (hh) {
        this.tenHang = hh.ten;
        this.dvt = hh.dvt;
        this.donGia = hh.don_gia;
        this.soLuongKho = hh.so_luong_kho;
      } else {
        this.soLuongKho = 0;
      }
    },
    themHang() {
      if (!this.tenHang || this.soLuong <= 0) return alert("Nhập thông tin hàng!");
      this.chiTiet.push({
        maHang: this.maHang,
        tenHang: this.tenHang,
        soLuong: this.soLuong,
        donGia: this.donGia,
        thanhTien: this.soLuong * this.donGia - this.giamGia,
        trangThai: "Mua",
      });
      this.resetFormHang();
    },
    traHang() {
      if (!this.tenHang || this.soLuong <= 0) return alert("Nhập thông tin hàng trả!");
      this.chiTiet.push({
        maHang: this.maHang,
        tenHang: this.tenHang,
        soLuong: this.soLuong,
        donGia: this.donGia,
        thanhTien: this.soLuong * this.donGia - this.giamGia,
        trangThai: "Trả",
      });
      this.resetFormHang();
    },
    resetFormHang() {
      this.maHang = "";
      this.tenHang = "";
      this.dvt = "";
      this.soLuong = 0;
      this.donGia = 0;
      this.giamGia = 0;
    },
    async xuatHoaDonTong() {
  const data = {
    ma_hoa_don: this.maHoaDon,
    ma_khach_hang: this.tenKhach,
    ngay_tao_duong_lich: new Date().toLocaleString(),
    ngay_tao_am_lich: "",
    tra_tien: this.khachTra,
    tam_tinh: this.tamTinh,
    no_cu: this.noCu,
    tong_cong: this.tongCong,
    hinh_thuc_thanh_toan: this.hinhThuc,
    ghi_chu: this.ghiChuDon,
    chi_tiet: this.chiTiet,
  };

  try {
    await fetch(this.apiUrl, {
      method: "POST",
      mode: "no-cors",   // 👈 BẮT BUỘC có dòng này
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "xuatHoaDonTong", data }),
    });
    alert("✅ Xuất hóa đơn đã gửi lên server (no-cors, không đọc phản hồi)");
  } catch (err) {
    alert("❌ Lỗi khi gửi hóa đơn");
    console.error(err);
  }
}
,
  },
  mounted() {
    this.genMaHoaDon();
  },
};
</script>

<style>
body {
  background: #f8f9fa;
}
</style>
