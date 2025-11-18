<template>
  <div class="container-fluid py-4">
    <h2 class="text-center mb-4 fw-bold page-title">🕓 LỊCH SỬ HOẠT ĐỘNG</h2>

    <!-- ========== Ô 1: TÌM KIẾM ========== -->
    <div class="search-section shadow-sm mb-3">
      <div class="search-header">
        <h5 class="search-title">🔍 TÌM KIẾM</h5>
      </div>
      <div class="search-content">
        <input
          v-model="search"
          type="text"
          class="form-control"
          placeholder="🔎 Nhập từ khóa tìm kiếm..."
        />
      </div>
    </div>

    <!-- ========== Ô 2: BỘ LỌC ========== -->
    <div class="filter-section shadow-sm mb-4">
      <div class="filter-header">
        <h5 class="filter-title">⚙️ BỘ LỌC</h5>
      </div>
      <div class="filter-content">
        <div class="row g-3">
          <!-- Lọc hành động -->
          <div class="col-md-3">
            <label class="form-label">Lọc theo hành động</label>
            <select v-model="filterAction" class="form-select form-select-sm">
              <option value="">-- Tất cả --</option>
              <option v-for="opt in actionOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>

          <!-- Từ ngày -->
          <div class="col-md-3">
            <label class="form-label">Từ ngày</label>
            <input type="date" v-model="dateFrom" class="form-control form-control-sm" />
          </div>

          <!-- Đến ngày -->
          <div class="col-md-3">
            <label class="form-label">Đến ngày</label>
            <input type="date" v-model="dateTo" class="form-control form-control-sm" />
          </div>

          <!-- Sắp xếp -->
          <div class="col-md-3">
            <label class="form-label">Sắp xếp</label>
            <select v-model="sortOrder" class="form-select form-select-sm">
              <option value="desc">Mới nhất → Cũ nhất</option>
              <option value="asc">Cũ nhất → Mới nhất</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== Ô 3: BẢNG LỊCH SỬ ========== -->
    <div class="table-section shadow-sm">
      <div class="table-header">
        <h5 class="table-title">📋 BẢNG DỮ LIỆU</h5>
      </div>
      <div class="table-content">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-head">
              <tr>
                <th style="min-width: 150px;"> Thời gian</th>
                <th style="min-width: 120px;"> Người thực hiện</th>
                <th style="min-width: 350px;"> Chi tiết</th>
                <th style="min-width: 500px;"> Dữ liệu thay đổi</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, i) in paginatedRows"
                :key="i"
                :class="rowClass(row.hanh_dong)"
              >
                <td class="text-nowrap text-center">{{ row.thoi_gian }}</td>
                <td class="text-center fw-semibold text-primary-custom">
                  {{ row.nguoi_dung || "—" }}
                </td>
                <td>{{ row.chi_tiet }}</td>
                <td>
                  <pre class="data-pre">{{ formatDiffText(row.du_lieu_thay_doi) }}</pre>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="!paginatedRows.length" class="text-center py-4 text-muted">
            <i>Không có dữ liệu phù hợp</i>
          </div>
        </div>

        <!-- Phân trang -->
        <div
          class="pagination-wrapper"
          v-if="totalPages > 1"
        >
          <button class="btn-page" :disabled="page === 1" @click="page--">
            ◀ Trước
          </button>

          <span class="page-info">
            Trang {{ page }} / {{ totalPages }}
          </span>

          <button
            class="btn-page"
            :disabled="page === totalPages"
            @click="page++"
          >
            Sau ▶
          </button>

          
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
/* ========== TIÊU ĐỀ TRANG ========== */
.page-title {
  color: #005c97;
  font-size: 1.8rem;
  text-shadow: 0 2px 4px rgba(0, 92, 151, 0.15);
}

/* ========== Ô 1: TÌM KIẾM ========== */
.search-section {
  background: #ffffff;
  border: 2px solid #B8CCE4;
  border-radius: 10px;
  overflow: hidden;
}

