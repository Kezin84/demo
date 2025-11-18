<template>
  <div class="invoice-app">
    
    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- TOP BAR: MÃ HĐ & KHÁCH HÀNG -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <div class="top-bar">
      
      <!-- PHẦN 1: MÃ HĐ & SỐ HĐ -->
      <div class="invoice-info">
        <div class="section-header">
          <div class="header-icon">🧾</div>
          <div class="header-content">
            <h3>Thông Tin Hóa Đơn</h3>
            <p>Quản lý mã và số hóa đơn</p>
          </div>
        </div>
        <div class="section-body">
          <div class="field">
            <label>Mã HĐ</label>
            <input style="font-weight: bold;" v-model="maHoaDon" readonly class="readonly" />
          </div>
          <div class="field">
            <label>Số HĐ</label>
            <input style="font-weight: bold;" v-model="soHoaDon" readonly />
          </div>
        </div>
      </div>

      <!-- PHẦN 2: THÔNG TIN KHÁCH HÀNG -->
      <div class="customer-info">
        <div class="section-header">
          <div class="header-icon">👤</div>
          <div class="header-content">
            <h3>Thông Tin Khách Hàng</h3>
            <p>Quản lý thông tin người mua</p>
          </div>
        </div>
        <div class="section-body">
          <div class="customer-grid">
            <div class="field">
              <label>Mã Khách</label>
              <input 
              style="font-weight: bold;"
                list="maKhachList" 
                v-model="maKhach" 
                @change="onKhachChange"
               
              />
              <datalist id="maKhachList">
                <option v-for="kh in dsKhachHang" :key="kh.ma_khach_hang" :value="kh.ma_khach_hang" />
              </datalist>
            </div>

            <div class="field">
              <label>Tên Khách</label>
              <input 
              style="font-weight: bold;"
                list="tenKhachList" 
                v-model="tenKhach" 
                @change="onKhachChange"
             
              />
              <datalist id="tenKhachList">
                <option v-for="kh in dsKhachHang" :key="kh.ten_khach_hang" :value="kh.ten_khach_hang" />
              </datalist>
            </div>

            <div class="field">
              <label>SĐT</label>
              <input v-model="sdt" />
            </div>

            <div class="field">
              <label>Địa Chỉ</label>
              <input v-model="diaChiKhach"  />
            </div>

            <div class="field">
              <label>Nợ Cũ</label>
              <input 
                :value="formatNum(noCu)" 
                @input="formatNumInput($event, 'noCu')" 
                placeholder="0"
              />
            </div>

            <div class="field">
              <label>Ghi Chú</label>
              <textarea v-model="ghiChuKhach" rows="1" ></textarea>
                <button 
            v-if="maKhach || tenKhach"
            class="reset-btn"
            @click="resetKhach"
          >
            <span>🔄</span>
            <span>Reset</span>
          </button>
            </div>
            
             
          </div>
          
        </div>
      </div>

    </div>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- MAIN CONTENT: 3 COLUMNS -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <div class="main-content">
      
      <!-- ════════════════════════════════════════════════════════ -->
      <!-- PHẦN 3: FORM NHẬP HÀNG (RESTRUCTURED) -->
      <!-- ════════════════════════════════════════════════════════ -->
      <div class="panel panel-3">
        <div class="panel-header">
          <h2>📝 Form Nhập Hàng</h2>
        </div>
        <div class="panel-body">
          
          <!-- THÔNG TIN NHÀ CUNG CẤP -->
         <!-- THÔNG TIN NHÀ CUNG CẤP -->
<div class="section-group">
  <div class="group-title group-title-inline">
    <div class="group-title-left">
      <span class="title-icon">🏭</span>
      <span style="font-weight: bold;font-size: large;">Thông Tin Nhà Cung Cấp</span>
    </div>

    <!-- 🔥 TOGGLE ẨN/HIỆN NCC -->
    <button
      type="button"
      class="toggle-ncc"
      @click="showNcc = !showNcc"
    >
      <span class="toggle-pill" :class="{ active: showNcc }">
        <span class="toggle-dot"></span>
      </span>
      <span class="toggle-label">
        {{ showNcc ? 'Ẩn NCC' : 'Hiện NCC' }}
      </span>
    </button>
  </div>

  <!-- 🔥 Bọc toàn bộ field NCC lại, dùng v-show -->
  <div class="ncc-fields" v-show="showNcc">
    <div class="field">
      <label>Tên NCC</label>
      <input v-model="nhaCungCap"  />
    </div>

    <div class="field">
      <label>Địa Chỉ NCC</label>
      <input v-model="diaChiNcc"  />
    </div>

    <div class="field">
      <label>Mã NCC</label>
      <div class="input-with-btn">
        <input
          list="maNccList"
          v-model="maNcc"
          @change="onNccChange"
        
        />
        <button class="field-btn" @click="taoMaNCC">
          <span>🧩</span>
          <span>Tạo mã</span>
        </button>
      </div>
      <datalist id="maNccList">
        <option
          v-for="ncc in dsNhaCungCap"
          :key="ncc.ma_nha_cung_cap"
          :value="ncc.ma_nha_cung_cap"
        />
      </datalist>
    </div>
  </div>
</div>


          <!-- THÔNG TIN SẢN PHẨM -->
          <div class="section-group">
            <div class="group-title">
              <span class="title-icon">📦</span>
              <span style="font-weight: bold;font-size: large;" >Thông Tin Sản Phẩm</span>
            </div>
            
            <div class="field">
              <label>Tên Hàng</label>
              <input 
              style="font-weight: bold;"
                list="tenHangList" 
                v-model="tenHang" 
                @change="onTenHangChange"
                
              />
              <datalist id="tenHangList">
                <option v-for="hh in dsHangHoa" :key="hh.ma_hang" :value="hh.ten_hang" />
              </datalist>
            </div>

            <div class="field">
              <label>Mã Hàng</label>
              <div class="input-with-btn">
                <input 
                style="font-weight: bold;"
                  list="hangOptions" 
                  v-model="maHang" 
                  @change="onHangChange"
                 
                />
                <button class="field-btn" @click="tuSinhMaHang">
                  <span>🔄</span>
                  <span>Tạo mã</span>
                </button>
              </div>
              <datalist id="hangOptions">
                <option v-for="hh in dsHangHoa" :key="hh.ma_hang" :value="hh.ma_hang" />
              </datalist>
            </div>
          </div>

          <!-- THÔNG SỐ SẢN PHẨM -->
          <div class="section-group">
            <div class="group-title">
              <span class="title-icon">📐</span>
              <span style="font-weight: bold;font-size: large;">Thông Số Sản Phẩm</span>
            </div>

            <div class="field-grid-4">
              <div class="field">
                <label>Danh Mục</label>
                <input v-model="danhMuc" />
              </div>
              <div class="field">
                <label>ĐVT</label>
                <input v-model="dvt"  />
              </div>
              <div class="field">
                <label>Size</label>
                <input v-model="size"  />
              </div>
        <div class="field">
  <label>SL TỒN KHO</label>

  <!-- ⭐ Khi CHƯA chọn hàng -->
  <input
    v-if="!maHang"
    v-model.number="soLuongKho"
    type="number"
    class="form-control"
    placeholder="Nhập số lượng tồn kho..."
  />

  <!-- ⭐ Khi chọn hàng có SL > 0 -->
  <input
    v-else-if="Number(soLuongKho) > 0"
    :value="soLuongKho"
    class="form-control readonly"
    readonly
  />

  <!-- ⭐ Khi chọn hàng có SL = 0 → hiện chữ HẾT HÀNG -->
  <input
    v-else
    value="HẾT HÀNG"
    class="form-control text-danger fw-bold"
    readonly
  />
</div>



            </div>
          </div>

          <!-- GIÁ -->
          <div class="section-group">
            <div class="group-title">
              <span class="title-icon">💰</span>
              <span style="font-weight: bold;font-size: large;">Giá</span>
            </div>

            <div class="field-grid-4">
              <div class="field">
                <label>Giá Bán</label>
                <input 
                  :value="formatNum(donGia)" 
                  @input="formatNumInput($event, 'donGia')" 
                  placeholder="0"
                  class="highlight"
                />
              </div>
              <div class="field">
                <label>Lãi %</label>
                <input 
                  v-model.number="phanTram" 
                  type="number" 
                  placeholder="0" 
                  @input="capNhatGiaNhapTheoGiaBan"
                />
              </div>
              <div class="field">
                <label>Giảm Giá</label>
                <input 
                  :value="formatNum(giamGia)" 
                  @input="formatNumInput($event, 'giamGia')" 
                  placeholder="0"
                />
              </div>
              <div class="field">
                <label>Giá Gốc</label>
                <input 
                  :value="formatNum(giaGoc)" 
                  @input="formatNumInput($event, 'giaGoc')" 
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <!-- GHI CHÚ -->
          <div class="section-group">
            <div class="field-row">
              <div class="field">
                <label>Ghi Chú Hàng</label>
                <textarea v-model="ghiChuHang" rows="2" placeholder="Ghi chú về sản phẩm..."></textarea>
              </div>
              <div class="field">
                <label>Ghi Chú Đơn</label>
                <textarea v-model="ghiChuDon" rows="2" placeholder="Ghi chú về đơn hàng..."></textarea>
              </div>
            </div>
          </div>

          <!-- NÚT SỐ LƯỢNG -->
         <div class="quantity-section">
  <label class="qty-label">Số Lượng</label>

  <!-- Nếu hết hàng thì hiện text -->
  

  <div class="qty-control">
    <button
      class="qty-btn minus"
      @click="giamSoLuong"

    >
      −
    </button>
    <input
      v-model.number="soLuong"
      type="number"
      class="qty-input"
      min="1"
  
    />
    <button
      class="qty-btn plus"
      @click="tangSoLuong"
    
    >
      +
    </button>
  </div>
