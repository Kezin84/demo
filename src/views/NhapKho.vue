<template>
  <div class="container-fluid py-4">
    <!-- HEADER VIP -->
    <div class="main-header mb-4">
      <div class="header-content">
        <div class="header-icon">📦</div>
        <div>
          <h1>NHẬP KHO HÀNG</h1>
          <p class="header-subtitle">Quản lý nhập hàng chuyên nghiệp</p>
        </div>
      </div>
    </div>

    <!-- LAYOUT CHÍNH -->
    <div class="row g-3">
      <!-- ========== Ô 1: SỐ HÓA ĐƠN & MÃ HÓA ĐƠN ========== -->
      <div class="col-lg-3">
        <div class="box box-1">
          <div class="box-header">
            <div class="header-left">
              <span class="box-number">1</span>
              <h5>HÓA ĐƠN</h5>
            </div>
            <div class="header-badge">
              <span class="badge bg-primary">Mới</span>
            </div>
          </div>
          <div class="box-content">
            <div class="mb-3">
              <label class="input-label">
                
                <span class="label-text">Mã hóa đơn</span>
              </label>
              <input v-model="form.maHD" class="input-field input-readonly" readonly />
            </div>
            <div>
              <label class="input-label">
                
                <span class="label-text">Số hóa đơn</span>
              </label>
              <input v-model="form.soHD" class="input-field input-readonly" readonly />
            </div>
          </div>
        </div>
      </div>

      <!-- ========== Ô 2: THÔNG TIN NHÀ CUNG CẤP ========== -->
      <div class="col-lg-9">
        <div class="box box-2">
          <div class="box-header">
            <div class="header-left">
              <span class="box-number">2</span>
              <h5>NHÀ CUNG CẤP</h5>
            </div>
            <div class="header-badge">
              <span class="badge bg-info">Thông tin</span>
            </div>
          </div>
          <div class="box-content">
            <div class="row g-3">
              <!-- MÃ NCC -->
              <div class="col-12">
                <label class="input-label">
                  
                  <span class="label-text">Mã nhà cung cấp</span>
                </label>
                <input
                  list="maNccList"
                  v-model="form.maNCC"
                  @change="onNccChange"
                  class="input-field"
                  placeholder="Nhập hoặc chọn mã NCC..."
                />
                <datalist id="maNccList">
                  <option v-for="ncc in dsNhaCungCap" :key="ncc.ma_nha_cung_cap" :value="ncc.ma_nha_cung_cap" />
                </datalist>
              </div>

              <!-- TÊN NCC | TRẠNG THÁI | CÔNG NỢ -->
              <div class="col-md-6">
                <label class="input-label">
                  
                  <span class="label-text">Tên nhà cung cấp</span>
                </label>
                <input
                  list="tenNccList"
                  v-model="form.tenNCC"
                  @change="onNccChange"
                  class="input-field"
                  placeholder="Nhập hoặc chọn tên NCC..."
                />
                <datalist id="tenNccList">
                  <option v-for="ncc in dsNhaCungCap" :key="ncc.ten_nha_cung_cap" :value="ncc.ten_nha_cung_cap" />
                </datalist>
              </div>

              <div class="col-md-3">
                <label class="input-label">
                 
                  <span class="label-text">Trạng thái</span>
                </label>
                <input
                  v-model="form.trangThaiNCC"
                  class="input-field input-status"
                  readonly
                  :class="{
                    'status-debt': form.trangThaiNCC.includes('Mình nợ'),
                    'status-credit': form.trangThaiNCC.includes('NCC còn nợ'),
                    'status-paid': form.trangThaiNCC.includes('Đã thanh toán')
                  }"
                />
              </div>

              <div class="col-md-3">
                <label class="input-label">
                  
                  <span class="label-text">Công nợ</span>
                </label>
                <input
                  type="text"
                  class="input-field text-end"
                  :value="formatView(form.congNo)"
                  @input="formatLive($event, 'congNo', 'form')"
                  placeholder="0 ₫"
                />
              </div>

              <!-- ĐỊA CHỈ | SĐT | GHI CHÚ NCC | GHI CHÚ ĐƠN -->
              <div class="col-md-3">
                <label class="input-label">
                 
                  <span class="label-text">Địa chỉ</span>
                </label>
                <input v-model="form.diaChi" class="input-field" @input="genMaNCC" placeholder="Nhập địa chỉ..." />
              </div>

              <div class="col-md-3">
                <label class="input-label">
                 
                  <span class="label-text">Số điện thoại</span>
                </label>
                <input v-model="form.sdt" class="input-field" placeholder="Nhập SĐT..." />
              </div>

              <div class="col-md-3">
                <label class="input-label">
                  
                  <span class="label-text">Ghi chú NCC</span>
                </label>
                <input v-model="form.ghiChuNCC" class="input-field" placeholder="Ghi chú NCC..." />
              </div>

              <div class="col-md-3">
                <label class="input-label">
                 
                  <span class="label-text">Ghi chú đơn</span>
                </label>
                <input v-model="form.ghiChuHoaDon" class="input-field" placeholder="Ghi chú đơn..." />
              </div>

              <!-- NÚT RESET -->
              <div class="col-12 text-center mt-2">
                <button 
                  v-if="form.tenNCC || form.maNCC"
                  class="btn-reset" 
                  @click="resetNCC"
                >
                  <span>🔄</span> Reset thông tin NCC
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== Ô 3: THÔNG TIN NHẬP HÀNG ========== -->
      <div class="col-lg-3">
        <div class="box box-3">
          <div class="box-header">
            <div class="header-left">
              <span class="box-number">3</span>
              <h5>NHẬP HÀNG</h5>
            </div>
            <div class="header-badge">
              <span class="badge bg-success">Nhanh</span>
            </div>
          </div>
          <div class="box-content">
            <div class="form-nhap">
              <!-- MÃ HÀNG | TÊN HÀNG -->
              <div class="form-row">
                <div class="form-col-6">
                  <label class="input-label">
                    
                    <span class="label-text">Mã hàng</span>
                  </label>
                  <input
                    list="maHangList"
                    v-model="hang.maHang"
                    @change="onHangChange"
                    class="input-field"
                    placeholder="Mã..."
                  />
                  <datalist id="maHangList">
                    <option v-for="hh in getHangHoaTheoNCC()" :key="hh.ma_hang" :value="hh.ma_hang" />
                  </datalist>
                </div>

                <div class="form-col-6">
                  <label class="input-label">
                  
                    <span class="label-text">Tên hàng</span>
                  </label>
                  <input
                    list="tenHangList"
                    v-model="hang.tenHang"
                    @change="onTenHangChange"
                    class="input-field"
                    placeholder="Tên..."
                  />
                  <datalist id="tenHangList">
                    <option v-for="hh in getHangHoaTheoNCC()" :key="hh.ten_hang" :value="hh.ten_hang" />
                  </datalist>
                </div>
              </div>

              <!-- DANH MỤC | SIZE | DVT -->
              <div class="form-row">
                <div class="form-col-4">
                  <label class="input-label">
                   
                    <span class="label-text">Danh mục</span>
                  </label>
                  <input v-model="hang.danhMuc" class="input-field" placeholder="Áo" />
                </div>

                <div class="form-col-4">
                  <label class="input-label">
            
                    <span class="label-text">Size</span>
                  </label>
                  <input v-model="hang.size" class="input-field" placeholder="M" />
                </div>

                <div class="form-col-4">
                  <label class="input-label">
                   
                    <span class="label-text">ĐVT</span>
                  </label>
                  <input v-model="hang.dvt" class="input-field" placeholder="Cái" />
                </div>
              </div>

              <!-- CHECKBOX -->
              <div class="checkbox-wrapper">
                <input
                  class="checkbox-input"
                  type="checkbox"
                  id="nhapTheoLo"
                  v-model="hang.nhapTheoLo"
                />
                <label class="checkbox-label" for="nhapTheoLo">
                  Nhập theo lô
                </label>
              </div>

              <!-- GIÁ 1 LÔ | SỐ LÔ | CÁI/LÔ (nếu có) -->
              <template v-if="hang.nhapTheoLo">
                <div class="form-row">
                  <div class="form-col-4">
                    <label class="input-label">
                     
                      <span class="label-text">Giá 1 lô</span>
                    </label>
                    <input
                      type="text"
                      class="input-field text-end"
                      :value="formatView(hang.giaLo)"
                      @input="formatLive($event, 'giaLo', 'hang'); tinhTheoLo()"
                      placeholder="0"
                    />
                  </div>

                  <div class="form-col-4">
                    <label class="input-label">
                   
                      <span class="label-text">Số lô</span>
                    </label>
                    <input
                      type="number"
                      v-model.number="hang.soLo"
                      @input="tinhTheoLo"
                      class="input-field text-center"
                      placeholder="10"
                    />
                  </div>

                  <div class="form-col-4">
                    <label class="input-label">
               
                      <span class="label-text">Cái/lô</span>
                    </label>
                    <input
                      type="number"
                      v-model.number="hang.soCaiMotLo"
                      @input="tinhTheoLo"
                      class="input-field text-center"
                      placeholder="4"
                    />
                  </div>
                </div>
              </template>

              <!-- GIÁ NHẬP | LỜI % | GIÁ BÁN -->
              <div class="form-row">
                <div class="form-col-4">
                  <label class="input-label">
                
                    <span  class="label-text">Giá nhập</span>
                  </label>
                  <input
                  style="font-weight: bold;"
                    type="text"
                    class="input-field input-buy text-center"
                    :value="formatView(hang.giaNhap)"
                    @input="formatLive($event, 'giaNhap', 'hang')"
                    placeholder="0"
                  />
                </div>

                <div class="form-col-4">
                  <label class="input-label">
            
                    <span class="label-text">Lời %</span>
                  </label>
                  <input
                  style="font-weight: bold;"
                    v-model.number="hang.loiNhuan"
                    type="number"
                    class="input-field input-profit text-center"
                    placeholder="20"
                    @change="capNhatGiaBanTuPhanTram"
                  />
                </div>

                <div class="form-col-4">
                  <label class="input-label">
                 
                    <span class="label-text">Giá bán</span>
                  </label>
                  <input
                  style="font-weight: bold;"
                    type="text"
                    class="input-field input-sell text-center"
                    :value="formatView(hang.donGia)"
                    @input="formatLive($event, 'donGia', 'hang')"
                    placeholder="0"
                  />
                </div>
              </div>

              <!-- GHI CHÚ -->
              <div class="form-full">
                <label class="input-label">
      
                  <span class="label-text">Ghi chú</span>
                </label>
                <textarea v-model="ghiChuNhap" class="input-field textarea-field" rows="2" placeholder="Ghi chú..."></textarea>
              </div>

              <!-- TỒN KHO -->
              <div class="stock-display">
                <span class="stock-label">Tồn kho:</span>
                <span class="stock-value">{{ hang.slTonKho || 0 }}</span>
              </div>

              <!-- SỐ LƯỢNG -->
              <div class="quantity-simple">
                <button class="qty-btn" @click="hang.soLuong = Math.max(1, hang.soLuong - 1)">−</button>
                <input v-model.number="hang.soLuong" type="number" class="qty-value" min="1" />
                <button class="qty-btn" @click="hang.soLuong++">+</button>
              </div>

              <!-- BUTTONS -->
              <div class="action-buttons">
                <button class="btn-action btn-return" @click="themHang('Trả')">
                  TRẢ
                </button>
                <button class="btn-action btn-import" @click="themHang('Nhập')">
                  NHẬP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== Ô 4: CHI TIẾT + THANH TOÁN ========== -->
      <div class="col-lg-9">
        <div class="box box-4">
          <div class="box-header">
            <div class="header-left">
              <span class="box-number">4</span>
              <h5>CHI TIẾT & THANH TOÁN</h5>
            </div>
            <div class="header-badge">
              <span class="badge bg-warning text-dark">Quan trọng</span>
            </div>
          </div>
          <div class="box-content">
            <!-- BẢNG CHI TIẾT -->
            <div class="table-container mb-3">
              <table class="table table-modern">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã hàng</th>
                    <th>Tên hàng</th>
                    <th>Số lô</th>
                    <th>Cái/lô</th>
                    <th>SL</th>
                    <th>Danh mục</th>
                    <th>Size</th>
                    <th>ĐVT</th>
                    <th>Giá/lô</th>
                    <th>Giá nhập</th>
                    <th>Giá bán</th>
                    <th>Thành tiền</th>
                    <th>TT</th>
                    <th>QR</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, i) in chiTiet"
                    :key="i"
                    class="table-row"
                    :class="{ 'row-editing': indexSua === i }"
                    @click="moModalSua(item, i)"
                  >
                    <td class="text-center">{{ i + 1 }}</td>
                    <td class="fw-bold text-primary">{{ item.maHang }}</td>
                    <td>{{ item.tenHang }}</td>
                    <td class="text-center">{{ item.so_luong_lo }}</td>
                    <td class="text-center">{{ item.so_cai_1_lo }}</td>
                    <td class="text-center fw-bold">{{ item.soLuong }}</td>
                    <td>{{ item.danhMuc }}</td>
                    <td class="text-center">{{ item.size }}</td>
                    <td class="text-center">{{ item.dvt }}</td>
                    <td class="text-end">{{ format(item.gia_1_lo) }}</td>
                    <td class="text-end">{{ format(item.giaNhap) }}</td>
                    <td class="text-end">{{ format(item.donGia) }}</td>
                    <td class="text-end fw-bold text-success">{{ format(item.thanhTien) }}</td>
                    <td class="text-center">
                      <span class="status-badge" :class="{ 'status-import': item.trangThai === 'Nhập', 'status-return': item.trangThai === 'Trả' }">
                        {{ item.trangThai }}
                      </span>
                    </td>
                    <td class="text-center">
                      <img v-if="item.qr_img" :src="item.qr_img" alt="QR" class="qr-code" />
                    </td>
                    <td class="text-center">
                      <button class="btn-icon-action btn-edit" @click.stop="moModalSua(item, i)">✏️</button>
                      <button class="btn-icon-action btn-delete" @click.stop="xoaHang(i)">🗑️</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- THANH TOÁN + TỔNG KẾT -->
            <div class="row g-3">
              <!-- THANH TOÁN -->
              <div class="col-lg-7">
                <div class="payment-section-modern">
                  <div class="section-header-modern">
                    <span class="section-icon">💰</span>
                    <h6>THANH TOÁN</h6>
                  </div>

                  <div class="payment-grid" v-if="!form.daThanhToan">
                    <button class="payment-card payment-cash" :class="{ active: thanhToan.hinhThuc === 'Tiền mặt' }" @click="chonHinhThuc('Tiền mặt')">
                      <div class="payment-card-icon">💵</div>
                      <div class="payment-card-text">Tiền mặt</div>
                      <div class="payment-card-check">✓</div>
                    </button>
                    <button class="payment-card payment-transfer" :class="{ active: thanhToan.hinhThuc === 'Chuyển khoản' }" @click="chonHinhThuc('Chuyển khoản')">
                      <div class="payment-card-icon">🏦</div>
                      <div class="payment-card-text">Chuyển khoản</div>
                      <div class="payment-card-check">✓</div>
                    </button>
                    <button class="payment-card payment-debt" :class="{ active: thanhToan.hinhThuc === 'Nợ' }" @click="chonHinhThuc('Nợ')">
                      <div class="payment-card-icon">📝</div>
                      <div class="payment-card-text">Nợ</div>
                      <div class="payment-card-check">✓</div>
                    </button>
                  </div>

                  <div v-if="['Tiền mặt', 'Chuyển khoản'].includes(thanhToan.hinhThuc) && !form.daThanhToan" class="mt-3">
                    <label class="input-label">
                      <span class="label-icon">💵</span>
                      <span class="label-text">Số tiền trả NCC</span>
                    </label>
                    <input
                      type="text"
                      class="input-field input-payment text-center"
                      :value="formatView(thanhToan.soTien)"
                      @input="formatLive($event, 'soTien', 'thanhToan')"
                      placeholder="Nhập số tiền..."
                    />
                  </div>

                  <div class="action-buttons-modern mt-3">
                    <button class="btn-action-modern btn-confirm" @click="xacNhanThanhToan" :disabled="form.daThanhToan">
                      <span>✅</span> THANH TOÁN
                    </button>
           <button 
           
  class="btn-action-modern btn-export" 
  @click="xuatHoaDonNhap"
  :disabled="isExporting || chiTiet.length === 0"
