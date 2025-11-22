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

    <!-- ========== TỔNG THU - TỔNG CHI ========== -->
    <div class="row g-3 mb-4">
      <div class="col-md-6">
        <div class="summary-card summary-thu shadow-sm">
          <div class="summary-icon">💰</div>
          <div class="summary-content">
            <div class="summary-label">TỔNG THU</div>
            <div class="summary-value">{{ formatMoney(tongThu) }}</div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="summary-card summary-chi shadow-sm">
          <div class="summary-icon">💸</div>
          <div class="summary-content">
            <div class="summary-label">TỔNG CHI</div>
            <div class="summary-value">{{ formatMoney(tongChi) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== BẢNG CÔNG NỢ KHÁCH HÀNG ========== -->
   <div class="debt-section shadow-sm mb-4">
  <div class="debt-header">
    <h5 class="debt-title">👥 CÔNG NỢ KHÁCH HÀNG</h5>
  </div>
  <div class="table-responsive">
    <table class="table table-hover align-middle mb-0">
      <thead class="table-header-debt">
        <tr>
          <th>#</th>
          <th>MÃ KH</th>
          <th>TÊN KHÁCH HÀNG</th>
          <th>SỐ ĐIỆN THOẠI</th>
          <th>ĐỊA CHỈ</th>
          <th>CÔNG NỢ</th>
          <th>TRẠNG THÁI</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(kh, i) in khachHangCongNo" :key="i">
          <td class="text-center">{{ i + 1 }}</td>
          <td class="text-center fw-bold">{{ kh.ma_khach_hang }}</td>
          <td>{{ kh.ten_khach_hang }}</td>
          <td class="text-center">{{ kh.so_dien_thoai }}</td>
          <td>{{ kh.dia_chi }}</td>
          <td class="text-end">
            <!-- ✅ SỐ DƯƠNG = XANH, SỐ ÂM = ĐỎ -->
            <strong :class="kh.cong_no > 0 ? 'text-success' : kh.cong_no < 0 ? 'text-danger' : 'text-secondary'">
              {{ formatMoney(kh.cong_no) }}
            </strong>
          </td>
          <td class="text-center">
            <!-- ✅ BADGE TRÙNG MÀU VỚI SỐ TIỀN -->
            <span 
  v-if="Number(kh.cong_no) !== 0"
  class="badge-status"
  :class="{
    'badge-status-green': kh.cong_no > 0,
    'badge-status-red': kh.cong_no < 0
  }"
>
  {{ kh.trang_thai || '-' }}
</span>
          </td>
        </tr>
        <tr v-if="khachHangCongNo.length === 0">
          <td colspan="7" class="text-center text-muted py-4">Không có dữ liệu</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


    <!-- ========== BẢNG CÔNG NỢ NHÀ CUNG CẤP ========== -->
   <div class="debt-section shadow-sm mb-4">
  <div class="debt-header">
    <h5 class="debt-title">🏢 CÔNG NỢ NHÀ CUNG CẤP</h5>
  </div>
  <div class="table-responsive">
    <table class="table table-hover align-middle mb-0">
      <thead class="table-header-debt">
        <tr>
          <th>#</th>
          <th>MÃ NCC</th>
          <th>TÊN NHÀ CUNG CẤP</th>
          <th>SỐ ĐIỆN THOẠI</th>
          <th>ĐỊA CHỈ</th>
          <th>CÔNG NỢ</th>
          <th>TRẠNG THÁI</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(ncc, i) in nhaCungCapCongNo" :key="i">
          <td class="text-center">{{ i + 1 }}</td>
          <td class="text-center fw-bold">{{ ncc.ma_nha_cung_cap }}</td>
          <td>{{ ncc.ten_nha_cung_cap }}</td>
          <td class="text-center">{{ ncc.so_dien_thoai }}</td>
          <td>{{ ncc.dia_chi }}</td>
          <td class="text-end">
            <!-- ✅ SỐ ÂM = ĐỎ, SỐ DƯƠNG = XANH -->
            <strong :class="ncc.cong_no < 0 ? 'text-danger' : ncc.cong_no > 0 ? 'text-success' : 'text-secondary'">
              {{ formatMoney(ncc.cong_no) }}
            </strong>
          </td>
          <td class="text-center">
            <!-- ✅ BADGE TRÙNG MÀU VỚI SỐ TIỀN -->
            <span 
  v-if="Number(ncc.cong_no) !== 0"
  class="badge-status"
  :class="{
    'badge-status-red': ncc.cong_no < 0,
    'badge-status-green': ncc.cong_no > 0
  }"