</div>


          <!-- ACTIONS -->
         <div class="panel-actions">
  <button class="btn btn-danger" @click="traHang">
    <span>↩️</span>
    <span>Trả Hàng</span>
  </button>

  <button
    class="btn btn-success"
    @click="themHang"
    :disabled="Number(soLuongKho) <= 0"
  >
    <span>🛒</span>
    <span>Mua Hàng</span>
  </button>
</div>


        </div>
      </div>

      <!-- ════════════════════════════════════════════════════════ -->
      <!-- PHẦN 4: CHI TIẾT HÓA ĐƠN & THANH TOÁN -->
      <!-- ════════════════════════════════════════════════════════ -->
      <div class="panel panel-4">
        
        <!-- CHI TIẾT HÓA ĐƠN -->
        <div class="panel-header">
          <h2>📋 Chi Tiết Hóa Đơn</h2>
          <label class="import-btn">
            📁 Import
            <input type="file" accept=".xlsx, .xls" @change="importExcel" hidden />
          </label>
        </div>
        <div class="panel-body no-padding">
          
          <div class="table-container">
            <table class="data-table bordered">
              <thead>
                <tr>
                  <th style="width: 40px;">STT</th>
                  <th style="min-width: 140px;">Tên Hàng</th>
                  <th style="width: 60px;">ĐVT</th>
                  <th style="width: 60px;">Size</th>
                  <th style="width: 50px;">SL</th>
                  <th style="width: 100px;">Đơn Giá</th>
                  <th style="width: 110px;">T.Tiền</th>
                  <th style="width: 60px;">TT</th>
                  <th style="width: 70px;"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="chiTiet.length === 0">
                  <td colspan="9" class="empty">
                    <div class="empty-icon">📦</div>
                    <div>Chưa có sản phẩm</div>
                    <div class="empty-hint">Thêm sản phẩm để bắt đầu</div>
                  </td>
                </tr>
                <tr 
                  v-for="(item, i) in chiTiet" 
                  :key="i"
                  class="row-hover"
                  @click="moModalChinhSua(i)"
                >
                  <td>{{ i + 1 }}</td>
                  <td class="text-left">{{ item.tenHang }}</td>
                  <td>{{ item.dvt || '-' }}</td>
                  <td>{{ item.size || '-' }}</td>
                  <td>{{ item.soLuong }}</td>
                  <td class="text-right">{{ formatNum(item.donGia) }}</td>
                  <td :class="['text-right', item.trangThai === 'Mua' ? 'text-buy' : 'text-return']">
                    {{ formatNum(item.thanhTien) }}
                  </td>
                  <td>
                    <span :class="['badge', item.trangThai === 'Mua' ? 'badge-buy' : 'badge-return']">
                      {{ item.trangThai }}
                    </span>
                  </td>
                  <td>
                    <div class="row-actions">
                      <button class="icon-btn" @click.stop="moModalChinhSua(i)">✏️</button>
                      <button class="icon-btn" @click.stop="xoaHang(i)">🗑️</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Summary -->
          <div class="summary">
            <div class="summary-row">
              <span>Tạm tính</span>
              <span>{{ formatNum(tamTinh) }}</span>
            </div>
            <div class="summary-row">
              <span>Giảm giá</span>
              <span class="negative">-{{ formatNum(tongGiamGia) }}</span>
            </div>
            <div class="summary-row">
              <span>Hàng trả</span>
              <span class="negative">-{{ formatNum(hangTra) }}</span>
            </div>
            <div class="summary-row">
              <span>Nợ cũ</span>
              <span class="positive">{{ formatNum(noCu) }}</span>
            </div>
           
              <div class="summary-row">
  <span>Hình thức TT</span>
  <span>
    <!-- Nếu đã chọn hình thức -->
    <span
      v-if="hinhThuc || hinhThucThanhToan"
      :class="[
        'badge badge-pay',
        (hinhThuc || hinhThucThanhToan) === 'Tiền mặt' ? 'badge-pay-cash' : '',
        (hinhThuc || hinhThucThanhToan) === 'CK' ? 'badge-pay-transfer' : '',
        (hinhThuc || hinhThucThanhToan) === 'Nợ' ? 'badge-pay-debt' : ''
      ]"
    >
      {{ hinhThuc || hinhThucThanhToan }}
    </span>

    <!-- Nếu chưa chọn gì thì hiện dấu '-' -->
    <span v-else>-</span>
  </span>
</div>
 <div class="summary-row">
              <span>Khách trả</span>
              <span class="negative">-{{ formatNum(khachTra) }}</span>
            </div>
            <div class="summary-total">
              <span>TỔNG CỘNG</span>
              <strong>{{ formatNum(tongCong) }}</strong>
            </div>
          </div>

        </div>

        <!-- THANH TOÁN -->
        <div class="payment-section">
          <div class="section-title">
            <span class="title-icon">💳</span>
            <span>Thanh Toán</span>
          </div>
          
          <div class="payment-options">
            <button 
              class="payment-option cash"
              :class="{ active: hinhThucThanhToan === 'Tiền mặt' }"
              @click="chonHinhThuc('Tiền mặt')"
            >
              <span>💵</span>
              <span>Tiền mặt</span>
            </button>
            <button 
              class="payment-option transfer"
              :class="{ active: hinhThucThanhToan === 'CK' }"
              @click="chonHinhThuc('CK')"
            >
              <span>🏦</span>
              <span>Chuyển khoản</span>
            </button>
            <button 
              class="payment-option debt"
              :class="{ active: hinhThucThanhToan === 'Nợ' }"
              @click="chonHinhThuc('Nợ')"
            >
              <span>📝</span>
              <span>Nợ</span>
            </button>
          </div>

      <!-- Chỉ hiện khi chọn Tiền mặt hoặc CK -->
<div
  class="field"
  v-if="hinhThucThanhToan === 'Tiền mặt' || hinhThucThanhToan === 'CK'"
>
  <label>Số Tiền Khách Trả</label>
  <input
    :value="formatNum(tienThanhToan)"
    @input="formatNumInput($event, 'tienThanhToan')"
    
    class="input-large"
  />
</div>

<button
  class="btn btn-confirm btn-full btn-large"
  @click="xacNhanThanhToan"
  :disabled="daXacNhanThanhToan"
>
  <span v-if="!daXacNhanThanhToan"></span>
  <span v-else>✅</span>
  <span>{{ daXacNhanThanhToan ? 'ĐÃ THANH TOÁN' : 'THANH TOÁN' }}</span>
</button>

        </div>

        <!-- EXPORT -->
        <div class="export-section">
          <button class="btn btn-export-image btn-full" @click="xuatAnhHoaDonGiay">
            
            <span>XUẤT ẢNH TẠM 📸</span>
          </button>
          <button 
  class="btn btn-export-invoice btn-full export-btn"
  @click="xuatHoaDonTong"
  :disabled="isExporting"
>
  <span v-if="isExporting" class="spinner"></span>
  <span v-else>HOÀN THÀNH ĐƠN ✅</span>
</button>

        </div>

      </div>

      <!-- ════════════════════════════════════════════════════════ -->
      <!-- PHẦN 5: HÀNG CÓ SẴN TRONG KHO -->
      <!-- ════════════════════════════════════════════════════════ -->
      <div class="panel panel-5">
        <div class="panel-header">
          <h2>📦 Hàng Có Sẵn</h2><br>
          
        </div>
        <div class="panel-body no-padding">
          <div class="search-wrapper">
            <span class="search-icon">🔍</span>
            <input
              v-model="searchHangSan"
              placeholder="Tìm kiếm sản phẩm..."
              class="search-input"
            />
          </div>
          <div class="product-list">
            <div
              v-for="hh in filteredHangSan"
              :key="hh.ma_hang"
              class="product-item"
              @click="moModalHang(hh)"
            >
              <div class="product-qr">
                <img 
                  :src="hh.qr_img || 'https://placehold.co/70x70?text=No'" 
                  alt="QR"
                />
              </div>
              <div class="product-info">
                <div class="product-code">{{ hh.ma_hang }}</div>
                <div class="product-name">{{ hh.ten_hang }}</div>
               <div class="product-meta">
  <span>KHO: <strong>{{ hh.so_luong_kho }}</strong> </span>
  <span>GIÁ BÁN: <strong>{{ formatNum(hh.don_gia) }}</strong></span>
  <span
    v-if="Number(hh.so_luong_kho) <= 0"
    class="badge badge-out-of-stock"
  >
    Hết hàng
  </span>
</div>

<div class="product-controls">
  <div
    class="qty-control-compact"
    :class="{ 'disabled': Number(hh.so_luong_kho) <= 0 }"
  >
    <button
      class="qty-btn-compact minus"
      @click.stop="hh.soLuongChon = Math.max(1, (hh.soLuongChon || 1) - 1)"
      :disabled="Number(hh.so_luong_kho) <= 0"
    >
      −
    </button>
    <input
      type="number"
      v-model.number="hh.soLuongChon"
      min="1"
      class="qty-input-compact"
      @click.stop
      :disabled="Number(hh.so_luong_kho) <= 0"
    />
    <button
      class="qty-btn-compact plus"
      @click.stop="hh.soLuongChon = (hh.soLuongChon || 1) + 1"
      :disabled="Number(hh.so_luong_kho) <= 0"
    >
      +
    </button>
  </div>

  <div class="control-btns">
    <!-- MUA: khóa nếu hết kho -->
      <button
      class="control-btn return"
      @click.stop="addChiTietHang(hh, 'Trả', hh.soLuongChon)"
    >
       Trả
    </button>
    <button
      class="control-btn buy"
      @click.stop="addChiTietHang(hh, 'Mua', hh.soLuongChon)"
      :disabled="Number(hh.so_luong_kho) <= 0"
    >
       Mua
    </button>

    <!-- TRẢ: luôn cho phép -->
   
  </div>
</div>

              </div>
             
            </div>
          </div>

        </div>
      </div>

    </div>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- MODALS (GIỮ NGUYÊN) -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    
    <!-- MODAL CHỈNH SỬA -->
    <!-- MODAL CHỈNH SỬA -->
     <Teleport to="body">