>
  <span v-if="!isExporting" style="font-weight: bold;"> HOÀN THÀNH ĐƠN 📦</span>
  <span v-else class="loading-spinner"></span>
</button>

                  </div>
                </div>
              </div>

              <!-- TỔNG KẾT -->
              <div class="col-lg-5">
                <div class="summary-modern">
                  <div class="section-header-modern">
                    <span class="section-icon">📊</span>
                    <h6>TỔNG KẾT</h6>
                  </div>

                  <div class="summary-list">
                    <div class="summary-row-modern">
                      <span style="font-weight: bold;">TẠM TÍNH:</span>
                      <span class="fw-bold">{{ format(tamTinh) }} ₫</span>
                    </div>
                    <div class="summary-row-modern">
                      <span style="font-weight: bold;">HÀNG TRẢ:</span>
                      <span class="fw-bold text-danger">-{{ format(traLai) }} ₫</span>
                    </div>
                    <div class="summary-row-modern">
                      <span style="font-weight: bold;">NỢ CŨ:</span>
                      <span class="fw-bold">{{ format(form.congNo) }} ₫</span>
                    </div>
                    <!-- HÌNH THỨC THANH TOÁN -->
<div class="summary-row">
  <span style="font-weight: bold;">HÌNH THỨC THANH TOÁN:</span>

  <span v-if="thanhToan.hinhThuc" class="payment-badge" :class="thanhToan.hinhThuc">
    <template v-if="thanhToan.hinhThuc === 'Tiền mặt'">💵 TIỀN MẶT</template>
    <template v-if="thanhToan.hinhThuc === 'Chuyển khoản'">🏦 CHUYỂN KHOẢN</template>
    <template v-if="thanhToan.hinhThuc === 'Nợ'">📝 NỢ</template>
  </span>

  <span v-else class="payment-badge none">—</span>