.search-header {
  background: linear-gradient(135deg, #005c97 0%, #363795 100%);
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
  border-color: #005c97;
  box-shadow: 0 0 0 0.2rem rgba(0, 92, 151, 0.15);
}

/* ========== Ô 2: BỘ LỌC ========== */
.filter-section {
  background: #ffffff;
  border: 2px solid #B8CCE4;
  border-radius: 10px;
  overflow: hidden;
}

.filter-header {
  background: linear-gradient(135deg, #005c97 0%, #363795 100%);
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
  color: #005c97;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 3px;
  text-transform: uppercase;
}

.filter-content .form-control-sm,
.filter-content .form-select-sm {
  border: 1px solid #B8CCE4;
  border-radius: 5px;
  padding: 6px 10px;
  font-size: 0.85rem;
}

.filter-content .form-control-sm:focus,
.filter-content .form-select-sm:focus {
  border-color: #005c97;
  box-shadow: 0 0 0 0.1rem rgba(0, 92, 151, 0.1);
}

/* ========== Ô 3: BẢNG CHUYÊN NGHIỆP ========== */
.table-section {
  background: #ffffff;
  border: 3px solid #005c97;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 92, 151, 0.12);
}

.table-header {
  background: linear-gradient(135deg, #005c97 0%, #004578 50%, #363795 100%);
  padding: 14px 20px;
  border-bottom: 3px solid #363795;
}

.table-title {
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 900;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.4);
}

.table-content {
  padding: 0;
  background: #f8fcff;
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.table {
  margin: 0;
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}

/* Header bảng */
.table-head {
  background: linear-gradient(135deg, #005c97 0%, #363795 100%);
  position: sticky;
  top: 0;
  z-index: 10;
}

.table-head th {
  color: #030a74;
  font-weight: 800;
  font-size: 0.85rem;
  text-align: center;
  padding: 14px 12px;
  vertical-align: middle;
  border-bottom: 3px solid #004578;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
}

.table-head th:last-child {
  border-right: none;
}

/* Body bảng */
.table tbody tr {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 1px solid #e0e7ef;
}

.table tbody tr:hover {
  background: linear-gradient(90deg, #f0f8ff 0%, #ffffff 100%) !important;
 cursor: pointer;
  box-shadow: 
    -3px 0 0 0 #005c97,
    0 2px 12px rgba(0, 92, 151, 0.15);
}

.table tbody td {
  padding: 12px 14px;
  vertical-align: middle;
  font-size: 0.88rem;
  font-weight: bold;
  border-right: 1px solid #e8f0f8;
  color: #2c3e50;
}

.table tbody td:last-child {
  border-right: none;
}

.text-primary-custom {
  color: #005c97 !important;
  font-weight: 700;
}

/* Màu nền cho các loại hành động */
.table-success {
  background: linear-gradient(90deg, #e8f5e9 0%, #f1f8f4 100%) !important;
  border-left: 5px solid #4caf50 !important;
}

.table-warning {
  background: linear-gradient(90deg, #fff8e1 0%, #fffbf0 100%) !important;
  border-left: 5px solid #ff9800 !important;
}

.table-danger {
  background: linear-gradient(90deg, #ffebee 0%, #fff5f5 100%) !important;
  border-left: 5px solid #f44336 !important;
}

.table-info {
  background: linear-gradient(90deg, #e0f7fa 0%, #f0fbfc 100%) !important;
  border-left: 5px solid #00bcd4 !important;
}

/* Pre data với styling cao cấp */
.data-pre {
  font-size: 0.82rem;
  font-weight: bold;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  background: linear-gradient(135deg, #f8fcff 0%, #f0f8ff 100%);
  border-left: 4px solid #005c97;
  border-radius: 6px;
  padding: 12px 14px;
  margin: 0;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Courier New', monospace;
  color: #2c3e50;
  box-shadow: 0 2px 8px rgba(0, 92, 151, 0.08);
  max-height: 200px;
  overflow-y: auto;
}

.data-pre::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.data-pre::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.data-pre::-webkit-scrollbar-thumb {
  background: #005c97;
  border-radius: 3px;
}

.data-pre::-webkit-scrollbar-thumb:hover {
  background: #004578;
}

/* Empty state */
.text-center.py-4.text-muted {
  background: linear-gradient(135deg, #f8fcff 0%, #f0f8ff 100%);
  padding: 40px 20px !important;
  border-radius: 8px;
  margin: 20px;
}

.text-center.py-4.text-muted i {
  font-size: 1.1rem;
  color: #7e8ba3;
}

/* ========== PHÂN TRANG CHUYÊN NGHIỆP ========== */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 18px 20px;
  background: linear-gradient(135deg, #005c97 0%, #363795 100%);
  border-top: 3px solid #004578;
  flex-wrap: wrap;
}

.btn-page {
  background: #ffffff;
  color: #005c97;
  border: 2px solid #ffffff;
  padding: 9px 22px;
  border-radius: 8px;
  font-weight: 800;
  font-size: 0.85rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.btn-page:hover:not(:disabled) {
  background: #005c97;
  color: #ffffff;
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}

.btn-page:disabled {
  background: rgba(255, 255, 255, 0.5);
  color: rgba(0, 92, 151, 0.4);
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
}

.page-info {
  font-weight: 900;
  color: #ffffff;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.15);
  padding: 8px 18px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.pagination-wrapper .form-select-sm {
  background: #ffffff;
  color: #005c97;
  border: 2px solid #ffffff;
  font-weight: 700;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.pagination-wrapper .form-select-sm:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .table-head th {
    font-size: 0.75rem;
    padding: 10px 8px;
  }
  
  .table tbody td {
    font-size: 0.8rem;
    padding: 10px 8px;
  }
  
  .data-pre {
    font-size: 0.75rem;
    padding: 8px 10px;
  }
}

/* Hiệu ứng loading skeleton (optional) */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.table tbody tr.loading {
  background: linear-gradient(
    90deg,
    #f0f0f0 0px,
    #f8f8f8 40px,
    #f0f0f0 80px
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
</style>





<script>
import axios from "axios";

export default {
  name: "History",
  data() {
    return {
      rows: [],
      search: "",
      filterAction: "",
      dateFrom: "",
      dateTo: "",
      sortOrder: "desc",
      loading: false,
      page: 1,
      perPage: 20,
      API_URL:
        "https://script.google.com/macros/s/AKfycbz_vsTrvAjmYq51LTtQhe-nkdOzbMQcpMGslSU8tuSObycF9l5HT7cqYKhJ11uqrpL8/exec",
      actionOptions: [
        { value: "addkhachhang", label: "🆕 Thêm khách hàng" },
        { value: "addnhacungcap", label: "🆕 Thêm nhà cung cấp" },
        { value: "addhanghoa", label: "🆕 Thêm hàng hóa" },
        { value: "updatekhachhang", label: "✏️ Cập nhật khách hàng" },
        { value: "updatenhacungcap", label: "✏️ Cập nhật nhà cung cấp" },
        { value: "updatehanghoa", label: "✏️ Cập nhật hàng hóa" },
        { value: "deleteperson", label: "🗑️ Xóa khách hàng / NCC" },
        { value: "deletehanghoa", label: "🗑️ Xóa hàng hóa" },
        { value: "xuathoadontong", label: "🧾 Xuất hóa đơn KH" },
        { value: "xuathoadonnhaphang", label: "📦 Xuất hóa đơn nhập hàng" },
      ],
    };
  },
  computed: {
    filteredRows() {
      let data = [...this.rows];

      if (this.search.trim()) {
        const kw = this.search.toLowerCase();
        data = data.filter((r) =>
          `${r.chi_tiet} ${r.nguoi_dung}`.toLowerCase().includes(kw)
        );
      }

      if (this.filterAction)
        data = data.filter((r) =>
          r.hanh_dong.toLowerCase().includes(this.filterAction)
        );

      if (this.dateFrom) {
        const from = new Date(this.dateFrom);
        data = data.filter((r) => new Date(this.parseDate(r.thoi_gian)) >= from);
      }
      if (this.dateTo) {
        const to = new Date(this.dateTo);
        data = data.filter((r) => new Date(this.parseDate(r.thoi_gian)) <= to);
      }

      data.sort((a, b) => {
        const da = new Date(this.parseDate(a.thoi_gian));
        const db = new Date(this.parseDate(b.thoi_gian));
        return this.sortOrder === "desc" ? db - da : da - db;
      });

      return data;
    },
    totalPages() {
      return Math.ceil(this.filteredRows.length / this.perPage);
    },
    paginatedRows() {
      const start = (this.page - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredRows.slice(start, end);
    },
  },
  watch: {
    filteredRows() {
      this.page = 1; // Reset về trang đầu khi thay đổi bộ lọc
    },
  },
  methods: {
    formatNumber(value) {
  if (value === null || value === undefined) return "";
  const num = Number(value);
  if (!isNaN(num)) return num.toLocaleString("vi-VN"); // ✅ format kiểu Việt Nam
  return value;
},
formatDiffText(text) {
  if (!text) return "";
  // Tự động thêm dấu phẩy ngăn cách cho các số
  return text.replace(/\b\d{4,}\b/g, (n) =>
    Number(n).toLocaleString("vi-VN")
  );
},

    async fetchData() {
      this.loading = true;
      try {
        const res = await axios.get(this.API_URL, {
          params: { action: "getLichSu" },
        });
        this.rows = res.data.map((r) => ({
          thoi_gian: r.thoi_gian || "",
          nguoi_dung: r.nguoi_thuc_hien || "",
          hanh_dong: r.hanh_dong || "",
          chi_tiet: r.chi_tiet || "",
          du_lieu_thay_doi: r.du_lieu_thay_doi || "",
        }));
      } catch (err) {
        console.error("❌ Lỗi tải lịch sử:", err);
      } finally {
        this.loading = false;
      }
    },
    parseDate(str) {
      const [time, date] = str.split(" ");
      if (!date) return str;
      const [day, month, year] = date.split("/");
      return `${year}-${month}-${day}T${time}`;
    },
    rowClass(action) {
      const a = action.toLowerCase();
      if (a.includes("add")) return "table-success";
      if (a.includes("update")) return "table-warning";
      if (a.includes("delete")) return "table-danger";
      if (a.includes("xuat")) return "table-info";
      return "";
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