<div class="modal fade modal-edit" id="editModal" tabindex="-1">

      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white py-2">
            <h5 class="modal-title">✏️ Chỉnh sửa sản phẩm</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
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
            <div class="row g-2 mb-2">
             <div class="col-6">
  <label class="form-label">Số lượng</label>

  <input 
    v-model.number="editItem.soLuong" 
    type="number" 
    class="form-control form-control-sm" 
  />

  <!-- 🔥 HIỂN THỊ SỐ LƯỢNG TỒN KHO -->
  <div class="mt-1 small text-muted">
    Tồn kho: 
    <span 
      class="fw-bold"
      :class="{
        'text-danger': (editItem.soLuongKho || 0) === 0,
        'text-danger': (editItem.soLuongKho || 0) > 0 && (editItem.soLuongKho || 0) < 5,
        'text-danger': (editItem.soLuongKho || 0) >= 5
      }"
    >
      {{ editItem.soLuongKho || 0 }}
    </span>
  </div>
</div>

              <div class="col-6">
                <label class="form-label">Đơn giá</label>
                <input v-model.number="editItem.donGia" type="number" class="form-control form-control-sm" />
              </div>
            </div>
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
            <div class="mb-2">
              <label class="form-label">Ghi chú</label>
              <textarea v-model="editItem.ghiChuDon" class="form-control form-control-sm" rows="2"></textarea>
            </div>
          </div>
          <div class="modal-footer py-2 d-flex justify-content-between">
            <button class="btn btn-danger btn-sm" @click="xoaTuModal">🗑️ Xóa</button>
            <div>
              <button class="btn btn-secondary btn-sm me-1" data-bs-dismiss="modal">Đóng</button>
              <button class="btn btn-success btn-sm" @click="luuChinhSua">Lưu</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Teleport>

    <!-- MODAL CHI TIẾT HÀNG -->
<div
  v-if="showModalHang"
  class="modal fade show d-block bg-dark bg-opacity-50 modal-detail"
>
  <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-3">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title fw-bold">🧾 Thông tin chi tiết hàng hóa</h5>
            <button class="btn-close" @click="showModalHang = false"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label fw-bold small">📦 Mã hàng</label>
                <input v-model="chiTietHang.ma_hang" class="form-control form-control-sm" readonly />
                <label class="form-label fw-bold small mt-2">🏷️ Tên hàng</label>
                <input v-model="chiTietHang.ten_hang" class="form-control form-control-sm" readonly />
                <label class="form-label fw-bold small mt-2">🗂️ Danh mục</label>
                <input v-model="chiTietHang.danh_muc" class="form-control form-control-sm" readonly />
                <label class="form-label fw-bold small mt-2">🏭 Mã NCC</label>
                <input v-model="chiTietHang.ma_nha_cung_cap" class="form-control form-control-sm" readonly />
                <label class="form-label fw-bold small mt-2">🏷️ Tên NCC</label>
                <input v-model="chiTietHang.ten_nha_cung_cap" class="form-control form-control-sm" readonly />
              </div>
              <div class="col-md-4">
                <label class="form-label fw-bold small">📏 Size</label>
                <input v-model="chiTietHang.size" class="form-control form-control-sm" readonly />
                <label class="form-label fw-bold small mt-2">⚖️ ĐVT</label>
                <input v-model="chiTietHang.dvt" class="form-control form-control-sm" readonly />
                <label class="form-label fw-bold small mt-2">📦 SL kho</label>
                <input v-model="chiTietHang.so_luong_kho" class="form-control form-control-sm" readonly />
                <label class="form-label fw-bold small mt-2">📦 SL lô</label>
                <input v-model="chiTietHang.so_luong_lo" class="form-control form-control-sm" readonly />
                <label class="form-label fw-bold small mt-2">📦 Số cái/lô</label>
                <input v-model="chiTietHang.so_cai_1_lo" class="form-control form-control-sm" readonly />
              </div>
              <div class="col-md-4">
                <label class="form-label fw-bold small">💰 Giá gốc</label>
                <input :value="formatNum(chiTietHang.gia_goc)" class="form-control form-control-sm" readonly />
                <label class="form-label fw-bold small mt-2">💵 Giá bán</label>
                <input :value="formatNum(chiTietHang.don_gia)" class="form-control form-control-sm" readonly />
                <label class="form-label fw-bold small mt-2">💲 Giá 1 lô</label>
                <input :value="formatNum(chiTietHang.gia_1_lo)" class="form-control form-control-sm" readonly />
                <label class="form-label fw-bold small mt-2">🕓 Thời gian tạo</label>
                <input v-model="chiTietHang.thoi_gian_tao_duong_lich" class="form-control form-control-sm" readonly />
              </div>
              <div class="col-12 mt-3 text-center">
                <img
                  v-if="chiTietHang.url_hinh_anh"
                  :src="chiTietHang.url_hinh_anh"
                  alt="Hình ảnh"
                  class="img-fluid rounded shadow-sm"
                  style="max-height: 180px;"
                />
                <div v-else class="text-muted small">⚠️ Chưa có hình ảnh</div>
              </div>
              <div class="col-12">
                <label class="form-label fw-bold small">📝 Ghi chú</label>
                <textarea v-model="chiTietHang.ghi_chu" rows="2" class="form-control form-control-sm" readonly></textarea>
              </div>
              <div class="col-12 text-center mt-3">
                <img
                  v-if="chiTietHang.qr_img"
                  :src="chiTietHang.qr_img"
                  alt="QR"
                  class="img-fluid rounded"
                  style="max-width: 160px;"
                />
                <div v-else class="text-muted small">⚠️ Chưa có QR</div>
              </div>
            </div>
          </div>
          <div class="modal-footer d-flex justify-content-between">
            <button class="btn btn-secondary" @click="showModalHang = false">Đóng</button>
            <div>
              <button class="btn btn-success me-2" @click="addChiTietHang(chiTietHang, 'Mua')">🛒 Mua</button>
              <button class="btn btn-danger" @click="addChiTietHang(chiTietHang, 'Trả')">↩️ Trả</button>
            </div>
          </div>
        </div>
      </div>
    </div>
<!-- 🔥 GLOBAL ALERT MODAL -->
<div v-if="alertModal.show" class="custom-alert-backdrop">
  <div class="custom-alert-box">
    <h4 class="alert-title" :class="alertModal.type">
      {{ alertModal.title }}
    </h4>

    <p class="alert-message">{{ alertModal.message }}</p>

    <button class="btn btn-primary w-100 mt-2" @click="closeAlertModal">
      OK
    </button>
  </div>
</div>

  </div>
</template>

<style scoped>


/* ╔══════════════════════════════════════════════╗
   ║  PALETTE & BASE TOKENS                       ║
   ╚══════════════════════════════════════════════╝ */
:root {
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --primary-light: #3b82f6;
  --primary-soft: #eff6ff;

  --success: #16a34a;
  --success-dark: #15803d;
  --success-soft: #f0fdf4;
  
  --danger: #ef4444;
  --danger-dark: #dc2626;
  --danger-soft: #fef2f2;
  
  --warning: #f59e0b;
  --warning-dark: #d97706;

  --info: #0ea5e9;
  --info-dark: #0284c7;

  --text: #0f172a;
  --text-muted: #64748b;
  --text-light: #94a3b8;

  --border-subtle: #e2e8f0;
  --border-strong: #cbd5e1;

  --bg-page: #f1f5f9;
  --bg-surface: #ffffff;
  --bg-hover: #f8fafc;

  --shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.06);
  --shadow-md: 0 3px 10px rgba(15, 23, 42, 0.08);
  --shadow-lg: 0 10px 25px rgba(15, 23, 42, 0.12);

  --radius-xs: 0.375rem;
  --radius-sm: 0.6rem;
  --radius-md: 0.9rem;
  --radius-lg: 1.25rem;

  --transition-fast: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ╔══════════════════════════════════════════════╗
   ║  LAYOUT CHUNG                                ║
   ╚══════════════════════════════════════════════╝ */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.invoice-app {
  min-height: 100vh;
  padding: 1.5rem 2rem 2rem;
  background: linear-gradient(135deg, #e0e7ff 0%, #f1f5f9 100%);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: var(--text);
  -webkit-font-smoothing: antialiased;
  
}

.invoice-app > .top-bar,
.invoice-app > .main-content {
  max-width: 1700px;
  margin-inline: auto;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.6);
  padding: 1.25rem;
  box-shadow: var(--shadow-lg);
}

/* ╔══════════════════════════════════════════════╗
   ║  TOP BAR: MÃ HĐ + KHÁCH HÀNG                 ║
   ╚══════════════════════════════════════════════╝ */
.top-bar {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.invoice-info,
.customer-info {
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: var(--transition);
}

.invoice-info:hover,
.customer-info:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

/* ╔══════════════════════════════════════════════╗
   ║  SECTION HEADER                             ║
   ╚══════════════════════════════════════════════╝ */
.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
  border-bottom: 3px solid #1d4ed8;
  position: relative;
}

.section-header::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #60a5fa, transparent);
}

.header-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  font-size: 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.header-content {
  flex: 1;
}

.header-content h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.02em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.header-content p {
  margin: 0.2rem 0 0;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
}