</div>

                    <div class="summary-row-modern">
                      <span style="font-weight: bold;">ĐÃ TRẢ:</span>
                      <span class="fw-bold">{{ format(form.daThanhToan ? form.traTien : 0) }} ₫</span>
                    </div>
                  </div>

                  <div class="summary-divider-modern"></div>

                  <div class="summary-highlight-modern">
                    <div class="highlight-label">💰 Công nợ mới</div>
                    <div class="highlight-value" :class="{ 'value-negative': congNoSauNhap < 0, 'value-positive': congNoSauNhap > 0, 'value-zero': congNoSauNhap === 0 }">
                      {{ format(congNoSauNhap) }} ₫
                    </div>
                    <div class="highlight-status">
                      <span v-if="congNoSauNhap < 0" class="status-badge status-debt-owe">Mình nợ NCC</span>
                      <span v-else-if="congNoSauNhap > 0" class="status-badge status-debt-credit">NCC còn nợ</span>
                      <span v-else class="status-badge status-debt-paid">Đã thanh toán</span>
                    </div>
                  </div>

                  <div class="summary-divider-modern"></div>

                  <div class="summary-total-modern">
                    <span style="font-weight: bold;">TỔNG CỘNG</span>
                    <span class="fw-bold">{{ format(tongCong) }} ₫</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    <!-- MODAL SỬA HÀNG -->
<div class="modal fade" id="modalSuaHang" tabindex="-1">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">

      <!-- HEADER -->
      <div class="modal-header">
        <h5 class="modal-title">✏️ SỬA THÔNG TIN HÀNG</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <!-- BODY -->
      <div class="modal-body">
        <div class="row g-3">

          <!-- Mã hàng -->
          <div class="col-md-4">
            <label class="form-label fw-bold">Mã hàng</label>
            <input v-model="hangSua.maHang" class="form-control" readonly />
          </div>

          <!-- Tên hàng -->
          <div class="col-md-4">
            <label class="form-label fw-bold">Tên hàng</label>
            <input v-model="hangSua.tenHang" class="form-control" />
          </div>

          <!-- Số lượng -->
          <div class="col-md-4">
            <label class="form-label fw-bold">Số lượng</label>
            <input v-model.number="hangSua.soLuong" type="number" class="form-control" />
          </div>

          <!-- Danh mục -->
          <div class="col-md-3">
            <label class="form-label fw-bold">Danh mục</label>
            <input v-model="hangSua.danhMuc" class="form-control" />
          </div>

          <!-- Size -->
          <div class="col-md-3">
            <label class="form-label fw-bold">Size</label>
            <input v-model="hangSua.size" class="form-control" />
          </div>

          <!-- ĐVT -->
          <div class="col-md-3">
            <label class="form-label fw-bold">ĐVT</label>
            <input v-model="hangSua.dvt" class="form-control" />
          </div>

          <!-- Nhập theo lô -->
          <div class="col-md-3 d-flex align-items-center">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="suaTheoLo"
                v-model="hangSua.nhapTheoLo"
              />
              <label class="form-check-label" for="suaTheoLo">Nhập theo lô</label>
            </div>
          </div>

          <!-- Nếu nhập theo lô -->
          <template v-if="hangSua.nhapTheoLo">
            <div class="col-md-4">
              <label class="form-label fw-bold">Giá 1 lô</label>
              <input
                type="text"
                class="form-control"
                :value="formatView(hangSua.giaLo)"
                @input="formatLive($event, 'giaLo', 'hangSua'); tinhTheoLoSua()"
              />
            </div>

            <div class="col-md-4">
              <label class="form-label fw-bold">Số lô</label>
              <input
                v-model.number="hangSua.soLo"
                @input="tinhTheoLoSua()"
                type="number"
                class="form-control"
              />
            </div>

            <div class="col-md-4">
              <label class="form-label fw-bold">Số cái/lô</label>
              <input
                v-model.number="hangSua.soCaiMotLo"
                @input="tinhTheoLoSua()"
                type="number"
                class="form-control"
              />
            </div>
          </template>

          <!-- Giá từng cái -->
          <div class="col-md-4">
            <label class="form-label fw-bold">Giá từng cái</label>
            <input
              type="text"
              class="form-control"
              :value="formatView(hangSua.giaGoc)"
              @input="formatLive($event, 'giaGoc', 'hangSua')"
            />
          </div>

          <!-- Đơn giá (giá bán) -->
          <div class="col-md-4">
            <label class="form-label fw-bold">Đơn giá</label>
            <input
              type="text"
              class="form-control"
              :value="formatView(hangSua.donGia)"
              @input="formatLive($event, 'donGia', 'hangSua')"
            />
          </div>

          <!-- Tổng tiền -->
          <div class="col-md-4">
            <label class="form-label fw-bold">Tổng tiền</label>
            <input
              class="form-control bg-light fw-bold"
              :value="formatView(hangSua.tongTien)"
              readonly
            />
          </div>

        </div> <!-- END ROW -->
      </div> <!-- END BODY -->

      <!-- FOOTER -->
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
          Đóng
        </button>
        <button type="button" class="btn btn-primary" @click="luuSuaHang">
          Lưu thay đổi
        </button>
      </div>

    </div> <!-- modal-content -->
  </div> <!-- modal-dialog -->
</div> <!-- modal -->
<!-- 🔔 MODAL THÔNG BÁO VIP PRO -->
<div id="notiModal" class="noti-modal" v-show="noti.show">
  <div class="noti-backdrop" @click="closeNoti"></div>

  <div class="noti-box" :class="noti.type">
    <div class="noti-icon">
      <span v-if="noti.type === 'success'">✅</span>
      <span v-if="noti.type === 'error'">❌</span>
      <span v-if="noti.type === 'warning'">⚠️</span>
      <span v-if="noti.type === 'info'">ℹ️</span>
    </div>

    <div class="noti-message">{{ noti.message }}</div>

    <button class="noti-btn" @click="closeNoti">OK</button>
  </div>
</div>

  </div>

</template>

<style scoped>
/* ==================== VARIABLES ==================== */
:root {
  --primary: #3b5998;
  --success: #28a745;
  --danger: #dc3545;
  --warning: #ffc107;
  --info: #17a2b8;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, sans-serif;
  background-color: #f8f9fa;
}

