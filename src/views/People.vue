<template>
  <div class="container-fluid py-4">
    <h2 class="text-center mb-4 fw-bold" style="color: #000428;">🧍‍♂️ QUẢN LÝ KHÁCH HÀNG & NHÀ CUNG CẤP</h2>

    <div class="row g-3 mb-4">
      
      <!-- ========== Ô 1: TÌM KIẾM (TRÊN) ========== -->
      <div class="col-12">
        <div class="search-section shadow-sm">
          <div class="search-header">
            <h5 class="search-title">TÌM KIẾM</h5>
          </div>
          <div class="search-content">
            <input 
              v-model="search" 
              class="form-control" 
              placeholder="🔎 Tìm theo mã hoặc tên khách hàng / nhà cung cấp..." 
            />
          </div>
        </div>
      </div>

      <!-- ========== Ô 2: FORM NHẬP (TRÁI) ========== -->
      <div class="col-lg-8">
        <div class="form-section shadow-sm">
          <div class="form-header">
            <h5 class="form-title">THÊM HOẶC CẬP NHẬT NGƯỜI</h5>
          </div>
          <div class="form-content">
            <div class="row g-2">
              <!-- Mã -->
              <div class="col-md-3">
                <label class="form-label">Mã</label>
                <input v-model="form.ma" class="form-control form-control-sm" placeholder="Tự động" readonly />
              </div>
              
              <!-- Ảnh đại diện -->
              <div class="col-md-2 text-center">
                <label class="form-label">Ảnh</label>
                <input type="file" @change="uploadAva" class="form-control form-control-sm" />
                <img v-if="form.avatar" :src="form.avatar" class="img-fluid rounded mt-1 shadow-sm" style="max-height:60px" />
              </div>

              <!-- Vai trò | Tên -->
              <div class="col-md-3">
                <label class="form-label">Vai trò</label>
                <select v-model="form.vaiTro" class="form-select form-select-sm">
                  <option value="">-- Chọn --</option>
                  <option value="Khách hàng">Khách hàng</option>
                  <option value="Nhà cung cấp">Nhà cung cấp</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">Tên</label>
                <input v-model="form.ten" class="form-control form-control-sm" placeholder="VD: Nguyễn Văn A" @input="capNhatMa" />
              </div>

              <!-- SĐT | Địa chỉ -->
              <div class="col-md-3">
                <label class="form-label">SĐT</label>
                <input v-model="form.sdt" class="form-control form-control-sm" placeholder="0933..." />
              </div>
              <div class="col-md-9">
                <label class="form-label">Địa chỉ</label>
                <input v-model="form.diaChi" class="form-control form-control-sm" placeholder="VD: 163 Nguyễn Huệ" @input="capNhatMa" />
              </div>

              <!-- Trạng thái | Công nợ -->
              <div class="col-md-4">
                <label class="form-label">Trạng thái</label>
                <select v-model="form.trangThai" class="form-select form-select-sm">
                  <option value="">-- Không có --</option>
                  <option v-for="t in danhSachTrangThaiForm" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Công nợ</label>
                <input
                  type="text"
                  class="form-control form-control-sm"
                  :value="formatMoney(form.congNo)"
                  @input="onCongNoInput($event)"
                  placeholder="VD: 500000"
                />
              </div>

              <!-- Ghi chú -->
              <div class="col-md-5">
                <label class="form-label">Ghi chú</label>
                <input v-model="form.ghiChu" class="form-control form-control-sm" placeholder="Ghi chú thêm..." />
              </div>

              <!-- Nút Lưu -->
              <div class="col-12 text-end mt-2">
                <button class="btn btn-save" @click="savePerson">TẠO</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== Ô 3: BỘ LỌC (PHẢI) ========== -->
      <div class="col-lg-4">
        <div class="filter-section shadow-sm">
          <div class="filter-header">
            <h5 class="filter-title">⚙️ BỘ LỌC</h5>
          </div>
          <div class="filter-content">
            <!-- Lọc vai trò -->
            <div class="mb-2">
              <label class="form-label">Lọc vai trò</label>
              <select v-model="filterVaiTro" class="form-select form-select-sm">
                <option value="">-- Tất cả --</option>
                <option value="Khách hàng">Khách hàng</option>
                <option value="Nhà cung cấp">Nhà cung cấp</option>
              </select>
            </div>

            <!-- Lọc trạng thái -->
            <div class="mb-2">
              <label class="form-label">Lọc trạng thái</label>
              <select v-model="filterTrangThai" class="form-select form-select-sm">
                <option value="">-- Tất cả --</option>
                <option v-for="t in danhSachTrangThaiFilter" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>

            <!-- Nút xóa bộ lọc -->
            <button class="btn btn-clear w-100 mt-2" @click="resetBoLoc">
              🧹 XÓA BỘ LỌC
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== Ô 4: DANH SÁCH THẺ (DƯỚI) ========== -->
    <div class="cards-section">
      <div class="row g-3">
        <div v-for="(p, i) in filteredPeople" :key="i" class="col-12 col-sm-6 col-md-4 col-lg-3">
          <div 
            class="person-card shadow-sm" 
            :class="p.vai_tro === 'Nhà cung cấp' ? 'person-card-ncc' : 'person-card-kh'"
            @click="openModal(p)"
          >
            <!-- Phần ảnh - nền trắng -->
            <div class="card-qr-section">
              <img
                :src="p.avatar || 'https://i.imgur.com/t9d6p7E.png'"
                class="card-avatar"
              />
            </div>

            <!-- Phần thông tin - nền gradient -->
            <div class="card-info-section">
              <div class="card-code">{{ p.ma_khach_hang || p.ma_nha_cung_cap }}</div>
              <div class="card-name">{{ p.ten_khach_hang || p.ten_nha_cung_cap }}</div>
              
              <!-- Box giá - nền trắng -->
              <div class="card-price-box">
                  <div class="price-row">
                  <span class="price-label">VAI TRÒ:</span>
                  <span class="price-value-info">{{ p.vai_tro }}</span>
                </div>
                <div class="price-row">
                  <span class="price-label">SĐT:</span>
                  <span class="price-value-info">{{ p.so_dien_thoai }}</span>
                </div>
                <div class="price-row">
                  <span class="price-label">ĐỊA CHỈ:</span>
                  <span class="price-value-info">{{ p.dia_chi }}</span>
                </div>
                <div class="price-row">
                  <span class="price-label">CÔNG NỢ:</span>
                  <span 
                    class="price-value"
                    :class="p.cong_no < 0 ? 'debt' : ''"
                  >
                    {{ formatMoney(p.cong_no) }}
                  </span>
                </div>
              </div>

              <!-- Thời gian / Ghi chú -->
              <div class="card-time">📄 {{ p.trang_thai || 'Không có' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== MODAL CHI TIẾT ========== -->
    <div v-if="showModal" class="modal-backdrop" @click.self="showModal = false">
      <div class="modal-content-custom">
        <div class="modal-header-custom">
          <h5 class="modal-title-custom">✏️ Sửa thông tin {{ editPerson.vai_tro }}</h5>
          <button class="btn-close-custom" @click="showModal = false">✕</button>
        </div>

        <div class="modal-body-custom">
          <div class="row g-2">
            <div class="col-md-3">
              <label class="form-label">Mã</label>
              <input v-model="editPerson.ma" class="form-control form-control-sm" readonly />
            </div>
            <div class="col-md-5">
              <label class="form-label">Tên</label>
              <input v-model="editPerson.ten" class="form-control form-control-sm" />
            </div>
            <div class="col-md-4">
              <label class="form-label">SĐT</label>
              <input v-model="editPerson.so_dien_thoai" class="form-control form-control-sm" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Địa chỉ</label>
              <input v-model="editPerson.dia_chi" class="form-control form-control-sm" />
            </div>
            <div class="col-md-3">
              <label class="form-label">Trạng thái</label>
              <select v-model="editPerson.trang_thai" class="form-select form-select-sm">
                <option value="">-- Không có --</option>
                <option
                  v-for="t in editPerson.vai_tro === 'Khách hàng'
                    ? ['Khách còn nợ', 'Mình nợ khách']
                    : ['Mình nợ NCC', 'NCC còn nợ mình']"
                  :key="t"
                  :value="t"
                >
                  {{ t }}
                </option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Công nợ</label>
              <input
                type="text"
                class="form-control form-control-sm"
                :value="formatMoney(editPerson.cong_no)"
                @input="onEditCongNoInput($event)"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">Ghi chú</label>
              <input v-model="editPerson.ghi_chu" class="form-control form-control-sm" />
            </div>
          </div>
        </div>

        <div class="modal-footer-custom">
          <button class="btn btn-success btn-sm me-2" @click="updatePerson">💾 Lưu</button>
          <button class="btn btn-danger btn-sm me-2" @click="deletePerson">🗑 Xóa</button>
          <button class="btn btn-secondary btn-sm" @click="showModal = false">❌ Đóng</button>
        </div>
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
/* ========== Ô 1: TÌM KIẾM ========== */
.search-section {
  background: #ffffff;
  border: 2px solid #B8CCE4;
  border-radius: 10px;
  overflow: hidden;
}

.search-header {
  background: linear-gradient(135deg, #000428 0%, #004e92 100%);
  padding: 10px 18px;
}

.search-title {
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 900;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0,0,0,0.35);
}

.search-content {
  padding: 15px 18px;
}

.search-content .form-control {
  border: 2px solid #B8CCE4;
  border-radius: 25px;
  padding: 10px 20px;
  font-size: 0.95rem;
}

.search-content .form-control:focus {
  border-color: #000428;
  box-shadow: 0 0 0 0.2rem rgba(0, 4, 40, 0.15);
}

/* ========== Ô 2: FORM NHẬP ========== */
.form-section {
  background: #ffffff;
  border: 2px solid #B8CCE4;
  border-radius: 10px;
  overflow: hidden;
  height: 100%;
}

.form-header {
  background: linear-gradient(135deg, #000428 0%, #004e92 100%);
  padding: 10px 18px;
}

.form-title {
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 900;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0,0,0,0.35);
}

.form-content {
  padding: 15px 18px;
}

.form-content .form-label {
  color: #000428;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 3px;
  text-transform: uppercase;
}

.form-content .form-control-sm,
.form-content .form-select-sm {
  border: 1px solid #B8CCE4;
  border-radius: 15px;
  padding: 6px 10px;
  font-size: 0.85rem;
}

.form-content .form-control-sm:focus,
.form-content .form-select-sm:focus {
  border-color: #000428;
  box-shadow: 0 0 0 0.1rem rgba(0, 4, 40, 0.1);
}

.btn-save {
  background: linear-gradient(135deg, #000428 0%, #004e92 100%);
  color: white;
  font-weight: 700;
  padding: 8px 24px;
  border: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.btn-save:hover {
  background: linear-gradient(135deg, #004e92 0%, #000428 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 4, 40, 0.3);
}

/* ========== Ô 3: BỘ LỌC ========== */
.filter-section {
  background: #ffffff;
  border: 2px solid #B8CCE4;
  border-radius: 10px;
  overflow: hidden;
  height: 100%;
}

.filter-header {
  background: linear-gradient(135deg, #000428 0%, #004e92 100%);
  padding: 10px 18px;
}

.filter-title {
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 900;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0,0,0,0.35);
}

.filter-content {
  padding: 15px 18px;
}

.filter-content .form-label {
  color: #000428;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 3px;
  text-transform: uppercase;
}

.filter-content .form-select-sm {
  border: 1px solid #B8CCE4;
  border-radius: 5px;
  padding: 6px 10px;
  font-size: 0.85rem;
}

.filter-content .form-select-sm:focus {
  border-color: #000428;
  box-shadow: 0 0 0 0.1rem rgba(0, 4, 40, 0.1);
}

.btn-clear {
  background: #6c757d;
  color: white;
  font-weight: 700;
  padding: 8px;
  border: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.btn-clear:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

/* ========== Ô 4: DANH SÁCH THẺ ========== */
.cards-section {
  margin-top: 20px;
}

.person-card {
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6px 20px rgba(0, 4, 40, 0.25);
  position: relative;
}

/* KHÁCH HÀNG - Xanh dương FULL */
.person-card-kh {
  background: linear-gradient(180deg, #004e92 0%, #003d75 35%, #002f5a 65%, #000428 100%);
  border: 4px solid #000428;
}

.person-card-kh:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 30px rgba(0, 78, 146, 0.4);
  opacity: 0.95;
}

/* NHÀ CUNG CẤP - Xám xanh FULL */
.person-card-ncc {
  background: linear-gradient(180deg, #536976 0%, #3f525e 35%, #363e4a 65%, #292e49 100%);
  border: 4px solid #292e49;
}

.person-card-ncc:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 30px rgba(83, 105, 118, 0.4);
  opacity: 0.95;
}

/* Phần ảnh */
.card-qr-section {
  background: transparent;
  padding: 20px 15px 10px 15px;
  text-align: center;
  position: relative;
}

.card-avatar {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 50%;
  background: #ffffff;
  padding: 3px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 3px solid rgba(255, 255, 255, 0.9);
}

/* Phần thông tin */
.card-info-section {
  background: transparent;
  padding: 12px 15px 15px 15px;
  position: relative;
  z-index: 1;
}

.card-code {
  font-size: 1.05rem;
  font-weight: 900;
  color: #ffffff;
  margin: 0 0 3px 0;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.card-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  margin-bottom: 12px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

/* Box thông tin - nền trắng */
.card-price-box {
  background: rgba(255, 255, 255, 0.95);
  padding: 10px 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  font-size: 0.8rem;
}

.price-row:last-child {
  margin-bottom: 0;
}

.price-label {
  color: #000428;
  font-weight: 700;
}

.price-value {
  color: #28a745;
  font-weight: 900;
}

.price-value.debt {
  color: #dc3545;
}

.price-value-info {
  color: #000428;
  font-weight: 700;
  font-size: 0.75rem;
}

/* Trạng thái */
.card-time {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin-top: 8px;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 6px;
}

/* ========== MODAL ========== */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 4, 40, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content-custom {
  background: #ffffff;
  border-radius: 15px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 4, 40, 0.5);
  animation: modalPop 0.3s ease;
  border: 3px solid #000428;
}

@keyframes modalPop {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-header-custom {
  background: linear-gradient(135deg, #000428 0%, #004e92 100%);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid rgba(255, 255, 255, 0.2);
}

.modal-title-custom {
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 900;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.btn-close-custom {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.btn-close-custom:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.modal-body-custom {
  padding: 20px;
}

.modal-body-custom .form-label {
  color: #000428;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 3px;
  text-transform: uppercase;
}

.modal-footer-custom {
  padding: 15px 20px;
  border-top: 2px solid #e9ecef;
  text-align: right;
}
</style>

<script setup>
import { ref, computed,watch  } from "vue";

const apiUrl =
  "https://script.google.com/macros/s/AKfycbz_vsTrvAjmYq51LTtQhe-nkdOzbMQcpMGslSU8tuSObycF9l5HT7cqYKhJ11uqrpL8/exec";
const imgbbKey = "b202a4bdc79bf1dc72f6f6ded6b74501";

const form = ref({
  vaiTro: "",
  ma: "",
  ten: "",
  sdt: "",
  diaChi: "",
  trangThai: "",
  congNo: 0,
  ghiChu: "",
  avatar: "",
});

const people = ref([]);
const showModal = ref(false);
const editPerson = ref({});

const search = ref("");
const filterVaiTro = ref("");
const filterTrangThai = ref("");
// 🧭 FORM NHẬP: đổi trạng thái thì công nợ đổi dấu
watch(
  () => form.value.trangThai,
  (newTrangThai) => {
    if (form.value.congNo == null) return;
    const isNegative = ["Mình nợ khách", "Mình nợ NCC"].includes(newTrangThai);
    const abs = Math.abs(Number(form.value.congNo) || 0);
    form.value.congNo = isNegative ? -abs : abs;
  }
);

// 🧭 MODAL BOX: đổi trạng thái thì công nợ đổi dấu
watch(
  () => editPerson.value.trang_thai,
  (newTrangThai) => {
    if (!editPerson.value || editPerson.value.cong_no == null) return;
    const isNegative = ["Mình nợ khách", "Mình nợ NCC"].includes(newTrangThai);
    const abs = Math.abs(Number(editPerson.value.cong_no) || 0);
    editPerson.value.cong_no = isNegative ? -abs : abs;
  }
);

// 🧠 Danh sách trạng thái cho FORM nhập
const danhSachTrangThaiForm = computed(() =>
  form.value.vaiTro === "Khách hàng"
    ? ["Khách còn nợ", "Mình nợ khách"]
    : form.value.vaiTro === "Nhà cung cấp"
    ? ["Mình nợ NCC", "NCC còn nợ mình"]
    : []
);

// 🧠 Danh sách trạng thái cho BỘ LỌC
const danhSachTrangThaiFilter = computed(() =>
  filterVaiTro.value === "Khách hàng"
    ? ["Khách còn nợ", "Mình nợ khách"]
    : filterVaiTro.value === "Nhà cung cấp"
    ? ["Mình nợ NCC", "NCC còn nợ mình"]
    : ["Khách còn nợ", "Mình nợ khách", "Mình nợ NCC", "NCC còn nợ mình"]
);

async function updatePerson() {
  const role = editPerson.value.vai_tro;
  const action = role === "Khách hàng" ? "updateKhachHang" : "updateNhaCungCap";

  if (["Mình nợ khách", "Mình nợ NCC"].includes(editPerson.value.trang_thai))
    editPerson.value.cong_no = -Math.abs(editPerson.value.cong_no);
  else
    editPerson.value.cong_no = Math.abs(editPerson.value.cong_no);

  const data =
    role === "Khách hàng"
      ? {
          ma_khach_hang: editPerson.value.ma,
          ten_khach_hang: editPerson.value.ten,
          so_dien_thoai: editPerson.value.so_dien_thoai,
          dia_chi: editPerson.value.dia_chi,
          cong_no: editPerson.value.cong_no,
          trang_thai: editPerson.value.trang_thai,
          ghi_chu: editPerson.value.ghi_chu,
          avatar: editPerson.value.avatar,
        }
      : {
          ma_nha_cung_cap: editPerson.value.ma,
          ten_nha_cung_cap: editPerson.value.ten,
          so_dien_thoai: editPerson.value.so_dien_thoai,
          dia_chi: editPerson.value.dia_chi,
          cong_no: editPerson.value.cong_no,
          trang_thai: editPerson.value.trang_thai,
          ghi_chu: editPerson.value.ghi_chu,
          avatar: editPerson.value.avatar,
        };

  await fetch(apiUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, data }),
  });

  alert("✅ Đã cập nhật!");
  showModal.value = false;
  loadPeople();
}





async function deletePerson() {
  if (!confirm("⚠️ Bạn có chắc muốn xóa người này không?")) return;

  const type = editPerson.value.vai_tro === "Khách hàng" ? "khach" : "ncc";

  await fetch(apiUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "deletePerson",
      data: { type, ma: editPerson.value.ma }, // ✅ BE đọc body.data
    }),
  });

  alert("🗑️ Đã xóa thành công!");
  showModal.value = false;
  loadPeople();
}







function removeAccents(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function capNhatMa() {
  const ten = removeAccents(form.value.ten || "")
    .split(" ")
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
  const dc = removeAccents(form.value.diaChi || "")
    .split(" ")
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
  form.value.ma = ten + dc;
}

function formatMoney(n) {
  if (isNaN(n)) return "0";
  return Number(n).toLocaleString("vi-VN");
}
function openModal(p) {
  showModal.value = true;

  editPerson.value = {
    vai_tro: p.vai_tro,
    ma: p.ma_khach_hang || p.ma_nha_cung_cap || "",
    ten: p.ten_khach_hang || p.ten_nha_cung_cap || "",
    so_dien_thoai: p.so_dien_thoai || "",
    dia_chi: p.dia_chi || "",
    trang_thai: p.trang_thai || "",
    cong_no: Number(p.cong_no) || 0,
    ghi_chu: p.ghi_chu || "",
    avatar: p.avatar || "",
  };
}
// 🧮 Khi người dùng nhập lại công nợ trong modal
function onEditCongNoInput(e) {
  const raw = e.target.value.replace(/[^\d\-]/g, ''); // chỉ giữ số và dấu âm
  editPerson.value.cong_no = Number(raw || 0);
}
function onCongNoInput(e) {
  const raw = e.target.value.replace(/[^\d\-]/g, ''); // chỉ giữ số và dấu âm
  form.value.congNo = Number(raw || 0);
}

// 📸 Upload avatar
async function uploadAva(e) {
  const file = e.target.files[0];
  if (!file) return;
  const fd = new FormData();
  fd.append("image", file);
 const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
  method: "POST",
  body: fd,
});
const data = await res.json();
form.value.avatar = data.data.url;
}

// 💾 Gửi POST dạng no-cors
async function savePerson() {
  if (!form.value.vaiTro || !form.value.ten)
    return alert("Vui lòng nhập đầy đủ thông tin!");

  if (["Mình nợ khách", "Mình nợ NCC"].includes(form.value.trangThai))
    form.value.congNo = -Math.abs(form.value.congNo);
  else
    form.value.congNo = Math.abs(form.value.congNo);

  const action =
    form.value.vaiTro === "Khách hàng"
      ? "addKhachHang"
      : "addNhaCungCap";

  const data =
    form.value.vaiTro === "Khách hàng"
      ? {
          ma_khach_hang: form.value.ma,
          ten_khach_hang: form.value.ten,
          so_dien_thoai: form.value.sdt,
          dia_chi: form.value.diaChi,
          cong_no: form.value.congNo,
          trang_thai: form.value.trangThai,
          ghi_chu: form.value.ghiChu,
          avatar: form.value.avatar,
        }
      : {
          ma_nha_cung_cap: form.value.ma,
          ten_nha_cung_cap: form.value.ten,
          so_dien_thoai: form.value.sdt,
          dia_chi: form.value.diaChi,
          cong_no: form.value.congNo,
          trang_thai: form.value.trangThai,
          ghi_chu: form.value.ghiChu,
          avatar: form.value.avatar,
        };

  await fetch(apiUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, data }),
  });

  alert("✅ Đã thêm thành công!");
  resetForm();
  loadPeople();
}