.reset-btn {
  padding: 0.5rem 1.1rem;
  border-radius: 999px;
  border: 1.5px solid rgba(248, 250, 252, 0.7);
  background: rgba(247, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  cursor: pointer;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: var(--transition-fast);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.reset-btn:hover {
  background: #ef4444;
  border-color: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* ╔══════════════════════════════════════════════╗
   ║  SECTION BODY                               ║
   ╚══════════════════════════════════════════════╝ */
.section-body {
  padding: 1.1rem 1.25rem;
  background: var(--bg-surface);
}

.invoice-info .section-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.customer-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0.85rem;
}

/* ╔══════════════════════════════════════════════╗
   ║  MAIN CONTENT: 3 PANEL                       ║
   ╚══════════════════════════════════════════════╝ */
.main-content {
  display: grid;
  grid-template-columns: 450px minmax(0, 1.15fr) 400px;
  gap: 1.25rem;
  align-items: stretch;  /* 🔥 cho 3 cột cao bằng nhau */
}


/* ╔══════════════════════════════════════════════╗
   ║  PANEL / CARD                                ║
   ╚══════════════════════════════════════════════╝ */
.panel {
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: var(--transition);
}

.panel:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

/* HEADER PANEL */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.15rem;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #e2e8f0;
  border-bottom: 2px solid #334155;
  border-radius: 15px;
}

.panel-header h2 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.panel-header h2::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 8px #22c55e;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* BODY PANEL */
.panel-body {
  padding: 1.15rem 1.25rem;
  background: #fafbfc;
}

.panel-body.no-padding {
  padding: 0;
}

/* ╔══════════════════════════════════════════════╗
   ║  SECTION GROUP + GROUP TITLE                ║
   ╚══════════════════════════════════════════════╝ */
.section-group {
  margin-bottom: 1.1rem;
  padding-bottom: 1rem;
  border-bottom: 2px dashed var(--border-subtle);
}

.section-group:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.group-title {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.9rem;
  background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
  border-left: 3px solid var(--primary);
  border-radius: 0.75rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 0.9rem;
  letter-spacing: 0.03em;
}
.group-title-inline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.group-title-left {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* TOGGLE NCC */
.toggle-ncc {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background: #f9fafb;
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
  box-shadow: var(--shadow-xs);
  transition: var(--transition-fast);
}

.toggle-ncc:hover {
  background: #e5edff;
  border-color: var(--primary);
  box-shadow: var(--shadow-sm);
}

.toggle-pill {
  position: relative;
  width: 32px;
  height: 18px;
  border-radius: 999px;
  background: #e5e7eb;
  display: inline-flex;
  align-items: center;
  padding: 2px;
  transition: var(--transition-fast);
}

.toggle-pill.active {
  background: #4ade80;
}

.toggle-dot {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.4);
  transform: translateX(0);
  transition: var(--transition-fast);
}

.toggle-pill.active .toggle-dot {
  transform: translateX(14px);
}

.toggle-label {
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
  
.ncc-fields {
  margin-top: 0.75rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.title-icon {
  font-size: 1.1rem;
}

.panel-actions {
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 2px dashed var(--border-subtle);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
}

/* ╔══════════════════════════════════════════════╗
   ║  QUANTITY SECTION                           ║
   ╚══════════════════════════════════════════════╝ */
.quantity-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px dashed var(--border-subtle);
}

.qty-label {
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.6rem;
  text-align: center;
}

/* ► SỐ LƯỢNG: 3 viên tròn nổi bật */
.qty-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  max-width: 260px;
  margin: 0 auto;
  border: none;
  background: transparent;
  box-shadow: none;
}

/* nút tròn + / - */
.qty-btn {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1.5px solid var(--border-strong);
  background: radial-gradient(circle at 30% 20%, #ffffff, #e5edff);
  color: var(--primary-dark);
  font-size: 1.4rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
}

.qty-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(37, 99, 235, 0.25);
}

.qty-btn:active {
  transform: translateY(0);
  box-shadow: var(--shadow-xs);
}

/* ô số lượng tròn */
.qty-control .qty-input {
  width: 80px;
  height: 44px;
  border-radius: 999px;
  border: 1.5px solid var(--primary);
  text-align: center;
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--primary-dark);
  background: #ffffff;
  padding: 0.3rem 0.5rem;
  outline: none;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.18);
  font-variant-numeric: tabular-nums;
}

.qty-control .qty-input:focus {
  box-shadow:
    0 0 0 3px var(--primary-soft),
    0 6px 14px rgba(37, 99, 235, 0.25);
}

.qty-control .qty-input::-webkit-inner-spin-button,
.qty-control .qty-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}


/* ╔══════════════════════════════════════════════╗
   ║  FORM – FIELD / INPUT                        ║
   ╚══════════════════════════════════════════════╝ */
.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  color: var(--text-muted);
}

/* ► INPUT: viền nhẹ + bóng nhẹ, focus bóng rõ hơn */
/* INPUT + TEXTAREA: bo tròn 15px + bóng nhẹ */
.field input,
.field textarea {
  width: 100%;
  border-radius: 15px; /* ⬅ bo góc 15px */
  border: 1px solid var(--border-subtle);
  padding: 0.6rem 0.85rem;
  font-size: 0.9rem;
  color: var(--text);
  background: #ffffff;
  outline: none;
  transition: var(--transition-fast);
  font-family: Arial, Helvetica, sans-serif;

  /* bóng mặc định */
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.10);
}

/* hover: bóng đậm hơn chút */
.field input:hover,
.field textarea:hover {
  border-color: var(--border-strong);
  background: var(--bg-hover);
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.14);
}

/* focus: viền xanh + bóng mạnh hơn */
.field input:focus,
.field textarea:focus {
  border-color: var(--primary);
  background: #ffffff;
  box-shadow:
    0 0 0 2px var(--primary-soft),
    0 8px 20px rgba(37, 99, 235, 0.25);
}

.field textarea {
  resize: vertical;
  min-height: 2.5rem;
}

.field input::placeholder,
.field textarea::placeholder {
  color: var(--text-light);
}

.field input:hover,
.field textarea:hover {
  border-color: var(--border-strong);
  background: var(--bg-hover);
  box-shadow: var(--shadow-sm);
}

.field input:focus,
.field textarea:focus {
  border-color: var(--primary);
  background: #ffffff;
  box-shadow:
    0 0 0 2px var(--primary-soft),
    0 6px 14px rgba(37, 99, 235, 0.20);
}

.field input.readonly {
  background: #f8fafc;
  border-style: dashed;
  color: var(--text-light);
  cursor: not-allowed;
  box-shadow: none;
}

.field input.highlight {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid var(--warning);
  color: #92400e;
  font-weight: 800;
  font-size: 1rem;
}

/* Ô SỐ TIỀN KHÁCH TRẢ – luôn nổi bật */
.payment-section .input-large {
  font-size: 1.25rem !important;
  font-weight: 800;
  text-align: center;
  padding: 0.9rem 1.4rem !important;

  border-radius: 999px;
  border: 2px solid rgba(22, 163, 74, 0.55);
  background: radial-gradient(circle at 0% 0%, #fefce8, #ffffff);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.03em;

  box-shadow:
    0 10px 26px rgba(15, 23, 42, 0.22),
    0 0 0 1px rgba(248, 250, 252, 0.9);

  transition: var(--transition-fast);
}

/* Hover – nổi lên nhẹ */
.payment-section .input-large:hover {
  border-color: rgba(37, 99, 235, 0.7);
  background: radial-gradient(circle at 0% 0%, #fef9c3, #ffffff);
  box-shadow:
    0 14px 32px rgba(37, 99, 235, 0.28),
    0 0 0 1px rgba(191, 219, 254, 0.95);
  transform: translateY(-1px);
}

/* Focus – đang nhập, đổ bóng mạnh + viền xanh lá */
.payment-section .input-large:focus {
  border-color: #16a34a;
  background: radial-gradient(circle at 0% 0%, #fef9c3, #ffffff);
  box-shadow:
    0 18px 40px rgba(22, 163, 74, 0.36),
    0 0 0 2px rgba(187, 247, 208, 0.95);
  outline: none;
}

/* layout field */
.field-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
}

.field-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.85rem;
  margin-bottom: 0.85rem;
}

/* field + button */
.input-with-btn {
  display: flex;
  gap: 0.5rem;
}

.input-with-btn input {
  flex: 1;
}

/* ╔══════════════════════════════════════════════╗
   ║  NÚT CHUNG (bo góc mềm)                      ║
   ╚══════════════════════════════════════════════╝ */
/* NÚT TẠO MÃ – LÀM ĐẬM, DỄ THẤY HƠN */
.field-btn {
  min-width: auto;
  padding: 0.6rem 1.1rem;
  border-radius: 999px;
  border: 1.5px solid #1d4ed8;
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  box-shadow:
    0 4px 10px rgba(37, 99, 235, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.6);
  transition: var(--transition-fast);
  white-space: nowrap;
}

.field-btn:hover {
  background: linear-gradient(135deg, #1e40af, #1d4ed8);
  border-color: #1e3a8a;
  transform: translateY(-1px);
  box-shadow:
    0 6px 14px rgba(30, 64, 175, 0.45),
    0 0 0 1px rgba(219, 234, 254, 0.9);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.7rem 1.4rem;
  border-radius: 999px;
  border: 1.5px solid var(--border-subtle);
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-fast);
  background: #ffffff;
  font-family: Arial, Helvetica, sans-serif;
  letter-spacing: 0.02em;
  color: var(--text);
}

.btn-full {
  width: 100%;
}

.btn-large {
  padding-block: 0.9rem;
  font-size: 1rem;
  font-weight: 800;
}

/* PRIMARY / STATES */
.btn-primary {
  background: #2563eb;
  border-color: #1d4ed8;
  color: #ffffff;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-success {
  background: #16a34a;
  border-color: #15803d;
  color: #ffffff;
}

.btn-success:hover {
  background: #15803d;
}

.btn-danger {
  background: #ef4444;
  border-color: #dc2626;
  color: #ffffff;
}

.btn-danger:hover {
  background: #dc2626;
}

.btn-secondary {
  background: #e5e7eb;
  border-color: #d1d5db;
  color: #374151;
}

.btn-secondary:hover {
  background: #d1d5db;
}

/* nút xác nhận thanh toán */
.btn-confirm {
  background: #16a34a;
  border-color: #15803d;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(22, 163, 74, 0.25);
}

.btn-confirm:hover {
  background: #15803d;
  box-shadow: 0 6px 14px rgba(22, 163, 74, 0.3);
}
.btn-confirm:disabled {
  background: #16a34a;
  border-color: #15803d;
  color: #ffffff;
  opacity: 0.8;
  box-shadow: none;
  cursor: default;
  transform: none;
}

/* trạng thái disabled chung */
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* ╔══════════════════════════════════════════════╗
   ║  NÚT EXPORT                                 ║
   ╚══════════════════════════════════════════════╝ */
.btn-export-image {
  background: #f97316;
  border-color: #ea580c;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(249, 115, 22, 0.25);
}

.btn-export-image:hover {
  background: #ea580c;
  box-shadow: 0 6px 14px rgba(249, 115, 22, 0.35);
}

.btn-export-invoice {
  background: #0ea5e9;
  border-color: #0284c7;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(14, 165, 233, 0.25);
}

.btn-export-invoice:hover {
  background: #0284c7;
  box-shadow: 0 6px 14px rgba(14, 165, 233, 0.35);
}

/* ╔══════════════════════════════════════════════╗
   ║  SEARCH / IMPORT BUTTON                      ║
   ╚══════════════════════════════════════════════╝ */
/* 🔍 SEARCH BAR SIÊU MƯỢT */
.search-wrapper {
  position: relative;
  flex: 1;
  max-width: 360px;

  display: flex;
  align-items: center;

  padding: 3px;
  border-radius: 999px;
  background:
    radial-gradient(circle at 0% 0%, #e0edff, #f9fafb);
  border: 1px solid rgba(148, 163, 184, 0.45);
  box-shadow:
    0 10px 26px rgba(15, 23, 42, 0.18),
    0 0 0 1px rgba(255, 255, 255, 0.9);
  transition: var(--transition-fast);
}

/* highlight viền khi focus vào input */
.search-wrapper:focus-within {
  border-color: rgba(37, 99, 235, 0.6);
  box-shadow:
    0 14px 30px rgba(37, 99, 235, 0.25),
    0 0 0 1px rgba(191, 219, 254, 0.9);
  background:
    radial-gradient(circle at 0% 0%, #dbeafe, #f9fafb);
}

/* icon tròn nổi bên trái */
.search-icon {
  position: absolute;
  top: 50%;
  left: 8px;
  transform: translateY(-50%);

  display: flex;
  align-items: center;
  justify-content: center;

  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: #ffffff;
  font-size: 0.95rem;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.5);
  pointer-events: none;
  transition: var(--transition-fast);
}

/* icon “nảy” nhẹ khi focus */
.search-wrapper:focus-within .search-icon {
  transform: translateY(-50%) scale(1.05);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.6);
}

/* input pill trắng, bo tròn + bóng nhẹ */
.search-input {
  width: 100%;
  border: none;
  outline: none;

  border-radius: 999px;
  padding: 0.6rem 1.1rem 0.6rem 3.1rem; /* chừa chỗ icon */
  font-size: 0.9rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.96);
  color: var(--text);
  box-shadow: 0 1px 2px rgba(148, 163, 184, 0.3) inset;
  transition: var(--transition-fast);
}