>
  {{ ncc.trang_thai || '-' }}
</span>
          </td>
        </tr>
        <tr v-if="nhaCungCapCongNo.length === 0">
          <td colspan="7" class="text-center text-muted py-4">Không có dữ liệu</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

    <!-- ========== BẢNG HÓA ĐƠN ========== -->
    <div class="table-container shadow-sm">
      <div class="table-header-controls">
        <h5 class="table-main-title">📋 LỊCH SỬ GIAO DỊCH</h5>
        <button 
          class="btn btn-export-master" 
          @click="exportExcelFull"
          :disabled="isExporting"
        >
          <span v-if="!isExporting">📊 XUẤT EXCEL TỔNG HỢP</span>
          <span v-else>⏳ Đang xuất...</span>
        </button>
      </div>
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
              <td class="text-center">
                <a 
                  href="#" 
                  class="link-invoice fw-bold"
                  @click.prevent="xuatHoaDonTheoLoai(r)"
                >
                  {{ r.ma_hoa_don }}
                </a>
              </td>
              <td class="text-center">
                <a 
                  href="#" 
                  class="link-invoice"
                  @click.prevent="xuatHoaDonTheoLoai(r)"
                >
                  {{ r.so_hoa_don }}
                </a>
              </td>
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

/* ========== TỔNG THU - TỔNG CHI ========== */
.summary-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 25px;
  border-radius: 12px;
  border: 2px solid;
  background: white;
  transition: all 0.3s ease;
}
/* ========== BADGE TRẠNG THÁI CÔNG NỢ ========== */
.badge-status {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

/* ĐỎ - Khi số tiền màu đỏ */
.badge-status-red {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

/* XANH - Khi số tiền màu xanh */
.badge-status-green {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}
.summary-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.summary-thu {
  border-color: #28a745;
}

.summary-chi {
  border-color: #dc3545;
}

.summary-icon {
  font-size: 3rem;
  line-height: 1;
}

.summary-content {
  flex: 1;
}

.summary-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 5px;
}

.summary-value {
  font-size: 1.8rem;
  font-weight: 900;
  color: #1a2f63;
}

.summary-thu .summary-value {
  color: #28a745;
}

.summary-chi .summary-value {
  color: #dc3545;
}

/* ========== BẢNG CÔNG NỢ ========== */
.debt-section {
  background: white;
  border: 2px solid #B8CCE4;
  border-radius: 8px;
  overflow: hidden;
}

.debt-header {
  background: linear-gradient(135deg, #1a2f63 0%, #13244a 100%);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid rgba(255, 255, 255, 0.25);
}

.debt-title {
  color: white;
  margin: 0;
  font-size: 1rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.35);
}

.btn-export-master {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 900;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.btn-export-master:hover:not(:disabled) {
  background: linear-gradient(135deg, #218838 0%, #1b9b7e 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.5);
}

.btn-export-master:disabled {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  cursor: not-allowed;
  opacity: 0.7;
}

.table-header-debt {
  background: linear-gradient(135deg, #495057 0%, #343a40 100%) !important;
}

.table-header-debt th {
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

/* ========== BADGE CÔNG NỢ - TRÙNG MÀU VỚI SỐ TIỀN ========== */
.badge-debt {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

/* ĐỎ - Khi số tiền màu đỏ */
.badge-debt-red {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

/* XANH - Khi số tiền màu xanh */
.badge-debt-green {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

/* ========== Header bảng hóa đơn với nút export ========== */
.table-header-controls {
  background: linear-gradient(135deg, #1a2f63 0%, #13244a 100%);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid rgba(255, 255, 255, 0.25);
}

.table-main-title {
  color: white;
  margin: 0;
  font-size: 1rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.35);
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

/* Link hóa đơn */
.link-invoice {
  color: #1a2f63;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.2s ease;
  position: relative;
  display: inline-block;
}

.link-invoice:hover {
  color: #13244a;
  text-decoration: underline;
}

.link-invoice:active {
  transform: scale(0.96);
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
  
  .table-header-controls,
  .debt-header {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
}
</style>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import axios from "axios";
import * as XLSX from 'xlsx';

const API = "https://script.google.com/macros/s/AKfycbz_vsTrvAjmYq51LTtQhe-nkdOzbMQcpMGslSU8tuSObycF9l5HT7cqYKhJ11uqrpL8/exec";

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
const hoaDonBan = ref([]);
const hoaDonNhap = ref([]);
const hoaDonBanChiTiet = ref([]);
const hoaDonNhapChiTiet = ref([]);
const isExporting = ref(false);

const currentPage = ref(1);
const perPage = 15;

// ✅ Hàm lấy ngày hiện tại
const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ✅ Khởi tạo filters với ngày hiện tại
const filters = ref({
  fromDate: getTodayString(),
  toDate: getTodayString(),
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

const tongThu = computed(() => {
  return filteredRecords.value
    .filter(r => r.so_tien >= 0)
    .reduce((sum, r) => sum + Number(r.so_tien || 0), 0);
});

const tongChi = computed(() => {
  return Math.abs(
    filteredRecords.value
      .filter(r => r.so_tien < 0)
      .reduce((sum, r) => sum + Number(r.so_tien || 0), 0)
  );
});

const khachHangCongNo = computed(() => {
  return khachHang.value
    .filter(kh => Number(kh.cong_no || 0) !== 0)
    .sort((a, b) => Math.abs(b.cong_no) - Math.abs(a.cong_no));
});

const nhaCungCapCongNo = computed(() => {
  return nhaCungCap.value
    .filter(ncc => Number(ncc.cong_no || 0) !== 0)
    .sort((a, b) => Math.abs(b.cong_no) - Math.abs(a.cong_no));
});

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

  const parseVNDateTime = (v) => {
    if (!v) return null;
    if (v.includes("T")) {
      const d = new Date(v);
      if (!isNaN(d)) return new Date(d.getTime() + 7 * 60 * 60 * 1000);
    }
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

  if (fromDate || toDate) {
    const from = fromDate ? new Date(fromDate + "T00:00:00") : null;
    const to = toDate ? new Date(toDate + "T23:59:59") : null;
    data = data.filter((r) => {
      const d = parseVNDateTime(r.ngay_tao);
      return d && (!from || d >= from) && (!to || d <= to);
    });
  }

  if (hinhThuc)
    data = data.filter((r) =>
      (r.hinh_thuc_thanh_toan || "").toLowerCase().includes(hinhThuc.toLowerCase())
    );

  if (trangThai)
    data = data.filter((r) =>
      (r.trang_thai || "").toLowerCase() === trangThai.toLowerCase()
    );

  if (maKH) data = data.filter((r) => (r.ma_khach_hang || "").includes(maKH));
  if (tenKH) data = data.filter((r) => (r.ten_khach_hang || "").includes(tenKH));
  if (maNCC) data = data.filter((r) => (r.ma_nha_cung_cap || "").includes(maNCC));
  if (tenNCC) data = data.filter((r) => (r.ten_nha_cung_cap || "").includes(tenNCC));
  if (maDV) data = data.filter((r) => (r.ma_dich_vu || "").includes(maDV));
  if (tenDV) data = data.filter((r) => (r.ten_dich_vu || "").includes(tenDV));

  data.sort((a, b) => {
    const da = parseVNDateTime(a.ngay_tao);
    const db = parseVNDateTime(b.ngay_tao);
    return sortOrder === "asc" ? da - db : db - da;
  });

  return data;
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredRecords.value.length / perPage))
);
const paginated = computed(() =>
  filteredRecords.value.slice((currentPage.value - 1) * perPage, currentPage.value * perPage)
);

// ✅ Reset filters về ngày hiện tại
function resetFilters() {
  filters.value = {
    fromDate: getTodayString(),
    toDate: getTodayString(),
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

async function loadData() {
  const [kh, ncc, tc, hdBan, hdNhap, hdBanCT, hdNhapCT] = await Promise.all([
    axios.get(`${API}?action=getKhachHang`),
    axios.get(`${API}?action=getNhaCungCap`),
    axios.get(`${API}?action=getSoThuChi`),
    axios.get(`${API}?action=getHoaDonTong`),
    axios.get(`${API}?action=getHoaDonNhapHangTong`),
    axios.get(`${API}?action=getHoaDonChiTiet`),
    axios.get(`${API}?action=getHoaDonNhapHangChiTiet`),
  ]);
  khachHang.value = kh.data || [];
  nhaCungCap.value = ncc.data || [];
  records.value = tc.data || [];
  hoaDonBan.value = hdBan.data || [];
  hoaDonNhap.value = hdNhap.data || [];
  hoaDonBanChiTiet.value = hdBanCT.data || [];
  hoaDonNhapChiTiet.value = hdNhapCT.data || [];
}

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

async function exportExcelFull() {
  if (isExporting.value) return;
  
  try {
    isExporting.value = true;

    function sanitizeSheetName(name) {
      if (!name) return 'Sheet';
      let clean = name.replace(/[\/\\\?\*\[\]]/g, '_');
      if (clean.length > 31) clean = clean.substring(0, 31);
      return clean || 'Sheet';
    }

    const wb = XLSX.utils.book_new();
    const existingSheetNames = new Set();

    function getUniqueSheetName(baseName) {
      let cleanName = sanitizeSheetName(baseName);
      let finalName = cleanName;
      let counter = 1;
      
      while (existingSheetNames.has(finalName)) {
        const suffix = `_${counter}`;
        const maxLen = 31 - suffix.length;
        finalName = cleanName.substring(0, maxLen) + suffix;
        counter++;
      }
      
      existingSheetNames.add(finalName);
      return finalName;
    }

    function styleWorksheet(ws, headerColor = 'FF4472C4') {
      const range = XLSX.utils.decode_range(ws['!ref']);
      const colWidths = [];

      for (let C = range.s.c; C <= range.e.c; ++C) {
        let maxWidth = 10;
        
        for (let R = range.s.r; R <= range.e.r; ++R) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          const cell = ws[cellAddress];
          
          if (!cell || !cell.v) continue;
          
          const cellValue = String(cell.v);
          const cellWidth = cellValue.length + 2;
          
          if (cellWidth > maxWidth) {
            maxWidth = cellWidth;
          }
        }
        
        colWidths.push({ wch: Math.min(maxWidth, 50) });
      }
      
      ws['!cols'] = colWidths;

      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        
        if (!ws[cellAddress]) continue;
        
        ws[cellAddress].s = {
          fill: {
            fgColor: { rgb: headerColor }
          },
          font: {
            bold: true,
            color: { rgb: "FFFFFFFF" },
            sz: 12
          },
          alignment: {
            horizontal: "center",
            vertical: "center"
          }
        };
      }
    }

    const parseVNDateTime = (v) => {
      if (!v) return null;

      if (v.includes("T")) {
        const d = new Date(v);
        if (!isNaN(d)) return new Date(d.getTime() + 7 * 60 * 60 * 1000);
      }

      const parts = v.split(" ");
      if (parts.length === 2) {
        const [time, date] = parts;
        const timeParts = time.split(":");
        const dateParts = date.split("/");
        
        if (timeParts.length === 3 && dateParts.length === 3) {
          const [hh, mm, ss] = timeParts.map(Number);
          const [dd, MM, yyyy] = dateParts.map(Number);
          return new Date(yyyy, MM - 1, dd, hh, mm, ss);
        }
      }

      const dateParts = v.split("/");
      if (dateParts.length === 3) {
        const [dd, MM, yyyy] = dateParts.map(Number);
        return new Date(yyyy, MM - 1, dd, 0, 0, 0);
      }

      return null;
    };

    const fromDate = filters.value.fromDate ? new Date(filters.value.fromDate + "T00:00:00") : null;
    const toDate = filters.value.toDate ? new Date(filters.value.toDate + "T23:59:59") : null;

    const isInDateRange = (hd) => {
      if (!fromDate && !toDate) return true;

      const ngayTaoFields = [
        hd.ngay_tao_duong_lich,
        hd.NGAY_TAO_DUONG_LICH,
        hd.ngay_tao,
        hd.NGAY_TAO
      ];

      for (const field of ngayTaoFields) {
        if (!field) continue;
        
        const ngayTao = parseVNDateTime(field);
        if (ngayTao) {
          return (!fromDate || ngayTao >= fromDate) && (!toDate || ngayTao <= toDate);
        }
      }

      return false;
    };

    const filteredHoaDonBan = hoaDonBan.value.filter(isInDateRange);
    const filteredHoaDonNhap = hoaDonNhap.value.filter(isInDateRange);

    const dataCongNoKH = khachHangCongNo.value.map((kh, i) => ({
      'STT': i + 1,
      'Mã KH': kh.ma_khach_hang || '',
      'Tên khách hàng': kh.ten_khach_hang || '',
      'Số điện thoại': kh.so_dien_thoai || '',
      'Địa chỉ': kh.dia_chi || '',
      'Công nợ': Number(kh.cong_no || 0),
      'Trạng thái': kh.trang_thai || ''
    }));
    const wsCongNoKH = XLSX.utils.json_to_sheet(dataCongNoKH);
    styleWorksheet(wsCongNoKH, 'FF4472C4');
    XLSX.utils.book_append_sheet(wb, wsCongNoKH, getUniqueSheetName("1_Công nợ KH"));

    const dataCongNoNCC = nhaCungCapCongNo.value.map((ncc, i) => ({
      'STT': i + 1,
      'Mã NCC': ncc.ma_nha_cung_cap || '',
      'Tên nhà cung cấp': ncc.ten_nha_cung_cap || '',
      'Số điện thoại': ncc.so_dien_thoai || '',
      'Địa chỉ': ncc.dia_chi || '',
      'Công nợ': Number(ncc.cong_no || 0),
      'Trạng thái': ncc.trang_thai || ''
    }));
    const wsCongNoNCC = XLSX.utils.json_to_sheet(dataCongNoNCC);
    styleWorksheet(wsCongNoNCC, 'FFED7D31');
    XLSX.utils.book_append_sheet(wb, wsCongNoNCC, getUniqueSheetName("2_Công nợ NCC"));

    const dataHDBan = filteredHoaDonBan.map((hd, i) => ({
      'STT': i + 1,
      'Mã HĐ': hd.ma_hoa_don || hd.MA_HOA_DON || '',
      'Số HĐ': hd.so_hoa_don || hd.SO_HOA_DON || '',
      'Mã KH': hd.ma_khach_hang || hd.MA_KHACH_HANG || '',
      'Tên KH': hd.ten_khach_hang || hd.TEN_KHACH_HANG || '',
      'Ngày tạo': hd.ngay_tao_duong_lich || hd.NGAY_TAO_DUONG_LICH || '',
      'Tạm tính': Number(hd.tam_tinh || hd.TAM_TINH || 0),
      'Hàng trả': Number(hd.hang_tra || hd.HANG_TRA || 0),
      'Nợ cũ': Number(hd.no_cu || hd.NO_CU || 0),
      'Trả tiền': Number(hd.tra_tien || hd.TRA_TIEN || 0),
      'Tổng cộng': Number(hd.tong_cong || hd.TONG_CONG || 0),
      'Hình thức TT': hd.hinh_thuc_thanh_toan || hd.HINH_THUC_THANH_TOAN || '',
      'Ghi chú': hd.ghi_chu || hd.GHI_CHU || ''
    }));
    
    if (dataHDBan.length > 0) {
      const wsHDBan = XLSX.utils.json_to_sheet(dataHDBan);
      styleWorksheet(wsHDBan, 'FF70AD47');
      XLSX.utils.book_append_sheet(wb, wsHDBan, getUniqueSheetName("3_HĐ Bán hàng (TQ)"));
    }

    const dataHDNhap = filteredHoaDonNhap.map((hd, i) => ({
      'STT': i + 1,
      'Mã HĐ': hd.ma_hoa_don || '',
      'Số HĐ': hd.so_hoa_don || '',
      'Mã NCC': hd.ma_nha_cung_cap || '',
      'Tên NCC': hd.ten_nha_cung_cap || '',
      'Ngày tạo': hd.ngay_tao_duong_lich || '',
      'Tạm tính': Number(hd.tam_tinh || 0),
      'Hàng trả': Number(hd.hang_tra || 0),
      'Công nợ': Number(hd.cong_no || 0),
      'Trả tiền': Number(hd.tra_tien || 0),
      'Tổng cộng': Number(hd.tong_cong || 0),
      'Hình thức TT': hd.hinh_thuc_thanh_toan || '',
      'Trạng thái': hd.trang_thai_tonghop || '',
      'Ghi chú': hd.ghi_chu || ''
    }));
    
    if (dataHDNhap.length > 0) {
      const wsHDNhap = XLSX.utils.json_to_sheet(dataHDNhap);
      styleWorksheet(wsHDNhap, 'FFFFC000');
      XLSX.utils.book_append_sheet(wb, wsHDNhap, getUniqueSheetName("4_HĐ Nhập hàng (TQ)"));
    }

    let sttBan = 5;
    for (const hd of filteredHoaDonBan) {
      const maHD = hd.ma_hoa_don || hd.MA_HOA_DON;
      if (!maHD) continue;

      const chiTiet = hoaDonBanChiTiet.value.filter(ct => 
        (ct.ma_hoa_don || ct.MA_HOA_DON) === maHD
      );

      if (chiTiet && chiTiet.length > 0) {
        const dataChiTiet = chiTiet.map((item, i) => ({
          'STT': i + 1,
          'Mã HĐ': maHD,
          'Mã hàng': item.ma_hang || item.MA_HANG || '',
          'Tên hàng': item.ten_hang || item.TEN_HANG || '',
          'Danh mục': item.danh_muc || item.DANH_MUC || '',
          'Size': item.size || item.SIZE || '',
          'ĐVT': item.dvt || item.DVT || '',
          'Số lượng': Number(item.so_luong || item.SO_LUONG || 0),
          'Đơn giá': Number(item.don_gia || item.DON_GIA || 0),
          'Giảm giá': Number(item.giam_gia || item.GIAM_GIA || 0),
          'Thành tiền': Number(item.thanh_tien || item.THANH_TIEN || 0),
          'Trạng thái': item.trang_thai || item.TRANG_THAI || '',
          'Ghi chú': item.ghi_chu_don || item.GHI_CHU_DON || ''
        }));

        const wsChiTiet = XLSX.utils.json_to_sheet(dataChiTiet);
        styleWorksheet(wsChiTiet, 'FF92D050');
        
        const paddedSTT = String(sttBan).padStart(3, '0');
        const sheetName = getUniqueSheetName(`${paddedSTT}_BÁN_${hd.so_hoa_don || hd.SO_HOA_DON || maHD}`);
        XLSX.utils.book_append_sheet(wb, wsChiTiet, sheetName);
        sttBan++;
      }
    }

    let sttNhap = sttBan;
    for (const hd of filteredHoaDonNhap) {
      const maHD = hd.ma_hoa_don;
      if (!maHD) continue;

      const chiTiet = hoaDonNhapChiTiet.value.filter(ct => 
        ct.ma_hoa_don === maHD
      );

      if (chiTiet && chiTiet.length > 0) {
        const dataChiTiet = chiTiet.map((item, i) => ({
          'STT': i + 1,
          'Mã HĐ': maHD,
          'Mã hàng': item.ma_hang || '',
          'Tên hàng': item.ten_hang || '',
          'Danh mục': item.danh_muc || '',
          'Size': item.size || '',
          'ĐVT': item.dvt || '',
          'Số lượng': Number(item.so_luong || 0),
          'Giá nhập': Number(item.gia_nhap || item.don_gia || 0),
          'Giảm giá': Number(item.giam_gia || 0),
          'Thành tiền': Number(item.thanh_tien || 0),
          'Trạng thái': item.trang_thai || '',
          'Ghi chú': item.ghi_chu_nhap || item.ghi_chu || ''
        }));

        const wsChiTiet = XLSX.utils.json_to_sheet(dataChiTiet);
        styleWorksheet(wsChiTiet, 'FFFFD966');
        
        const paddedSTT = String(sttNhap).padStart(3, '0');
        const sheetName = getUniqueSheetName(`${paddedSTT}_NHẬP_${hd.so_hoa_don || maHD}`);
        XLSX.utils.book_append_sheet(wb, wsChiTiet, sheetName);
        sttNhap++;
      }
    }

    const fromStr = filters.value.fromDate ? filters.value.fromDate.replace(/-/g, '') : '';
    const toStr = filters.value.toDate ? filters.value.toDate.replace(/-/g, '') : '';
    const timeRange = fromStr && toStr ? `_${fromStr}-${toStr}` : '';
    const fileName = `BaoCao_TongHop${timeRange}.xlsx`;
    
    XLSX.writeFile(wb, fileName);
    
    const fromDisplay = filters.value.fromDate || 'Không giới hạn';
    const toDisplay = filters.value.toDate || 'Không giới hạn';
    
    alert(`✅ Đã xuất file ${fileName} thành công!\n\n📅 Khoảng thời gian: ${fromDisplay} → ${toDisplay}\n\n📋 Bao gồm:\n• Công nợ KH (${dataCongNoKH.length} bản ghi)\n• Công nợ NCC (${dataCongNoNCC.length} bản ghi)\n• HĐ Bán hàng (${filteredHoaDonBan.length} hóa đơn)\n• HĐ Nhập hàng (${filteredHoaDonNhap.length} hóa đơn)`);
    
  } catch (err) {
    console.error('❌ Lỗi xuất Excel:', err);
    alert('❌ Có lỗi khi xuất Excel: ' + err.message);
  } finally {
    isExporting.value = false;
  }
}

async function xuatHoaDonTheoLoai(record) {
  try {
    const maHD = record.ma_hoa_don;
    if (!maHD) return alert("⚠️ Không tìm thấy mã hóa đơn!");

    const hoaDonBanItem = hoaDonBan.value.find(h => 
      (h.ma_hoa_don || h.MA_HOA_DON) === maHD
    );

    const hoaDonNhapItem = hoaDonNhap.value.find(h => 
      h.ma_hoa_don === maHD
    );

    if (hoaDonBanItem) {
      await xuatAnhHoaDonGiay(hoaDonBanItem);
    } else if (hoaDonNhapItem) {
      await xuatAnhHoaDonNhap(hoaDonNhapItem);
    } else {
      alert("⚠️ Không tìm thấy chi tiết hóa đơn này trong hệ thống!");
    }

  } catch (err) {
    console.error("❌ Lỗi khi xuất hóa đơn:", err);
    alert("❌ Có lỗi xảy ra khi xuất hóa đơn!");
  }
}

async function xuatAnhHoaDonGiay(hd) {
  try {
    const maHD = hd.ma_hoa_don || hd.MA_HOA_DON;
    
    const chiTiet = hoaDonBanChiTiet.value.filter(ct => 
      (ct.ma_hoa_don || ct.MA_HOA_DON) === maHD
    );
    
    if (!chiTiet || chiTiet.length === 0)
      return alert("Không có chi tiết hóa đơn!");

    const rows = chiTiet.map((item, i) => `
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
      </tr>`).join("");

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Hóa đơn ${hd.so_hoa_don || hd.SO_HOA_DON}</title>
  <style>
    @page {size: A5 portrait;margin: 10mm;}
    @media print {body { zoom: 85%; }.tools { display: none !important; }}
    body {font-family:'Times New Roman',serif;color:#000;margin:0;padding:0;background:#fff;}
    .invoice-paper {width: 100%;max-width: 140mm;margin:auto;border:1px solid #003399;padding:10mm 8mm;background:#fff;box-sizing:border-box;}
    .shop-name {text-align:center;color:#b30000;margin-bottom:4px;}
    .shop-name .main {font-size:22px;font-weight:900;text-transform:uppercase;margin:0 6px;}
    .shop-info {text-align:center;color:#003399;font-weight:600;font-size:12px;line-height:1.3;}
    h4 {text-align:center;text-decoration:underline;color:#003399;margin:6px 0;font-size:16px;}
    .info-block {text-align:left;font-size:12px;margin-bottom:6px;line-height:1.3;}
    table {width:100%;border-collapse:collapse;font-size:11px;margin-top:4px;}
    th,td {border:1px solid #003399;padding:4px 3px;text-align:center;}
    th {background:#003399;color:#fff;font-weight:bold;}
    td.left { text-align:left; padding-left:4px; }
    .green { color:#008000;font-weight:bold; }
    .red { color:#cc0000;font-weight:bold; }
    .note {font-style:italic;color:#003399;margin-top:5px;text-align:left;font-size:11px;}
    .footer {text-align:right;font-size:12px;margin-top:5px;line-height:1.4;}
    .footer b { color:#003399; }
    .footer .total {color:red;font-weight:bold;font-size:13px;border-top:1px solid #003399;padding-top:4px;margin-top:4px;}
    .tools {text-align:center;margin:8px 0;}
    .tools button {margin:0 5px;padding:5px 10px;border:none;border-radius:6px;cursor:pointer;font-weight:600;}
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
      <p>Tạm tính: <b>${Number(hd.tam_tinh || hd.TAM_TINH || 0).toLocaleString("vi-VN")}</b> đ</p>
      <p>Hàng trả: <b>${Number(hd.hang_tra || hd.HANG_TRA || 0).toLocaleString("vi-VN")}</b> đ</p>
      <p>Nợ cũ: <b>${Number(hd.no_cu || hd.NO_CU || 0).toLocaleString("vi-VN")}</b> đ</p>
      <p>Khách trả: <b>${Number(hd.tra_tien || hd.TRA_TIEN || 0).toLocaleString("vi-VN")}</b> đ</p>
      <p>Hình thức TT: <b>${hd.hinh_thuc_thanh_toan || hd.HINH_THUC_THANH_TOAN || "-"}</b></p>
      <p class="total">TỔNG CỘNG: ${Number(hd.tong_cong || hd.TONG_CONG || 0).toLocaleString("vi-VN")} đ</p>
      <p>Ghi chú: ${hd.ghi_chu || hd.GHI_CHU || "-"}</p>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const newWin = window.open(url, "_blank", "width=950,height=900");

    newWin.onload = async () => {
      const script = newWin.document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
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
    console.error("❌ Lỗi xuất hóa đơn bán hàng:", err);
    alert("Không thể hiển thị hóa đơn chi tiết!");
  }
}

async function xuatAnhHoaDonNhap(hd) {
  try {
    if (!hd || !hd.ma_hoa_don) return alert("⚠️ Không tìm thấy mã hóa đơn hợp lệ!");

    const maHD = hd.ma_hoa_don;
    
    const chiTiet = hoaDonNhapChiTiet.value.filter(ct => 
      ct.ma_hoa_don === maHD
    );

    if (!chiTiet || chiTiet.length === 0) {
      return alert("⚠️ Hóa đơn này chưa có chi tiết để xuất!");
    }

    const ncc = nhaCungCap.value.find(n => n.ma_nha_cung_cap === hd.ma_nha_cung_cap);
    hd.sdt_ncc = ncc?.so_dien_thoai || "-";
    hd.dia_chi_ncc = ncc?.dia_chi || "-";

    const formatDateTime = (str) => {
      if (!str) return "-";
      const pad = (n) => String(n).padStart(2, "0");
      const match = str.match(/^(\d{2}):(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})$/);
      if (match) return str;
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

    const rows = chiTiet.map((item, i) => `
        <tr>
          <td>${i + 1}</td>
          <td class="left">${item.ten_hang || ""}</td>
          <td>${item.size || ""}</td>
          <td>${item.so_luong || 0}</td>
          <td>${item.dvt || ""}</td>
          <td>${Number(item.gia_nhap || item.don_gia || 0).toLocaleString("vi-VN")}</td>
          <td>${Number(item.giam_gia || 0).toLocaleString("vi-VN")}</td>
          <td>${Number(item.thanh_tien || 0).toLocaleString("vi-VN")}</td>
          <td class="${item.trang_thai === "Nhập" || item.trang_thai === "Mua" ? "green" : "red"}">
            ${item.trang_thai || ""}
          </td>
        </tr>`).join("");

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
            <th>STT</th><th>TÊN HÀNG</th><th>SIZE</th><th>SL</th><th>DVT</th>
            <th>ĐƠN GIÁ</th><th>GIẢM</th><th>THÀNH TIỀN</th><th>TRẠNG THÁI</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="note">Hàng nhập kiểm tra kỹ trước khi nhập kho, có vấn đề liên hệ ngay NCC.</p>
      <div class="invoice-footer">
        <p><b>Tổng giảm giá:</b> ${Number(hd.tong_giam_gia || 0).toLocaleString("vi-VN")} đ</p>
        <p><b>Tạm tính:</b> ${Number(hd.tam_tinh || 0).toLocaleString("vi-VN")} đ</p>
        <p><b>Hàng trả:</b> ${Number(hd.hang_tra || 0).toLocaleString("vi-VN")} đ</p>
        <p><b>Nợ cũ:</b> ${Number(hd.no_cu || 0).toLocaleString("vi-VN")} đ</p>
        <p><b>Trả NCC:</b> ${Number(hd.tra_tien || 0).toLocaleString("vi-VN")} đ</p>
        <p><b>Hình thức TT:</b> ${hd.hinh_thuc_thanh_toan || "-"}</p>
        <hr>
        <h3 class="total">TỔNG CỘNG: ${Number(hd.tong_cong || 0).toLocaleString("vi-VN")} đ</h3>
        <p><b>Ghi chú hóa đơn:</b> ${hd.ghi_chu || "-"}</p>
        <div class="sign">
          <p>Người lập phiếu nhập</p><br><br>
          <p>_________________________</p>
        </div>
      </div>
    </div>`;

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
}

function formatMoney(v) {
  return Number(v || 0).toLocaleString("vi-VN") + " ₫";
}

function formatDate(v) {
  if (!v) return "";
  const d = new Date(v);
  if (isNaN(d)) return v;
  const local =new Date(d.getTime() + 7 * 60 * 60 * 1000);
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
  genMaHoaDon();
});
</script>