function resetForm() {
  form.value = {
    vaiTro: "",
    ma: "",
    ten: "",
    sdt: "",
    diaChi: "",
    trangThai: "",
    congNo: 0,
    ghiChu: "",
    avatar: "",
  };
}

// 🧠 loadPeople()
async function loadPeople() {
  try {
    const [kh, ncc] = await Promise.all([
      fetch(`${apiUrl}?action=getKhachHang`),
      fetch(`${apiUrl}?action=getNhaCungCap`),
    ]);

    const dataKH = await kh.json();
    const dataNCC = await ncc.json();

    people.value = [
      ...dataKH.map(r => ({ ...r, vai_tro: "Khách hàng" })),
      ...dataNCC.map(r => ({ ...r, vai_tro: "Nhà cung cấp" })),
    ];
  } catch (err) {
    console.error("❌ Không tải được dữ liệu:", err);
  }
}


function resetBoLoc() {
  search.value = "";
  filterVaiTro.value = "";
  filterTrangThai.value = "";
}

const filteredPeople = computed(() => {
  let list = [...people.value];
  const s = search.value.trim().toLowerCase();
  if (s) {
    list = list.filter(
      (r) =>
        r.ma_khach_hang?.toLowerCase().includes(s) ||
        r.ma_nha_cung_cap?.toLowerCase().includes(s) ||
        r.ten_khach_hang?.toLowerCase().includes(s) ||
        r.ten_nha_cung_cap?.toLowerCase().includes(s)
    );
  }
  if (filterVaiTro.value)
    list = list.filter((r) => r.vai_tro === filterVaiTro.value);
  if (filterTrangThai.value)
    list = list.filter((r) => r.trang_thai === filterTrangThai.value);
  return list;
});

loadPeople();
</script>