.search-input::placeholder {
  color: var(--text-light);
}

/* hover + focus nhẹ cho input */
.search-input:hover {
  background: #ffffff;
}

.search-input:focus {
  background: #ffffff;
  box-shadow:
    0 0 0 1px rgba(191, 219, 254, 0.9),
    0 8px 20px rgba(148, 163, 184, 0.4);
}


.import-btn {
  padding: 0.55rem 0.95rem;
  border-radius: 999px;
  border: 1.5px solid var(--border-subtle);
  background: #f8fafc;
  color: var(--primary-dark);
  font-size: 0.82rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-fast);
}

.import-btn:hover {
  background: var(--primary-soft);
  border-color: var(--primary);
}

/* ╔══════════════════════════════════════════════╗
   ║  TABLE CHI TIẾT – kẻ viền rõ ràng           ║
   ╚══════════════════════════════════════════════╝ */
/* ╔══════════════════════════════════════════════╗
   ║  TABLE CHI TIẾT – kẻ viền rõ, bo góc đẹp     ║
   ╚══════════════════════════════════════════════╝ */
/* ╔══════════════════════════════════════════════╗
   ║  TABLE CHI TIẾT – gọn, cân đối, chuyên nghiệp ║
   ╚══════════════════════════════════════════════╝ */
.table-container {
  max-height: 360px;                         /* cao vừa mắt, không lùn quá */
  overflow-y: auto;
  background: #ffffff;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-sm);
}

/* Bảng gọn, không bị viền đôi */
.data-table {
  width: 100%;
  border-collapse: collapse;                  /* dùng collapse cho nét gọn */
  font-size: 0.95rem;
  background: #ffffff;
  table-layout: fixed;                        /* cột đều, không nhảy lung tung */
  text-align: center;
}

/* HEADER dính trên, tone nhẹ hơn 1 xíu */
.data-table thead {
  position: sticky;
  top: 0;
  z-index: 5;
}

.data-table thead tr {
  background: linear-gradient(135deg, #e5edff 0%, #e0e7ff 100%);
}

.data-table th {
  padding: 0.6rem 0.45rem;
  text-align: center;
  font-size: 1rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: var(--primary-dark);
  border-bottom: 1px solid #cbd5f5;
}

/* BODY */
.data-table td {
  padding: 0.55rem 0.45rem;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text);
  vertical-align: middle;
  font-weight: bold;
}

/* Hàng cuối cùng không cần border đậm */
.data-table tbody tr:last-child td {
  border-bottom: none;
}

/* Sọc ziczac nhẹ */
.data-table tbody tr:nth-child(odd)  { background: #f9fafb; }
.data-table tbody tr:nth-child(even) { background: #ffffff; }

/* Hover rõ nhưng không chói */
.data-table tbody tr.row-hover {
  cursor: pointer;
  transition: var(--transition-fast);
}
.data-table tbody tr.row-hover:hover {
  background: #e0edff;
}

/* Căn text */
.text-left {
  text-align: center !important;
  font-weight: 600;
}
.text-right {
  text-align: right !important;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

/* Màu tiền MUA / TRẢ */
.text-buy {
  color: var(--success-dark);
}
.text-return {
  color: var(--danger-dark);
}

/* Badge trạng thái */
.badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.badge-buy {
  background: #dcfce7;
  color: var(--success-dark);
  border: 1px solid var(--success);
}

.badge-return {
  background: #fee2e2;
  color: var(--danger-dark);
  border: 1px solid var(--danger);
}

/* Nút trong cột cuối */
.row-actions {
  display: flex;
  gap: 0.35rem;
  justify-content: center;
}

.icon-btn {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-fast);
  font-size: 0.8rem;
}
.icon-btn:hover {
  background: var(--primary-soft);
  border-color: var(--primary);
}

/* Hàng trống */
.empty {
  padding: 2.5rem 1rem !important;
  text-align: center;
  color: var(--text-muted);
}
.empty-icon {
  font-size: 2.6rem;
  margin-bottom: 0.4rem;
  opacity: 0.6;
}
.empty-hint {
  font-size: 0.78rem;
  color: var(--text-light);
  margin-top: 0.15rem;
}

/* ╔══════════════════════════════════════════════╗
   ║  SUMMARY / THÔNG TIN BẢNG                   ║
   ╚══════════════════════════════════════════════╝ */
.summary {
  margin-top: 1rem;
  padding: 1rem 1.1rem;
  background: #ffffff;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-sm);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding-block: 0.3rem;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.summary-row + .summary-row {
  border-top: 1px dashed var(--border-subtle);
  padding-top: 0.4rem;
  margin-top: 0.3rem;
}

.summary-row span:first-child {
  color: var(--text);
  font-weight: 700;
}

.summary-row .positive {
  color: var(--success);
  font-weight: 700;
}

.summary-row .negative {
  color: var(--danger);
  font-weight: 700;
}

.summary-total {
  margin-top: 0.8rem;
  padding-top: 0.7rem;
  border-top: 2px solid var(--primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;      /* 🔥 label TỔNG CỘNG to hơn */
  font-weight: 900;       /* 🔥 đậm hơn */
  color: var(--primary-dark);
  text-transform: uppercase;
  letter-spacing: 0.06em; /* nhìn “hoá đơn” hơn */
}
.summary-total span:first-child {
  font-weight: 900;       /* 🔥 chữ TỔNG CỘNG đậm */
}
.summary-total strong {
  font-size: 1.8rem;      /* 🔥 số tiền to rõ */
  font-weight: 900;
  color: var(--primary-dark);
  font-variant-numeric: tabular-nums;
}

/* ╔══════════════════════════════════════════════╗
   ║  PAYMENT / THANH TOÁN – card mềm            ║
   ╚══════════════════════════════════════════════╝ */
.payment-section {
  margin-top: 1rem;
  padding: 1rem 1.1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background: #ffffff;
  box-shadow: var(--shadow-sm);
}
.payment-section .field {
  margin-bottom: 0.75rem;
}

/* đảm bảo nút xác nhận không bị dính sát lên trên */
.payment-section .btn-confirm {
  margin-top: 0.1rem;
}
.section-title {
  margin-bottom: 0.9rem;
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--text);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  letter-spacing: 0.02em;
}

.payment-options {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.payment-option {
  border-radius: 999px;
  border: 1.5px solid black;
  padding: 0.85rem 0.75rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 700;
  text-align: center;
  display: grid;
  place-items: center;
  gap: 0.35rem;
  transition: var(--transition-fast);
  box-shadow: var(--shadow-sm);
  background: #f9fafb;
  color: var(--text);
}

.payment-option span:first-child {
  font-size: 1.4rem;
}

.payment-option:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.payment-option.cash {
  border-color: #bbf7d0;
}

.payment-option.transfer {
  border-color: #bfdbfe;
}

.payment-option.debt {
  border-color: #fed7aa;
}

.payment-option.cash.active {
  background: #16a34a;
  border-color: #15803d;
  color: #ffffff;
}

.payment-option.transfer.active {
  background: #2563eb;
  border-color: #1d4ed8;
  color: #ffffff;
}

.payment-option.debt.active {
  background: #f59e0b;
  border-color: #d97706;
  color: #ffffff;
}

/* ╔══════════════════════════════════════════════╗
   ║  EXPORT SECTION                              ║
   ╚══════════════════════════════════════════════╝ */
.export-section {
  margin-top: 0.85rem;
  padding: 0.9rem 1.1rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background: #ffffff;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

/* ╔══════════════════════════════════════════════╗
   ║  HÀNG CÓ SẴN TRONG KHO                      ║
   ╚══════════════════════════════════════════════╝ */
.product-list {
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 270px);
  overflow-y: auto;
  padding: 0.75rem;
  background: transparent;
  border-radius: var(--radius-lg);
  border: none;
  gap: 0.75rem;
}
.product-item {
  display: grid;
  grid-template-columns: 75px minmax(0, 1fr) auto; /* QR – info – controls */
  gap: 0.85rem;
  padding: 0.9rem 1rem;
  cursor: pointer;

  background: #ffffff;
  border-radius: 15px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  box-shadow:
    0 6px 18px rgba(15, 23, 42, 0.18),
    0 0 0 1px rgba(148, 163, 184, 0.15);
  transition: var(--transition-fast);
  align-items: stretch;
}

.product-item:hover {
  background: #f1f5f9;
  transform: translateY(-4px);
  box-shadow:
    0 12px 32px rgba(15, 23, 42, 0.26),
    0 0 0 1px rgba(59, 130, 246, 0.35);
}
.product-qr {
  width: 75px;
  height: 75px;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--border-subtle);
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.product-qr img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  min-width: 0; /* rất quan trọng trong grid/flex để ellipsis hoạt động */
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
}


.product-code {
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--primary-dark);
  letter-spacing: 0.02em;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-name {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text);
  line-height: 1.3;
  overflow-wrap: anywhere; /* nếu tên có chuỗi dài không dấu / không space */
}

.product-meta {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.76rem;
  color: var(--text-muted);
  font-weight: 600;
}
.product-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.45rem;
}
/* ► SỐ LƯỢNG COMPACT – cũng tròn 3 viên */
.qty-control-compact {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  border: none;
  background: transparent;
}