.container-fluid {
  max-width: 2000px;
  margin-inline: auto;
  padding-inline: clamp(1rem, 3vw, 3rem);
  padding-top: 2rem;
}

/* ==================== HEADER ==================== */
.main-header {
  background: white;
  border-radius: 12px;
  padding: 20px 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  font-size: 3rem;
}

.main-header h1 {
  font-size: 2.2rem;
  font-weight: 800;
  color: #1f2937;
  margin: 0;
}

.header-subtitle {
  color: #64748b;
  font-size: 0.95rem;
  margin: 4px 0 0 0;
}

/* ==================== BOX ==================== */
.box {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.box:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.box-header {
  background: #3b5998;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.box-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: white;
  color: #3b5998;
  border-radius: 8px;
  font-weight: 800;
  font-size: 1.1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.box-header h5 {
  color: white;
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
}

.badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.75rem;
}

.bg-primary { background-color: #3b5998 !important; }
.bg-info { background-color: #17a2b8 !important; }
.bg-success { background-color: #28a745 !important; }
.bg-warning { background-color: #ffc107 !important; color: #000 !important; }

.box-content {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

/* ==================== LABEL - IN ĐẬM ==================== */
.input-label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  font-weight: 800;
  font-size: 0.8rem;
  color: #1f2937;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.label-icon {
  font-size: 1rem;
}

/* ==================== INPUT FIELD - VỪA ĐỦ, BO TRÒN, ĐỔ BÓNG ==================== */
.input-field,
.textarea-field {
  width: 100%;
  padding: 15px 12px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #1f2937;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 15px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.input-field:hover {
  border-color: #9ca3af;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.input-field:focus,
.textarea-field:focus {
  outline: none;
  border-color: #3b5998;
  box-shadow: 0 0 0 3px rgba(59, 89, 152, 0.1),
              0 2px 6px rgba(0, 0, 0, 0.12);
}

.textarea-field {
  resize: vertical;
  min-height: 60px;
}

.input-readonly {
  background: #f3f4f6;
  font-weight: 700;
  text-align: center;
  font-size: 1.4rem;
  cursor: not-allowed;
  padding: 12px 16px;
}

.input-status {
  font-weight: 700;
  text-align: center;
  font-size: 0.85rem;
}

.status-debt {
  background: #fee2e2;
  border-color: #dc3545;
  color: #dc3545;
}

.status-credit {
  background: #d1fae5;
  border-color: #28a745;
  color: #28a745;
}

.status-paid {
  background: #e0e7ff;
  border-color: #6b7280;
  color: #6b7280;
}

.input-buy {
  background: #fff7ed;
  border-color: #fb923c;
}

.input-profit {
  background: #dcfce7;
  border-color: #28a745;
  color: #15803d;
}

.input-sell {
  background: #d1fae5;
  border-color: #28a745;
  color: #065f46;
  font-weight: 700;
}

.input-payment {
  font-size: 1.3rem;
  font-weight: 800;
  padding: 14px 16px;
}

/* ==================== INPUT FIELD NHÀ CUNG CẤP - VỪA ĐỦ ==================== */
.box-2 .input-field {
  max-width: 100%;
}

.box-2 .col-md-6 .input-field,
.box-2 .col-md-3 .input-field {
  width: 100%;
}

.box-2 .col-12 .input-field {
  max-width: 600px;
}

/* ==================== BTN RESET ==================== */
.btn-reset {
  padding: 9px 20px;
  background: white;
  color: #dc3545;
  border: 2px solid #dc3545;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(220, 53, 69, 0.2);
}

.btn-reset:hover {
  background: #dc3545;
  color: white;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

/* ==================== FORM NHẬP HÀNG - LAYOUT MỚI ==================== */
.form-nhap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-row {
  display: flex;
  gap: 10px;
}

.form-col-4 {
  flex: 1;
  min-width: 0;
}

.form-col-6 {
  flex: 1;
  min-width: 0;
}

.form-full {
  width: 100%;
}

/* ==================== CHECKBOX - SIMPLE ==================== */
.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.checkbox-wrapper:hover {
  background: #e9ecef;
  border-color: #3b5998;
}

.checkbox-input {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #3b5998;
}

.checkbox-label {
  flex: 1;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.9rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ==================== TỒN KHO DISPLAY ==================== */
.stock-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border: 2px solid #3b82f6;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.2);
}

.stock-label {
  font-weight: 800;
  font-size: 0.95rem;
  color: #1e40af;
  text-transform: uppercase;
}

.stock-value {
  font-weight: 900;
  font-size: 1.5rem;
  color: #1e40af;
}

/* ==================== QUANTITY CONTROL - THEO MẪU MỚI ==================== */
.quantity-simple {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.qty-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
}

.qty-btn:active {
  transform: scale(0.95);
}

.qty-btn:first-child {
  background: #fee2e2;
  color: #dc3545;
}

.qty-btn:first-child:hover {
  background: #fecaca;
}

.qty-btn:last-child {
  background: #d1fae5;
  color: #28a745;
}

.qty-btn:last-child:hover {
  background: #a7f3d0;
}

.qty-value {
  width: 70%;
  height: 40px;

  display: flex;            /* 🔥 1 */
  align-items: center;      /* 🔥 2 */
  justify-content: center;  /* 🔥 3 */

  border: 2px solid #e5e7eb;
  border-radius: 20px;
  text-align: center;
  font-size: 1.3rem;
  font-weight: 900;
  color: #1f2937;
  background: white;
  outline: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}


.qty-value:focus {
  border-color: #3b5998;
  box-shadow: 0 0 0 3px rgba(59, 89, 152, 0.1);
}

/* ==================== ACTION BUTTONS ==================== */
.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.btn-action {
  padding: 14px 16px;
  border: none;
  border-radius: 20px;
  font-weight: 800;
  font-size: 0.9rem;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
}

.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.btn-import {
  background: #28a745;
  color: white;
}

.btn-import:hover {
  background: #218838;
}

.btn-return {
  background: #dc3545;
  color: white;
}

.btn-return:hover {
  background: #c82333;
}

/* ==================== TABLE ==================== */
.table-container {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #dee2e6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  max-height: 400px;
  overflow-y: auto;
}

.table-modern {
  margin: 0;
  font-size: 0.875rem;
  width: 100%;
}

.table-modern thead {
  background: #343a40;
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.table-modern thead th {
  font-weight: 700;
  text-transform: uppercase;
  padding: 12px 10px;
  border: none;
  font-size: 1rem;
  white-space: nowrap;
}
.table-modern tbody td {
  padding: 11px 10px;
  vertical-align: middle;
  white-space: nowrap;
  font-weight: bold;
   font-size: 0.95rem;
}
.table-row {
  transition: all 0.2s ease;
  cursor: pointer;
  border-bottom: 1px solid #dee2e6;
}

.table-row:hover {
  background-color: #f8f9fa;
}

.row-editing {
  background-color: #fff3cd !important;
}



.status-badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 16px;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.status-import { background-color: #28a745; color: white; }
.status-return { background-color: #dc3545; color: white; }

.btn-icon-action {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.btn-edit:hover { background-color: #fff3cd; }
.btn-delete:hover { background-color: #fee2e2; }

.qr-code {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  cursor: pointer;
  transition: all 0.3s ease;
}

.qr-code:hover {
  transform: scale(2.5);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

/* ==================== PAYMENT SECTION ==================== */
.payment-section-modern,
.summary-modern {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-header-modern {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
}

.section-icon {
  font-size: 1.5rem;
}

.section-header-modern h6 {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1f2937;
  margin: 0;
  text-transform: uppercase;
}

.payment-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.payment-card {
  position: relative;
  background: white;
  border: 3px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.payment-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.payment-card-icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.payment-card-text {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
}

.payment-card-check {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0;
  font-weight: 900;
}

/* CASH */
.payment-cash { border-color: #28a745; }
.payment-cash .payment-card-text { color: #28a745; }
.payment-cash.active {
  background: #28a745;
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(40, 167, 69, 0.4);
}
.payment-cash.active .payment-card-text,
.payment-cash.active .payment-card-icon { color: white; }
.payment-cash.active .payment-card-check {
  background: white;
  color: #28a745;
  font-size: 1rem;
}

/* TRANSFER */
.payment-transfer { border-color: #007bff; }
.payment-transfer .payment-card-text { color: #007bff; }
.payment-transfer.active {
  background: #007bff;
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 123, 255, 0.4);
}
.payment-transfer.active .payment-card-text,
.payment-transfer.active .payment-card-icon { color: white; }
.payment-transfer.active .payment-card-check {
  background: white;
  color: #007bff;
  font-size: 1rem;
}

/* DEBT */
.payment-debt { border-color: #dc3545; }
.payment-debt .payment-card-text { color: #dc3545; }
.payment-debt.active {
  background: #dc3545;
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(220, 53, 69, 0.4);
}
.payment-debt.active .payment-card-text,
.payment-debt.active .payment-card-icon { color: white; }
.payment-debt.active .payment-card-check {
  background: white;
  color: #dc3545;
  font-size: 1rem;
}

.action-buttons-modern {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.btn-action-modern {
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  font-weight: 800;
  font-size: 0.9rem;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-action-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.btn-confirm {
  background: #ffc107;
  color: #000;
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn-export {
  background: #28a745;
  color: white;
}

/* ==================== SUMMARY ==================== */
.summary-list {
  margin-bottom: 12px;
}

.summary-row-modern {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 1rem;
  font-weight: 700;
}

.summary-divider-modern {
  height: 1px;
  background: #e5e7eb;
  margin: 12px 0;
}

.summary-highlight-modern {
  background: #eff6ff;
  border: 2px solid #17a2b8;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  margin: 12px 0;
}

.highlight-label {
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 8px;
}

.highlight-value {
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 8px;
}

.value-negative { color: #dc3545; }
.value-positive { color: #28a745; }
.value-zero { color: #6c757d; }

.highlight-status {
  margin-top: 8px;
}

.status-debt-owe { background: #dc3545; color: white; }
.status-debt-credit { background: #28a745; color: white; }
.status-debt-paid { background: #6c757d; color: white; }

.summary-total-modern {
  background: #3b5998;
  color: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 900;
}

/* ==================== MODAL ==================== */
.modal-modern {
  border-radius: 12px;
  border: none;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-modern .modal-header {
  background-color: #3b5998;
  color: white;
  border-radius: 12px 12px 0 0;
  padding: 18px 22px;
}

.modal-modern .modal-title {
  font-weight: 800;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-icon {
  font-size: 1.3rem;
}

.btn-close-white {
  filter: brightness(0) invert(1);
}

.modal-modern .modal-body {
  padding: 22px;
}

.modal-modern .modal-footer {
  border-top: 1px solid #dee2e6;
  padding: 18px 22px;
  background-color: #f8f9fa;
  border-radius: 0 0 12px 12px;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-success {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-success:hover {
  background-color: #218838;
}

/* ==================== UTILITIES ==================== */
.text-danger { color: #dc3545 !important; }
.text-success { color: #28a745 !important; }
.text-primary { color: #3b5998 !important; }
.text-center { text-align: center !important; }
.text-end { text-align: right !important; }
.fw-bold { font-weight: 700 !important; }

/* ==================== SCROLLBAR ==================== */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f3f5;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: #3b5998;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #2d4373;
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 1400px) {
  .table-modern {
    font-size: 0.8rem;
  }
}

@media (max-width: 992px) {
  .payment-grid {
    grid-template-columns: 1fr;
  }
  
  .main-header h1 {
    font-size: 1.8rem;
  }
  
  .form-row {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .action-buttons {
    grid-template-columns: 1fr;
  }
  
  .quantity-simple {
    justify-content: center;
  }
}

/* ==================== ANIMATIONS ==================== */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.box {
  animation: fadeIn 0.4s ease-out;
}
.label-text{
  font-weight: bold;
}
/* ==================== FIX FORM NCC CHO RỘNG RÃI ==================== */
.box-2 .box-content {
  padding: 28px !important;
}

.box-2 .row.g-3 {
  row-gap: 22px !important;
}

.box-2 .input-label {
  margin-bottom: 8px !important;
  font-size: 0.85rem;
}

.box-2 .input-field {
  padding: 16px 14px !important;
  border-radius: 12px !important;
  font-size: 0.95rem !important;
}

/* khoảng cách giữa 3 cột: tên NCC | trạng thái | công nợ */
.box-2 .col-md-6,
.box-2 .col-md-3 {
  padding-right: 14px !important;
}

/* Các input nhạy cảm cần to hơn */
.box-2 input.input-status {
  padding: 18px 12px !important;
  font-weight: 800;
  font-size: 0.9rem !important;
}

/* Công nợ format đẹp hơn */
.box-2 input.text-end {
  padding: 18px 14px !important;
  font-size: 1rem !important;
  font-weight: 700;
}

/* Nhìn input mềm hơn */
.box-2 .input-field:hover {
  box-shadow: 0 3px 10px rgba(0,0,0,0.12) !important;
}

.box-2 .input-field:focus {
  box-shadow: 0 0 0 3px rgba(59, 89, 152, 0.12),
              0 3px 12px rgba(0,0,0,0.15) !important;
}

/* Reset button spacing */
.box-2 .btn-reset {
  margin-top: 8px;
  padding: 12px 26px !important;
  font-size: 0.9rem !important;
}

/* ==================== FIX BOX 3 CHO RỘNG RÃI ==================== */

/* Padding tổng trong box-3 */
.box-3 .box-content {
  padding: 28px !important;
}

/* Khoảng cách giữa các dòng form */
.box-3 .form-row {
  gap: 16px !important;
  margin-bottom: 12px !important;
}

/* Input rộng rãi hơn */
.box-3 .input-field {
  padding: 16px 14px !important;
  font-size: 0.95rem !important;
  border-radius: 12px !important;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

/* Hover sexy */
.box-3 .input-field:hover {
  box-shadow: 0 3px 10px rgba(0,0,0,0.12) !important;
}

/* Focus mượt */
.box-3 .input-field:focus {
  box-shadow: 0 0 0 3px rgba(59,89,152,0.15), 
              0 3px 12px rgba(0,0,0,0.15) !important;
}

/* Padding & spacing cho label */
.box-3 .input-label {
  margin-bottom: 6px !important;
  font-size: 0.85rem;
  font-weight: 700;
}

/* Ô checkbox mềm hơn */
.box-3 .checkbox-wrapper {
  padding: 14px 16px !important;
  border-radius: 12px !important;
  margin-bottom: 10px !important;
}

/* Các ô giá/lô – số lô – cái/lô nhìn thoáng */
.box-3 .form-col-4,
.box-3 .form-col-6 {
  min-width: 0;
}

/* Sliders: Tồn kho */
.box-3 .stock-display {
  padding: 16px 18px !important;
  border-radius: 12px !important;
  margin: 10px 0 !important;
}

/* Quantity control spacing */
.box-3 .quantity-simple {
  margin: 10px 0 16px 0 !important;
}

/* Buttons nhập & trả rộng rãi hơn */
.box-3 .action-buttons {
  gap: 16px !important;
}

.box-3 .btn-action {
  padding: 16px 20px !important;
  font-size: 1rem !important;
  border-radius: 20px !important;
  font-weight: 800;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.22);
}
/* ==================== KHOẢNG CÁCH GIỮA 4 BOX ==================== */

/* khoảng cách dọc trong layout chính */
.row.g-3 > .col-lg-3,
.row.g-3 > .col-lg-9 {
  margin-bottom: 30px !important;
}

/* Nếu muốn bo góc + nổi hơn */
.box {
  margin: 15px !important;  
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
/* Nếu muốn khoảng cách lớn hơn nữa */
@media (min-width: 992px) {
  .box {
    margin-bottom: 32px !important;
  }
}
.loading-spinner {
  width: 26px;
  height: 26px;
  border: 4px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
/* ============================
   MODAL PRO MAX UI
   ============================ */

/* Làm nền xung quanh mờ + tối + blur */
.modal-backdrop.show {
  opacity: 0.65 !important;       /* mức tối xung quanh */
  background-color: #000 !important;
  backdrop-filter: blur(6px);     /* mờ nền */
}

/* Modal content VIP PRO */
.modal-content {
  border: none !important;
  border-radius: 18px !important;
  overflow: hidden;

  /* Shadow đẹp */
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  
  animation: modalShow 0.28s ease-out;
}

/* Animation mở modal */
@keyframes modalShow {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Header */
.modal-header {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  padding: 16px 20px;
}

.modal-title {
  font-size: 1.2rem;
  font-weight: 700;
}

/* Body */
.modal-body {
  padding: 22px 28px;
  background: #f8fafc;
}

/* Label */
.modal-body .form-label {
  font-size: 0.9rem;
  color: #1e293b;
}

/* Input đẹp */
.modal-body .form-control {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  transition: 0.2s ease;
  background: white;
}

.modal-body .form-control:focus {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3) !important;
}

/* Footer */
.modal-footer {
  padding: 16px 20px;
  background: #eef2f7;
  border-top: 1px solid #d8dee8;
}

/* Nút */
.modal-footer .btn {
  border-radius: 10px;
  padding: 8px 20px;
  font-weight: 600;
}

.modal-footer .btn-primary {
  background: #2563eb;
  border: none;
}

.modal-footer .btn-primary:hover {
  background: #1d4ed8;
}

.modal-footer .btn-secondary {
  background: #e5e7eb;
  color: #111827;
  border: none;
}

.modal-footer .btn-secondary:hover {
  background: #d1d5db;
}
/* ===========================
   MODAL THÔNG BÁO VIP PRO
   =========================== */
.noti-modal {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.noti-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
  animation: fadeIn 0.3s ease;
}

.noti-box {
  position: relative;
  z-index: 3100;
  width: 380px;
  background: white;
  border-radius: 18px;
  padding: 26px;
  text-align: center;
  box-shadow: 0 18px 40px rgba(0,0,0,0.25);
  animation: notiPop 0.25s ease-out;
}

@keyframes notiPop {
  from {
    opacity: 0;
    transform: translateY(15px) scale(0.93);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.noti-icon span {
  font-size: 3rem;
  display: block;
  margin-bottom: 12px;
}

/* Nội dung */
.noti-message {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 20px;
}

/* Button OK */
.noti-btn {
  background: #3b82f6;
  color: white;
  padding: 10px 26px;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  font-size: 1rem;
  transition: 0.2s;
}

.noti-btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

/* MÀU THEO TYPE */
.noti-box.success .noti-icon span { color: #16a34a; }
.noti-box.error   .noti-icon span { color: #dc2626; }
.noti-box.warning .noti-icon span { color: #f59e0b; }
.noti-box.info    .noti-icon span { color: #0ea5e9; }
.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  margin: 6px 0;
  padding: 6px 0;
  border-bottom: 1px dashed #d1d5db;
}

/* Badge chung */
.payment-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

/* TIỀN MẶT */
.payment-badge.Tiền.mặt {
  background: rgba(16, 185, 129, 0.15);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.4);
}

/* CHUYỂN KHOẢN */
.payment-badge.Chuyển.khoản {
  background: rgba(59, 130, 246, 0.15);
  color: #2563eb;
  border: 1px solid rgba(59, 130, 246, 0.4);
}

/* NỢ */
.payment-badge.Nợ {
  background: rgba(239, 68, 68, 0.15);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.4);
}

/* Khi chưa chọn */
.payment-badge.none {
  background: #f3f4f6;
  color: #9ca3af;
}

</style>
<style>
.modal-backdrop {
  opacity: 0.05 !important;
  background-color: #000 !important;
  pointer-events: none;
}

/* Modal luôn nằm trên cùng */
#editModal.modal {
  z-index: 1100 !important;
}

/* Căn modal ra giữa màn hình */
#editModal .modal-dialog {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;

  min-height: 100vh !important;
  margin: 0 !important;
  transform: none !important;
}
#modalSuaHang .modal-dialog {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;

  min-height: 100vh !important;
  margin: 0 auto !important;
  transform: none !important;
}

/* backdrop mờ đẹp */

</style>

<script>
import QRCode from "qrcode";
window.QRCode = QRCode;
export default {
  data() {
    return {
        isExporting: false,
      apiUrl:
        "https://script.google.com/macros/s/AKfycbz_vsTrvAjmYq51LTtQhe-nkdOzbMQcpMGslSU8tuSObycF9l5HT7cqYKhJ11uqrpL8/exec",
          dsNhaCungCap: [],  // <-- THÊM DÒNG NÀY
  dsHangHoa: [],     // <-- THÊM DÒNG NÀY
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
     hang: {
  maHang: "",
  tenHang: "",
  soLuong: 0,
  slTonKho: 0,

  danhMuc: "",
  size: "",
  dvt: "",
  giaNhap: 0,
  donGia: 0,
  nhapTheoLo: false, // 🆕 checkbox
  giaLo: 0,          // 🆕 giá 1 lô
  soLo: 0,           // 🆕 số lượng lô
  soCaiMotLo: 0      // 🆕 số cái / lô


},
      noti: {
  show: false,
  message: "",
  type: "info", // success | error | warning | info
},

  hangSua: {}, // hàng đang được sửa
indexSua: null, // vị trí trong chiTiet
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
  try {
    // Load trước datalist
    await this.loadDanhSach();

    // Load thêm các dữ liệu khác (nếu có)
    await Promise.all([
      this.getNCCInfo(),
      this.getHangInfo(),
    ]);

    console.log("✅ Đã load NCC + Hàng hóa ngay khi vào trang");
  } catch (err) {
    console.error("❌ Lỗi khởi tạo:", err);
  }
}
,

  methods: {
    // 🧹 Xóa hàng khỏi danh sách
xoaHang(i) {
    if (confirm("⚠️ Bạn có chắc muốn xóa hàng này?")) {
      this.chiTiet.splice(i, 1);
    }
  },
showNoti(msg, type = "info", autoClose = true) {
  this.noti.message = msg;
  this.noti.type = type;
  this.noti.show = true;

  if (autoClose) {
    setTimeout(() => {
      this.noti.show = false;
    }, 2000);
  }
},

closeNoti() {
  this.noti.show = false;
},

  // ✏️ Mở modal sửa hàng
  moModalSua(item, index) {
    this.hangSua = JSON.parse(JSON.stringify(item)); // clone riêng
    this.indexSua = index;
    const modal = new bootstrap.Modal(document.getElementById("modalSuaHang"));
    modal.show();
  },

  // ⚙️ Tính lại theo lô trong modal sửa
  tinhTheoLoSua() {
    if (this.hangSua.nhapTheoLo && this.hangSua.giaLo && this.hangSua.soLo && this.hangSua.soCaiMotLo) {
      this.hangSua.soLuong = this.hangSua.soLo * this.hangSua.soCaiMotLo;
      const giaMotCai = this.hangSua.giaLo / this.hangSua.soCaiMotLo;
      this.hangSua.giaNhap = giaMotCai;
      this.capNhatGiaBanTuPhanTramSua();
    }
  },

  // 🔁 Cập nhật giá bán khi đổi % lời trong modal
 capNhatGiaBanTuPhanTramSua() {
  const { giaNhap, loiNhuan } = this.hangSua;
  if (!giaNhap || loiNhuan == null) return;
  let giaMoi = giaNhap * (1 + loiNhuan / 100);
  giaMoi = this.lamTronLenNghin(giaMoi);
  this.hangSua.donGia = giaMoi;

  // ✅ Cập nhật mã hàng theo giá mới
  this.capNhatMaHangSua();
},

// ✅ Tự động cập nhật mã hàng trong modal sửa
capNhatMaHangSua() {
  const tenNCC = (this.form.tenNCC || "").trim();
  const tenHang = (this.hangSua.tenHang || "").trim();
  if (!tenNCC || !tenHang) return (this.hangSua.maHang = "");

  const nhapTheoLo = this.hangSua.nhapTheoLo;
  const giaLo = Number(this.hangSua.giaLo) || 0;
  const soCaiMotLo = Number(this.hangSua.soCaiMotLo) || 0;
  const giaNhap = Number(this.hangSua.giaNhap) || 0;
  const loiNhuan = Number(this.hangSua.loiNhuan) || 0;

  // 🧩 1️⃣ Chữ cái đầu của NCC
  const phan1 = this.removeAccents(tenNCC)
    .split(" ")
    .filter(w => w)
    .map(w => w[0].toUpperCase())
    .join("");

  // 🧩 2️⃣ Hai số cuối năm hiện tại
  const phan2 = new Date().getFullYear().toString().slice(-2);

  // 🧩 3️⃣ Giá nhập x2 (bỏ 3 số cuối)
  let phan3;
  if (nhapTheoLo) {
    const bo000 = Math.floor(giaLo / 1000);
    phan3 = bo000 * 2;
  } else {
    const bo000 = Math.floor(giaNhap / 1000);
    phan3 = bo000 * 2;
  }

  // 🧩 4️⃣ Nếu nhập theo lô → thêm số cái/lô
  const phan4 = nhapTheoLo ? String(soCaiMotLo) : "";

  // 🧩 5️⃣ Mã giá bán ẩn (giống logic cũ)
  let giaNhap1Cai = nhapTheoLo ? (giaLo / (soCaiMotLo || 1)) : giaNhap;
  let giaBan = Number(this.hangSua.donGia) || (giaNhap1Cai * (1 + loiNhuan / 100));
  giaBan = this.lamTronLenNghin(giaBan);
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

  // 🧩 6️⃣ Viết tắt tên hàng
  const tenVietTat = this.removeAccents(tenHang)
    .split(/\s+/)
    .filter(w => w)
    .map(w => {
      const so = w.match(/\d+/g);
      if (so) return so.join('');
      return w[0].toUpperCase();
    })
    .join('');

  this.hangSua.maHang = `${phan1} ${phan2} ${phan3} ${phan4} ${phan5}(${tenVietTat})`;
},
resetNCC() {
  // Reset toàn bộ form NCC
  this.form.tenNCC = "";
  this.form.maNCC = "";
  this.form.sdt = "";
  this.form.diaChi = "";
  this.form.congNo = 0;
  this.form.trangThaiNCC = "";
  this.form.ghiChuNCC = "";
  this.form.ghiChuHoaDon = "";
  this.form.soHD = "";

  // Reset hàng đang nhập để không bị liên kết sai NCC
  this.hang.maHang = "";
  this.hang.tenHang = "";
  this.hang.danhMuc = "";
  this.hang.size = "";
  this.hang.dvt = "";
  this.hang.soLuong = 0;
  this.hang.giaNhap = 0;
  this.hang.donGia = 0;
  this.hang.nhapTheoLo = false;
  this.hang.giaLo = 0;
  this.hang.soLo = 0;
  this.hang.soCaiMotLo = 0;

  this.showNoti("🔄 Đã reset toàn bộ thông tin nhà cung cấp! Bạn có thể chọn lại NCC khác.");
}
,
  // 💾 Lưu thay đổi hàng
 async luuSuaHang() {
  if (this.indexSua === null) return;

  this.hangSua.thanhTien = this.hangSua.soLuong * this.hangSua.giaNhap;

  const gia1Lo = this.hangSua.nhapTheoLo ? `${this.formatView(this.hangSua.giaLo)}₫ (1 lô)` : "";
  const gia1Cai = `${this.formatView(this.hangSua.giaNhap)}₫ (1 cái)`;
  const giaBan = `${this.formatView(this.hangSua.donGia)}₫ (bán)`;
  const qrData = `${this.hangSua.maHang} | ${this.hangSua.tenHang} | ${
    gia1Lo ? gia1Lo + " | " : ""
  }${gia1Cai} | ${giaBan}`;
  const qrImg = await QRCode.toDataURL(qrData, { width: 150, margin: 1 });

  this.hangSua.qr_img = qrImg;
  this.hangSua.so_luong_lo = this.hangSua.soLo || 0;
  this.hangSua.so_cai_1_lo = this.hangSua.soCaiMotLo || 0;
  this.hangSua.gia_1_lo = this.hangSua.giaLo || 0;

  // ✅ Vue 3 chuẩn
  this.chiTiet[this.indexSua] = { ...this.hangSua };

  const modal = bootstrap.Modal.getInstance(document.getElementById("modalSuaHang"));
  modal.hide();

  this.hangSua = {};
  this.indexSua = null;
}
,
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
  if (!this.form.maNCC) return this.dsHangHoa;  
  return this.dsHangHoa.filter(h => h.ma_nha_cung_cap === this.form.maNCC);
}
,



onHangChange() {
  const input = (this.hang.maHang || "").trim().toLowerCase();

  const hh = this.dsHangHoa.find(h =>
    h.ma_hang && h.ma_hang.toLowerCase() === input
  );

  this.fillHang(hh);
}
,

onTenHangChange() {
  const input = (this.hang.tenHang || "").trim().toLowerCase();
  if (!input) return;

  const hh = this.dsHangHoa.find(h =>
    h.ten_hang && h.ten_hang.toLowerCase().includes(input)
  );

  this.fillHang(hh);
}

,

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

fillHang(hh) {
  if (!hh) return;

  // Giữ các thông tin cơ bản
  this.hang.maHang = hh.ma_hang;
  this.hang.tenHang = hh.ten_hang;
  this.hang.danhMuc = hh.danh_muc;
  this.hang.size = hh.size;
  this.hang.dvt = hh.dvt;
this.hang.slTonKho = Number(hh.so_luong_kho) || 0;
  // Giá nhập – giá bán
  this.hang.giaNhap = Number(hh.gia_goc) || 0;
  this.hang.donGia = Number(hh.don_gia) || 0;

  // GIÁ THEO LÔ (giữ lại để tính)
  this.hang.giaLo = Number(hh.gia_1_lo) || 0;

  // ❌ KHÔNG auto fill số lô
  this.hang.soLo = 0;

  // ❌ KHÔNG auto fill số cái/lô
  this.hang.soCaiMotLo = 0;

  // Nhập theo lô chỉ bật nếu có giá lô
  this.hang.nhapTheoLo = this.hang.giaLo > 0;

  // Không kích hoạt tính theo lô → vì người dùng phải nhập SL
  // Nếu muốn tự tính giá gốc theo giá lô thì để logic bên dưới:
  if (this.hang.giaLo > 0 && this.hang.soCaiMotLo > 0) {
    this.hang.giaNhap = Math.round(this.hang.giaLo / this.hang.soCaiMotLo);
  }

  // Tự lấy NCC gốc
  const ncc = this.dsNhaCungCap.find(n => n.ma_nha_cung_cap === hh.ma_nha_cung_cap);
  if (ncc) {
    this.form.maNCC = ncc.ma_nha_cung_cap;
    this.form.tenNCC = ncc.ten_nha_cung_cap;
    this.form.diaChi = ncc.dia_chi;
    this.form.sdt = ncc.so_dien_thoai;
    this.form.congNo = Number(ncc.cong_no) || 0;
    this.form.trangThaiNCC = ncc.trang_thai || "";
  }

  // Cập nhật mã hàng mới
  this.capNhatMaHang();
}

,
async genSoHoaDon() {
  const ma = (this.form.maNCC || "").trim().toUpperCase();
  const ten = (this.form.tenNCC || "").trim().toLowerCase();
  if (!ma && !ten) {
    this.form.soHD = "";
    return;
  }

  try {
    // 🧩 Lấy danh sách hóa đơn tổng từ Sheet
    const res = await fetch(`${this.apiUrl}?action=getHoaDonNhapHangTong`);

    const data = await res.json();

    // 🧩 Lọc các hóa đơn có cùng mã NCC
    let hoaDonLienQuan = data.filter(hd =>
      (hd.ma_nha_cung_cap || "").toUpperCase() === ma
    );

    // 🧩 Nếu chưa có hoặc muốn tăng độ chính xác → lọc thêm theo TÊN NCC
    if (hoaDonLienQuan.length === 0 && ten) {
      hoaDonLienQuan = data.filter(hd =>
        (hd.ten_nha_cung_cap || "").trim().toLowerCase() === ten
      );
    }

    // 🧩 Tìm số thứ tự cao nhất
    let stt = 1;
    if (hoaDonLienQuan.length > 0) {
      const soCuoi = hoaDonLienQuan.map(hd => {
        const match = (hd.so_hoa_don || "").match(/(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      });
      stt = Math.max(...soCuoi) + 1;
    }

    // 🧩 Format STT luôn có 2 chữ số (01, 02, 03, ...)
    const sttFormatted = stt.toString().padStart(2, "0");

    // 🎯 Tạo số hóa đơn chuẩn (ví dụ: PANH01, PANH02,...)
    this.form.soHD = `${ma}${sttFormatted}`;
    console.log(`✅ Số hóa đơn mới: ${this.form.soHD}`);
  } catch (err) {
    console.error("❌ Lỗi tạo số hóa đơn:", err);
    this.form.soHD = `${ma}01`; // fallback
  }
}
,

capNhatMaHang() {
  const tenNCC = (this.form.tenNCC || "").trim();
  const tenHang = (this.hang.tenHang || "").trim();
  if (!tenNCC || !tenHang) return (this.hang.maHang = "");

  const nhapTheoLo = this.hang.nhapTheoLo;
  const giaLo = Number(this.hang.giaLo) || 0;
  const soCaiMotLo = Number(this.hang.soCaiMotLo) || 0;
  const giaNhap = Number(this.hang.giaNhap) || 0;
  const loiNhuan = Number(this.hang.loiNhuan) || 0;

  // 🧩 1️⃣ Lấy chữ cái đầu mỗi từ trong tên NCC
  const phan1 = this.removeAccents(tenNCC)
    .split(" ")
    .filter(w => w)
    .map(w => w[0].toUpperCase())
    .join("");

  // 🧩 2️⃣ Hai số cuối của năm hiện tại
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

  // 🧩 4️⃣ Nếu nhập theo lô → số cái / 1 lô, nếu không thì bỏ qua
  const phan4 = nhapTheoLo ? String(soCaiMotLo) : "";

  // 🧩 5️⃣ Mã giá bán ẩn
  let giaNhap1Cai = nhapTheoLo ? (giaLo / (soCaiMotLo || 1)) : giaNhap;
  let giaBan = Number(this.hang.donGia) || (giaNhap1Cai * (1 + loiNhuan / 100));
  giaBan = this.lamTronLenNghin(giaBan);
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

  // 🧩 6️⃣ Sinh ký hiệu tên hàng (chữ cái đầu + giữ nguyên số)
  const tenVietTat = this.removeAccents(tenHang)
    .split(/\s+/)
    .filter(w => w)
    .map(w => {
      const so = w.match(/\d+/g);
      if (so) return so.join(''); // nếu có số → lấy nguyên dãy số
      return w[0].toUpperCase();  // nếu không → lấy chữ cái đầu
    })
    .join('');

  // 🎯 Mã hoàn chỉnh (có thêm phần trong ngoặc)
  this.hang.maHang = `${phan1}${phan2}${phan3}${phan4}${phan5}(${tenVietTat})`;
}
,




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
  // Nếu đang bấm lại vào hình thức đang chọn → bỏ chọn
  if (this.thanhToan.hinhThuc === ht) {
    this.thanhToan.hinhThuc = "";
    this.thanhToan.soTien = 0;
    return;
  }

  // Nếu chọn mới
  this.thanhToan.hinhThuc = ht;

  // Chọn "Nợ" thì auto set tiền = 0
  if (ht === "Nợ") this.thanhToan.soTien = 0;
}
,
async themHang(trangThai) {
   if (!this.hang.tenHang || !this.hang.soLuong || !this.hang.giaNhap)
    return this.showNoti("⚠️ Điền đủ thông tin hàng!");
  if (!this.hang.maHang) this.capNhatMaHang();

  // ⚠️ Nếu là TRẢ hàng mà mặt hàng này chưa có trong danh sách -> số lượng âm
  if (trangThai === "Trả") {
    const daTonTai = this.dsHangHoa.some(h => h.ma_hang === this.hang.maHang);
    if (!daTonTai && this.hang.soLuong > 0) {
      this.hang.soLuong = -Math.abs(this.hang.soLuong);
    }
  }

  const thanhTien = this.hang.soLuong * this.hang.giaNhap;

  // 🧩 1️⃣ Dữ liệu muốn encode vào QR
// 🧩 1️⃣ Dữ liệu muốn encode vào QR (định dạng theo yêu cầu)
const gia1Lo = this.hang.nhapTheoLo ? `${this.formatView(this.hang.giaLo)}₫ (nhập 1 lô)` : "";
const gia1Cai = `${this.formatView(this.hang.giaNhap)}₫ (nhập 1 cái)`;
const giaBan1Cai = `${this.formatView(this.hang.donGia)}₫ (bán 1 cái)`;

// 🧩 Ghép chuỗi QR
const qrData = `${this.hang.maHang} | ${this.hang.tenHang} | ${gia1Lo ? gia1Lo + " | " : ""}${gia1Cai} | ${giaBan1Cai}`;


  // 🧩 2️⃣ Tạo ảnh QR (base64)
  const qrImg = await QRCode.toDataURL(qrData, {
    width: 150,
    margin: 1,
    color: { dark: "#000000", light: "#ffffff" }
  });

  // 🧩 3️⃣ Gộp vào hàng đầy đủ
  const hangFull = {
    ...this.hang,
    maNcc: this.form.maNCC,
    tenNcc: this.form.tenNCC,
    ghiChuNhap: this.ghiChuNhap || "",
    thanhTien,
    trangThai,
    so_luong_lo: this.hang.soLo || 0,
    so_cai_1_lo: this.hang.soCaiMotLo || 0,
    gia_1_lo: this.hang.giaLo || 0,
    qr_img: qrImg // 🆕 thêm ảnh QR
  };

  const existing = this.chiTiet.find(h => h.maHang === hangFull.maHang && h.trangThai === trangThai);
  if (existing) {
    existing.soLuong += hangFull.soLuong;
    existing.thanhTien += hangFull.thanhTien;
  } else {
    this.chiTiet.push(hangFull);
  }

  // ✅ Reset form
  this.hang = {
    maHang: "",
    tenHang: "",
    soLuong: 0,
    danhMuc: "",
    size: "",
    dvt: "",
    giaNhap: 0,
    donGia: 0,
    nhapTheoLo: false,
    giaLo: 0,
    soLo: 0,
    soCaiMotLo: 0
  };
  this.ghiChuNhap = "";
},


    xacNhanThanhToan() {
      if (!this.thanhToan.hinhThuc) return this.showNoti("⚠️ Chọn hình thức thanh toán!");
      if (["Tiền mặt", "Chuyển khoản"].includes(this.thanhToan.hinhThuc) && !this.thanhToan.soTien)
        return this.showNoti("⚠️ Nhập số tiền thanh toán!");
      this.form.hinhThuc = this.thanhToan.hinhThuc;
      this.form.traTien = this.thanhToan.soTien;
      this.form.daThanhToan = true;
      this.showNoti("✅ Đã xác nhận thanh toán!");
    },
async xuatHoaDonNhap() {
    if (this.isExporting) return; // tránh spam
  this.isExporting = true;
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
    return this.showNoti("⚠️ Cần xác nhận thanh toán trước khi xuất hóa đơn nhập hàng!");
  }
const chiTietCoLo = this.chiTiet.map(h => ({
  ...h,
  so_luong_lo: h.so_luong_lo || 0,
  so_cai_1_lo: h.so_cai_1_lo || 0,
  gia_1_lo: h.gia_1_lo || 0,
    qr_img: h.qr_img || "" // 🆕 gửi kèm ảnh QR base64
}));
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
   chi_tiet: chiTietCoLo,
  
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

    this.showNoti("✅ Đã gửi yêu cầu nhập hàng! Dữ liệu sẽ được ghi sau vài giây.");

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
  } finally {
  this.isExporting = false;
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
  'form.tenNCC': 'capNhatMaHang',

   // 🧩 Khi thay đổi % lời trong modal → cập nhật giá bán + mã hàng
  'hangSua.loiNhuan': function () {
    this.capNhatGiaBanTuPhanTramSua();
  },

  // 🧩 Khi thay đổi giá nhập → cập nhật mã hàng modal
  'hangSua.giaNhap': function () {
    this.capNhatMaHangSua();
  },

  // 🧩 Khi thay đổi tên hàng → cập nhật mã hàng modal
  'hangSua.tenHang': function () {
    this.capNhatMaHangSua();
  },

  // 🧩 Khi đổi checkbox nhập theo lô hoặc giá lô → cập nhật mã hàng modal
  'hangSua.nhapTheoLo': 'capNhatMaHangSua',
  'hangSua.giaLo': 'capNhatMaHangSua',
  'hangSua.soCaiMotLo': 'capNhatMaHangSua',
}


};
</script>