.qty-btn-compact {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  border: 1.5px solid var(--border-strong);
  background: #f1f5f9;
  color: var(--primary-dark);
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
}

.qty-btn-compact:hover {
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.22);
}

.qty-input-compact {
  min-width: 40px;
  max-width: 55px;
  height: 34px;
  border-radius: 999px;
  border: 1.5px solid var(--primary);
  text-align: center;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--primary-dark);
  background: #ffffff;
  padding: 0.2rem 0.3rem;
  outline: none;
  box-shadow: 0 3px 8px rgba(37, 99, 235, 0.2);
}
/* Nút - đỏ, + xanh lá */
.qty-btn-compact.minus {
  background: #fee2e2;
  border-color: #fecaca;
  color: #dc2626;
}

.qty-btn-compact.plus {
  background: #dcfce7;
  border-color: #bbf7d0;
  color: #15803d;
}
.qty-input-compact:focus {
  box-shadow:
    0 0 0 2px var(--primary-soft),
    0 4px 10px rgba(37, 99, 235, 0.24);
}

.qty-input-compact::-webkit-inner-spin-button,
.qty-input-compact::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.control-btns {
  display: flex;
  gap: 0.4rem;
}

/* nút Mua / Trả bên Hàng có sẵn */
.control-btn {
  flex: 1;
  padding: 0.55rem 0.5rem;
  border-radius: 999px;
  border: 1.5px solid transparent;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
}

.control-btn.buy {
  background: #16a34a;
  border-color: #15803d;
  color: #ffffff;
}

.control-btn.buy:hover {
  background: #15803d;
}

.control-btn.return {
  background: #ef4444;
  border-color: #dc2626;
  color: #ffffff;
}

.control-btn.return:hover {
  background: #dc2626;
}

/* ╔══════════════════════════════════════════════╗
   ║  SCROLLBAR                                  ║
   ╚══════════════════════════════════════════════╝ */
.table-container::-webkit-scrollbar,
.product-list::-webkit-scrollbar {
  width: 8px;
}

.table-container::-webkit-scrollbar-track,
.product-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 999px;
}

.table-container::-webkit-scrollbar-thumb,
.product-list::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
  border-radius: 999px;
}

.table-container::-webkit-scrollbar-thumb:hover,
.product-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
}

/* ╔══════════════════════════════════════════════╗
   ║  RESPONSIVE                                 ║
   ╚══════════════════════════════════════════════╝ */
@media (max-width: 1600px) {
  .main-content {
    grid-template-columns: 430px minmax(0, 1.1fr) 380px;
  }
}

@media (max-width: 1400px) {
  .top-bar {
    grid-template-columns: 1fr;
  }

  .customer-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .main-content {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  }

  .panel-5 {
    grid-column: 1 / -1;
  }
}

@media (max-width: 992px) {
  .invoice-app > .top-bar,
  .invoice-app > .main-content {
    padding: 1rem 1.1rem;
    border-radius: 1rem;
  }

  .main-content {
    grid-template-columns: 1fr;
  }

  .product-list {
    max-height: none;
  }
}

@media (max-width: 768px) {
  .invoice-app {
    padding: 1rem;
  }

  .customer-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .field-row,
  .field-grid-4 {
    grid-template-columns: 1fr;
  }

  .payment-options {
    grid-template-columns: 1fr;
  }
  
}
/* ╔══════════════════════════════════════════════╗
   ║  MODAL EDIT SẢN PHẨM                         ║
   ╚══════════════════════════════════════════════╝ */
.modal-edit .modal-dialog {
  max-width: 520px;
  width: 100%;
  margin: 1.5rem auto !important;
}

.modal-edit .modal-content {
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  box-shadow:
    0 18px 45px rgba(15, 23, 42, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.9);
  overflow: hidden;
}

.modal-edit .modal-header {
  padding-block: 0.5rem;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.modal-edit .modal-title {
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.modal-edit .modal-body {
  padding: 0.75rem 0.9rem 0.9rem;
  background: #f9fafb;
}

.modal-edit .modal-footer {
  padding: 0.5rem 0.9rem 0.75rem;
  background: #f8fafc;
  border-top: 1px solid rgba(148, 163, 184, 0.3);
}

/* ╔══════════════════════════════════════════════╗
   ║  MODAL CHI TIẾT HÀNG                         ║
   ╚══════════════════════════════════════════════╝ */
.modal-detail {
  position: fixed;
  inset: 0;
  display: flex !important;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 1050;
}

.modal-detail .modal-dialog {
  max-width: 960px;
  width: 100%;
  margin: 0 !important; /* để flex canh giữa */
}

.modal-detail .modal-content {
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.5);
  box-shadow:
    0 22px 55px rgba(15, 23, 42, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.9);
}

/* header chi tiết hàng */
.modal-detail .modal-header {
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: #e5e7eb;
  border-bottom: 1px solid rgba(15, 23, 42, 0.3);
}

.modal-detail .modal-title {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.modal-detail .modal-body {
  max-height: 70vh;
  overflow-y: auto;
  background: #f9fafb;
}

/* footer */
.modal-detail .modal-footer {
  background: #f8fafc;
  border-top: 1px solid rgba(148, 163, 184, 0.4);
}

/* mobile: modal full hơn nhưng vẫn giữa */
@media (max-width: 768px) {
  .modal-detail {
    padding: 0.75rem;
  }
  .modal-detail .modal-dialog {
    max-width: 100%;
  }
  .modal-edit .modal-dialog {
    max-width: 95%;
  }
}
/* Badge hiển thị hình thức thanh toán trong summary */
.badge-pay {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: 1px solid transparent;
  min-width: 80px;
}

/* Tiền mặt – xanh lá */
.badge-pay-cash {
  background: #dcfce7;
  color: #166534;
  border-color: #16a34a;
}

/* Chuyển khoản – xanh dương */
.badge-pay-transfer {
  background: #dbeafe;
  color: #1d4ed8;
  border-color: #2563eb;
}

/* Nợ – vàng cam */
.badge-pay-debt {
  background: #fef3c7;
  color: #92400e;
  border-color: #f59e0b;
}
.badge-out-of-stock {
  display: inline-block;
  margin-top: 0.2rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #b91c1c;
  background: #fee2e2;
  border: 1px solid #fecaca;
}

.out-of-stock-text {
  text-align: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #b91c1c;
  margin-bottom: 0.4rem;
}

/* cho cảm giác bị disable */
.qty-control-compact.disabled {
  opacity: 0.5;
  pointer-events: none;
}
.field input.out-of-stock-input {
  color: #b91c1c !important;   /* đỏ cảnh báo */
  font-weight: 700 !important; /* đậm hơn */
}

/* nếu đang dùng readonly chung */
.readonly {
  background: #f9fafb;
  cursor: not-allowed;
  border-style: dashed;        /* giống hình mày */
}

/* Màu riêng cho nút trừ / cộng ở Số Lượng */
.qty-btn.minus {
  background: #fee2e2;
  border-color: #fecaca;
  color: #dc2626;
}

.qty-btn.plus {
  background: #dcfce7;
  border-color: #bbf7d0;
  color: #15803d;
}
.custom-alert-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}

.custom-alert-box {
  width: 320px;
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.25);
  animation: popup 0.2s ease;
}

@keyframes popup {
  from { transform: scale(0.9); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

.alert-title {
  margin: 0;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 18px;
}

.alert-title.success { color: #16a34a; }
.alert-title.warning { color: #eab308; }
.alert-title.error   { color: #dc2626; }

.alert-message {
  font-size: 14px;
  color: #444;
  margin-bottom: 15px;
}
.export-btn {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.export-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

</style>
<style>
/* 🔥 FIX modal chỉnh sửa luôn hiển thị CHÍNH GIỮA */
/* Khi modal mở → ép .modal-dialog nằm giữa màn hình */
/* ÉP modal edit ra giữa màn hình */
#editModal.show {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;

  position: fixed !important;
  inset: 0 !important;
  padding: 0 !important;
}

#editModal.show .modal-dialog {
  margin: 0 !important;
  transform: none !important;  /* bỏ transform của bootstrap */
  max-width: 520px;
}

#editModal.modal.fade .modal-dialog {
  transform: none !important;
}
</style>
<script>
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import { nextTick } from "vue"; // ⚡️ Thêm dòng này
import * as QRCode from "qrcode";


export default {
  data(){
    return{
      tab: 1, 
      activeTab: 'invoice',
      apiUrl:"https://script.google.com/macros/s/AKfycbz_vsTrvAjmYq51LTtQhe-nkdOzbMQcpMGslSU8tuSObycF9l5HT7cqYKhJ11uqrpL8/exec",
      maHoaDon:"", soHoaDon: "", maKhach: "",tenKhach:"",sdt:"",diaChiKhach: "",noCu:0,ghiChuKhach:"",
      dsKhachHang:[],dsHangHoa:[],dsNhaCungCap:[],
      maHang:"",tenHang:"", danhMuc: "",dvt:"",size:"",soLuongKho:0,soLuong:1,donGia:0,giamGia:0,giaGoc: 0,           // 🟢 thêm dòng này
    phanTram: 0,         // 🟢 thêm dòng này
      maNcc:"",nhaCungCap:"",diaChiNcc:"",
      khachTra:0,hinhThuc:"",ghiChuDon:"",ghiChuHang:"",chiTiet:[],
      tienThanhToan:0,hinhThucThanhToan:"",daXacNhanThanhToan:false,
      editItem: {},  // <== Dùng cho modal
      editIndex:null,
      searchHangSan: "",
      showModalHang: false,
chiTietHang: {},
 showNcc: false,
alertModal: {
  show: false,
  title: "",
  message: "",
  type: "info", // success | warning | error
  isExporting: false,

},

 
    };
  },
  computed:{
    tamTinh(){return this.chiTiet.filter(i=>i.trangThai==="Mua").reduce((s,i)=>s+i.thanhTien,0);},
    hangTra(){return this.chiTiet.filter(i=>i.trangThai==="Trả").reduce((s,i)=>s+i.thanhTien,0);},
    tongGiamGia(){return this.chiTiet.reduce((s,i)=>s+(Number(i.giamGia)||0),0);},
    tongCong(){return this.tamTinh-this.hangTra+Number(this.noCu||0)-Number(this.khachTra||0);},
      slTonKhoDisplay() {
    return Number(this.soLuongKho) <= 0 ? 'Hết hàng trong kho' : this.soLuongKho;
  },
    filteredHangSan() {
  const s = this.searchHangSan.trim().toLowerCase();
  if (!s) return this.dsHangHoa;
  return this.dsHangHoa.filter(
    (h) =>
      (h.ma_hang && h.ma_hang.toLowerCase().includes(s)) ||
      (h.ten_hang && h.ten_hang.toLowerCase().includes(s))
  );
},

  },



  methods:{

  tangSoLuong() {
    this.soLuong = (Number(this.soLuong) || 0) + 1;
  },
  giamSoLuong() {
    this.soLuong = Math.max(1, (Number(this.soLuong) || 1) - 1);
  },
formatNumInput(e, field) {
  let val = e.target.value.replace(/[^\d]/g, "");
  this[field] = val ? Number(val) : 0;
  e.target.value = new Intl.NumberFormat().format(this[field]);

  // ✅ Khi người dùng nhập "đơn giá" thì tự động cập nhật "giá gốc" theo %
  if (field === "donGia") {
    this.capNhatGiaNhapTheoGiaBan();
  }
},
addChiTietHang(hh, trangThai, soLuongChon = 1) {
  // ✅ Chuẩn hóa số lượng người dùng chọn
  let sl = Number(soLuongChon) > 0 ? Number(soLuongChon) : 1;

  // ✅ Số lượng tồn kho lấy từ dữ liệu
  const tonKho = Number(hh.so_luong_kho || hh.soLuongKho || 0);

  // 🔒 Chỉ kiểm tra tồn kho khi là MUA
  if (trangThai === "Mua") {
    // Hết hàng
    if (tonKho <= 0) {
      this.showAlert(
        `Đã hết hàng trong kho, không thể MUA thêm!`
      );
      return;
    }

    // Người dùng chọn SL > tồn kho → chỉ báo lỗi, KHÔNG tự sửa số lượng
    if (sl > tonKho) {
      this.showAlert(
        `⚠️ Không đủ hàng. Vui lòng nhập lại số lượng!`
      );
      return;
    }
  }

  // ✅ Tạo item để đẩy vào chi tiết
  const item = {
    maHang: hh.ma_hang,
    tenHang: hh.ten_hang,
    danhMuc: hh.danh_muc || "",
    size: hh.size || "",
    dvt: hh.dvt || "",
    maNcc: hh.ma_nha_cung_cap || "",
    nhaCungCap: hh.ten_nha_cung_cap || "",
    soLuongKho: tonKho,
    soLuong: sl,
    donGia: Number(hh.don_gia) || 0,
    giamGia: 0,
    thanhTien: sl * (Number(hh.don_gia) || 0),
    trangThai,
    ghiChuDon: "",
    qr_img: hh.qr_img || "",
  };

  // ✅ Nếu cùng mã + cùng trạng thái đã tồn tại → cộng dồn
  const exist = this.chiTiet.find(
    (r) => r.maHang === item.maHang && r.trangThai === trangThai
  );
  if (exist) {
    exist.soLuong += sl;
    exist.thanhTien += sl * item.donGia;
  } else {
    this.chiTiet.push(item);
  }

 
  // reset số lượng chọn về 1 (giữ như cũ)
  hh.soLuongChon = 1;
},

showAlert(title, message, type = "info") {
  this.alertModal = {
    show: true,
    title,
    message,
    type
  };
},

closeAlertModal() {
  this.alertModal.show = false;
},


moModalHang(hh) {
  const matched = this.dsHangHoa.find(h => h.ma_hang === hh.ma_hang);
  this.chiTietHang = { ...matched, ...hh }; // merge toàn bộ thông tin
  this.showModalHang = true;
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
resetKhach() {
 

  this.maKhach = "";
  this.tenKhach = "";
  this.sdt = "";
  this.diaChiKhach = "";
  this.noCu = 0;
  this.ghiChuKhach = "";
  this.soHoaDon = "";

  // Nếu muốn tự sinh mã khách dựa trên tên & địa chỉ mới
  // this.tuSinhMaKhach();


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
    this.showAlert("⚠️ Vui lòng nhập tên và địa chỉ nhà cung cấp trước khi tạo mã!");
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

  // 🧩 [1] Lấy chữ cái đầu mỗi từ trong tên NCC
  const phan1 = removeAccents(this.nhaCungCap)
    .split(/\s+/)
    .filter(w => w)
    .map(w => w[0].toUpperCase())
    .join("");

  // 🧩 [2] Hai số cuối của năm hiện tại
  const phan2 = new Date().getFullYear().toString().slice(-2);

  // 🧩 [3] Giá nhập ×2 (bỏ 3 số cuối)
  const giaNhap = Number(this.giaGoc) || 0;
  const bo000 = Math.floor(giaNhap / 1000);
  const phan3 = bo000 * 2;

  // 🧩 [4] Bỏ qua DVT hoặc size nếu không cần
  const phan4 = "";

  // 🧩 [5] Mã giá bán ẩn
  const loiNhuan = Number(this.phanTram) || 0;
  let giaBan = giaNhap * (1 + loiNhuan / 100);
  const remainder = giaBan % 1000;
  if (remainder > 0) giaBan += 1000 - remainder;

  const base = Math.floor(giaBan / 1000);
  const len = base.toString().length;
  const cong = len === 1 ? 1 : len === 2 ? 10 : len === 3 ? 100 : 1000;
  const giaMa = base + cong;

  let soGia = 0;
  if (giaMa < 10) soGia = (giaMa % 10) + 1;
  else if (giaMa < 100) soGia = Math.floor(giaMa / 10) + 1;
  else if (giaMa < 1000) soGia = Math.floor(giaMa / 100) + 1;
  else soGia = Math.floor(giaMa / 1000) + 1;
  soGia = soGia % 10;

  const phan5 = `${soGia}${giaMa}`;

  // 🆕 [6] Tạo phần chữ cái đầu tên hàng (kèm cả số)
  const tenVietTat = removeAccents(this.tenHang)
    .split(/\s+/)
    .filter(w => w)
    .map(w => {
      const so = w.match(/\d+/g);
      if (so) return so.join(''); // nếu có số → lấy hết dãy số
      return w[0].toUpperCase();  // nếu không có số → lấy chữ đầu
    })
    .join('');

  // 🎯 [7] Mã hoàn chỉnh có thêm phần ngoặc tên hàng
  this.maHang = `${phan1}${phan2}${phan3}${phan4}${phan5}(${tenVietTat})`;
}

,


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
  if (!file) return this.showAlert("⚠️ Chưa chọn file Excel!");

  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    if (rows.length === 0) return this.showAlert("⚠️ File Excel trống!");

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

    this.showAlert("✅ Import thành công! Đã tự động điền thông tin khách và hàng vào bảng.");
  } catch (err) {
    console.error("❌ Lỗi đọc Excel:", err);
    this.showAlert("❌ File không đúng định dạng mẫu hoặc bị lỗi. Kiểm tra lại nhé!");
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
  const r = await fetch(this.apiUrl + "?action=getHangHoa");
  const raw = await r.json();

  // ✅ mỗi hàng có sẵn 1 trường soLuongChon = 1
  this.dsHangHoa = raw.map(h => ({
    ...h,
    soLuongChon: 1
  }));

  const r2 = await fetch(this.apiUrl + "?action=getNhaCungCap");
  this.dsNhaCungCap = await r2.json();
}
,
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
  const tonKho = Number(this.soLuongKho) || 0;

  // 🔒 Nếu kho <= 0 thì không cho mua (giữ rule cũ)
  if (tonKho <= 0) {
    return this.showAlert(
      "⚠️ Hàng trong kho đã hết, không thể MUA. Nếu là trả hàng, dùng nút Trả Hàng."
    );
  }

  // 💰 Auto tính giá gốc nếu chưa có mà đã nhập % lãi
  if (!this.giaGoc && this.phanTram) {
    this.giaGoc = Math.round(this.donGia / (1 + this.phanTram / 100));
  }

  if (!this.tenHang || this.soLuong <= 0) {
    return this.showAlert("⚠️ Vui lòng nhập đầy đủ thông tin hàng và số lượng hợp lệ!");
  }

  const soLuong = Number(this.soLuong) || 0;

  // 🧱 Check: SL chọn > tồn kho → chỉ báo lỗi & dừng lại
  if (soLuong > tonKho) {
    this.showAlert(
      `Không đủ hàng. Nhập lại số lượng !!`
    );
    return;
  }

  const ma = this.maHang || "";
  const trangThai = "Mua";
  const donGia = Number(this.donGia) || 0;
  const giamGia = Number(this.giamGia) || 0;
  const thanhTien = soLuong * donGia - giamGia;

  // ✅ Nếu đã có dòng cùng mã + trạng thái → cộng dồn
  const exist = this.chiTiet.find(
    (i) => i.maHang === ma && i.trangThai === trangThai
  );
  if (exist) {
    exist.soLuong += soLuong;
    exist.giamGia += giamGia;
    exist.thanhTien += thanhTien;
    return this.resetFormHang();
  }

  // ✅ Thêm mới
  this.chiTiet.push({
    maHang: ma,
    maNcc: this.maNcc || "",
    tenHang: this.tenHang || "",
    danhMuc: this.danhMuc || "",
    dvt: this.dvt || "",
    size: this.size || "",
    nhaCungCap: this.nhaCungCap || "",
    soLuongKho: tonKho,
    soLuong,
    donGia,
    giaGoc: this.giaGoc || 0,
    giamGia,
    thanhTien,
    trangThai,
    ghiChuDon: this.ghiChuHang || "",
  });

  this.resetFormHang();
},


traHang() {
  if (!this.tenHang || this.soLuong <= 0)
    return this.showAlert("⚠️ Nhập thông tin hàng trả!");

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
    dvt: this.dvt || "",
    size: this.size || "",
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
      if(this.editIndex===null)return this.showAlert("⚠️ Không có hàng nào để cập nhật!");
      const item=this.chiTiet[this.editIndex];
      Object.assign(item,{
        soLuong:Number(this.soLuong),donGia:Number(this.donGia),giamGia:Number(this.giamGia),
        thanhTien:Number(this.soLuong)*Number(this.donGia)-Number(this.giamGia||0),
        ghiChuDon:this.ghiChuHang||""
      });
      this.resetFormHang();this.editIndex=null;
      this.showAlert("✅ Đã cập nhật hàng!");
    },
    xoaHang(i){
      
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
  if (this.editIndex === null || !this.editItem) return;

  const item = this.editItem;
  const tonKho = Number(item.soLuongKho || 0);
  const slMoi = Number(item.soLuong || 0);

  // 🔥 CHỈ CHECK KHI TRẠNG THÁI = MUA
  if (item.trangThai === "Mua") {

    // ❌ Hết hàng
    if (tonKho <= 0) {
      this.showAlert(`⚠️ Mặt hàng đã hết hàng trong kho, không thể mua!`);
      return;
    }

    // ❌ Nhập số lượng lớn hơn tồn kho → báo lỗi, KHÔNG tự sửa
    if (slMoi > tonKho) {
      this.showAlert(
        `Không đủ hàng. Vui lòng nhập lại số lượng!`
      );
      return;
    }
  }

  // ✔ Nếu ok thì cập nhật lại item trong chi tiết
  item.thanhTien =
    slMoi * (Number(item.donGia) || 0) - (Number(item.giamGia) || 0);

  this.chiTiet[this.editIndex] = { ...item };

  // Đóng modal
  const modal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
  if (modal) modal.hide();

  this.showAlert("✅ Đã lưu chỉnh sửa!");
}
,
xoaTuModal() {
  if (this.editIndex === null) return;
 

  this.chiTiet.splice(this.editIndex, 1);
  this.editIndex = null;

  const modalEl = document.getElementById("editModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();

  this.showAlert("🗑️ Đã xóa sản phẩm khỏi danh sách!");
},

    resetFormHang(){
      this.maHang="";this.tenHang="";this.dvt="";this.size="";
      this.soLuong=0;this.donGia=0;this.giamGia=0;
      this.maNcc="";this.nhaCungCap="";this.diaChiNcc="";this.danhMuc="";this.ghiChuHang="";
      this.giaGoc = 0;
this.phanTram = 0;

    },
  chonHinhThuc(opt) {
  // Nếu đã xác nhận thanh toán rồi thì không cho đổi nữa
  if (this.daXacNhanThanhToan) return;

  // Nếu đang chọn đúng cái này rồi → click thêm lần nữa để BỎ CHỌN
  if (this.hinhThucThanhToan === opt) {
    this.hinhThucThanhToan = "";
    this.tienThanhToan = 0;
    this.hinhThuc = "";
    this.khachTra = 0;   // cho chắc: chưa chọn hình thức thì coi như chưa trả
    return;
  }

  // Ngược lại: chọn hình thức mới
  this.hinhThucThanhToan = opt;

  if (opt === "Nợ") {
    this.tienThanhToan = 0;
    this.khachTra = 0;
  }
},

  xacNhanThanhToan() {
  // Nếu đã xác nhận rồi thì khỏi làm lại
  if (this.daXacNhanThanhToan) return;

  // Bắt buộc phải chọn hình thức trước
  if (!this.hinhThucThanhToan) {
    return this.showAlert("⚠️ Vui lòng chọn hình thức thanh toán trước!");
  }

  // Với Tiền mặt / CK thì phải nhập số tiền > 0
  if (this.hinhThucThanhToan !== "Nợ" && this.tienThanhToan <= 0) {
    return this.showAlert("⚠️ Nhập số tiền khách trả hợp lệ!");
  }

  // Gán vào hóa đơn
  this.khachTra = this.hinhThucThanhToan === "Nợ" ? 0 : this.tienThanhToan;
  this.hinhThuc = this.hinhThucThanhToan;
  this.daXacNhanThanhToan = true;

  this.showAlert("✅ Đã xác nhận thanh toán!");
},


   async xuatHoaDonTong() {
     if (this.isExporting) return; // tránh spam
  this.isExporting = true;
    // 🧩 TẠO QR Ở FE TRƯỚC KHI GỬI LÊN BE
for (const item of this.chiTiet) {
  if (!item.qr_img && item.maHang) {
    try {
      const gia1Lo = item.giaLo ? this.formatNum(item.giaLo) : "";
const gia1Cai = this.formatNum(item.giaGoc);
const giaBan1Cai = this.formatNum(item.donGia);

// 🧩 Dữ liệu QR gọn, ví dụ: HCU251805430(ATH2025) | Áo Thun Cotton | 90,000 | 180,000
const qrData = `${item.maHang} | ${item.tenHang} | ${gia1Lo ? gia1Lo + " | " : ""}${gia1Cai} | ${giaBan1Cai}`;

// 🧩 Sinh ảnh QR
item.qr_img = await QRCode.toDataURL(qrData, {
  width: 200,
  margin: 1,
  color: { dark: "#000000", light: "#ffffff" },
});

      console.log("✅ QR tạo cho", item.maHang);
    } catch (err) {
      console.error("❌ Lỗi tạo QR:", err);
    }
  }
  
}

  const hasMua = this.chiTiet.some(i => i.trangThai === "Mua");
  const hasTra = this.chiTiet.some(i => i.trangThai === "Trả");

  if (this.chiTiet.length === 0)
    return this.showAlert("⚠️ Chưa có sản phẩm nào!");

  if (hasMua && !this.hinhThucThanhToan)
    return this.showAlert("⚠️ Hóa đơn có mua hàng — vui lòng chọn hình thức thanh toán!");

  if (hasMua && !this.daXacNhanThanhToan && 
      !confirm("⚠️ Chưa xác nhận thanh toán, vẫn muốn xuất?"))
    return;

  // ✅ Xác định trạng thái tổng hợp của hóa đơn
  let trangThaiTongHop = "-";
  if (hasMua && hasTra) trangThaiTongHop = "Mua & Trả";
  else if (hasMua) trangThaiTongHop = "Mua";
  else if (hasTra) trangThaiTongHop = "Trả";
// 🧩 LỌC QR — chỉ giữ QR của hàng mới (chưa có trong sheet hang_hoa)
const dsMaHangTonTai = this.dsHangHoa.map(h => (h.ma_hang || "").trim().toUpperCase());
this.chiTiet = this.chiTiet.map(item => {
  const tonTai = dsMaHangTonTai.includes((item.maHang || "").trim().toUpperCase());
  return {
    ...item,
    qr_img: tonTai ? "" : item.qr_img // nếu hàng đã có → bỏ QR
  };
});

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
    ghiChuDon: item.ghiChuDon || "",
      qr_img: item.qr_img || ""  // 🆕 thêm dòng này
  }))
};


  await fetch(this.apiUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "xuatHoaDonTong", data })
  });


  this.showAlert("ĐÃ HOÀN THÀNH! ✅ ");
  this.chiTiet = [];
  this.khachTra = 0;
  this.hinhThuc = "";
  this.hinhThucThanhToan = "";
  this.daXacNhanThanhToan = false;
  this.tienThanhToan = 0;
  this.ghiChuDon = "";
  this.genMaHoaDon();
 this.soHoaDon="";
this.isExporting = false;

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
    if (this.chiTiet.length === 0) return this.showAlert("⚠️ Chưa có sản phẩm nào trong hóa đơn!");

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
    this.showAlert("❌ Lỗi khi xuất ảnh hóa đơn!");
  }
}

  },
  mounted(){this.genMaHoaDon();this.loadKhachHang();this.loadHangHoa();
}

  
};

</script>

