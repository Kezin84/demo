<template>
  <div class="ghi-chu-container">
    <!-- 🎯 HEADER -->
    <div class="header-section">
      <div class="header-content">
        <div class="header-icon">📝</div>
        <h2 class="header-title">GHI CHÚ / NHẮC VIỆC</h2>
        <p class="header-subtitle">Quản lý công việc & ghi chú hiệu quả</p>
      </div>
      <div class="header-gradient"></div>
    </div>

    <!-- 🔍 BỘ LỌC -->
    <div class="filter-section">
      <div class="filter-grid">
        <div class="filter-group">
          <label class="filter-label">
            <span class="label-icon">🔍</span>
            Tìm kiếm
          </label>
          <input 
            v-model="search" 
            type="text" 
            class="filter-input" 
            placeholder="Nhập tiêu đề hoặc nội dung..." 
          />
        </div>

        <div class="filter-group">
          <label class="filter-label">
            <span class="label-icon">⭐</span>
            Ưu tiên
          </label>
          <select v-model="filterPriority" class="filter-select">
            <option value="">Tất cả</option>
            <option value="quan trọng">Quan trọng</option>
            <option value="bình thường">Bình thường</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">
            <span class="label-icon">✓</span>
            Trạng thái
          </label>
          <select v-model="filterStatus" class="filter-select">
            <option value="">Tất cả</option>
            <option value="chưa hoàn thành">Chưa hoàn thành</option>
            <option value="hoàn thành">Hoàn thành</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">
            <span class="label-icon">🏷️</span>
            Nhãn
          </label>
          <select v-model="filterTag" class="filter-select">
            <option value="">Tất cả</option>
            <option v-for="tag in tags" :key="tag">{{ tag }}</option>
          </select>
        </div>

        <div class="filter-group">
          <button class="btn-add" @click="openAddForm">
            <span class="btn-icon">➕</span>
            Thêm ghi chú
          </button>
        </div>
      </div>
    </div>

    <!-- 📋 DANH SÁCH GHI CHÚ -->
    <div v-if="filteredNotes.length" class="notes-grid">
      <div v-for="(note, i) in filteredNotes" :key="i" class="note-card-wrapper">
        <div
          class="note-card"
          :class="noteClass(note)"
          @click="note.trang_thai !== 'hoàn thành' && openEditForm(note)"
        >
          <div class="note-header">
            <h3 class="note-title">{{ note.tieu_de }}</h3>
            <span class="priority-badge" :class="note.uu_tien === 'quan trọng' ? 'priority-high' : 'priority-normal'">
              {{ note.uu_tien }}
            </span>
          </div>

          <p class="note-content" v-if="note.noi_dung">Nội dung: {{ note.noi_dung }}</p>

          <div class="note-meta">
            <div class="meta-item">
              <span class="meta-icon">🏷️</span>
              <span class="meta-text">{{ note.nhan || "Không có nhãn" }}</span>
            </div>
            <div class="meta-item" v-if="note.han_chot">
             
              <span class="meta-text deadline">Hạn chót : {{ note.han_chot }}</span>
            </div>
          </div>

          <div class="note-actions">
            <button
              class="action-btn btn-done"
              :disabled="note.trang_thai === 'hoàn thành'"
              :class="{ 'is-done': note.trang_thai === 'hoàn thành' }"
              @click.stop="toggleDone(note)"
            >
              <span class="action-icon">✅</span>
              {{ note.trang_thai === "hoàn thành" ? "Đã xong" : "Hoàn thành" }}
            </button>
            <button class="action-btn btn-delete" @click.stop="deleteNote(note)">
              <span class="action-icon">🗑️</span>
            </button>
          </div>

          <div class="note-footer">
            <div class="footer-item">
              
              <span class="footer-text">Ngày tạo : {{ note.ngay_tao }}</span>
            </div>
            <div class="footer-item" v-if="note.thoi_gian_hoan_thanh">
              
              <span class="footer-text">Thời gian hoàn thành : {{ note.thoi_gian_hoan_thanh }}</span>
            </div>
          </div>

          <div class="card-gradient"></div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">📭</div>
      <p class="empty-text">Không có ghi chú nào</p>
    </div>

    <!-- 📝 MODAL THÊM / CẬP NHẬT -->
    <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
      <div class="modal-popup">
        <div class="modal-header">
          <h3 class="modal-title">
            <span class="modal-icon">{{ editing ? "✏️" : "🆕" }}</span>
            {{ editing ? "Cập nhật ghi chú" : "Thêm ghi chú mới" }}
          </h3>
          <button class="modal-close" @click="closeForm">×</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">📌</span>
              Tiêu đề
            </label>
            <input v-model="formNote.tieu_de" class="form-input" placeholder="Nhập tiêu đề..." />
          </div>

          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">📄</span>
              Nội dung
            </label>
            <textarea v-model="formNote.noi_dung" class="form-textarea" placeholder="Nhập nội dung chi tiết..." rows="4"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">⭐</span>
                Ưu tiên
              </label>
              <select v-model="formNote.uu_tien" class="form-select">
                <option value="bình thường">Bình thường</option>
                <option value="quan trọng">Quan trọng</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">🏷️</span>
                Nhãn
              </label>
              <select v-model="formNote.nhan" class="form-select">
                <option v-for="tag in tags" :key="tag">{{ tag }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">⏰</span>
                Hạn chót
              </label>
              <input 
                ref="timepicker" 
                type="text" 
                class="form-input" 
                placeholder="Chọn ngày & giờ" 
                readonly 
              />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="modal-btn btn-cancel" @click="closeForm">Đóng</button>
          <button class="modal-btn btn-save" @click="saveNote">
            <span class="btn-icon">💾</span>
            {{ editing ? "Cập nhật" : "Lưu mới" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/material_blue.css";

export default {
  name: "GhiChu",
  data() {
    return {
      notes: [],
      search: "",
      filterPriority: "",
      filterStatus: "",
      filterTag: "",
      showForm: false,
      editing: false,
      formNote: {
        id: "",
        tieu_de: "",
        noi_dung: "",
        uu_tien: "bình thường",
        nhan: "",
        han_chot: "",
      },
      tags: ["hóa đơn", "kho", "khách hàng", "nhà cung cấp", "sổ thu chi", "hàng hóa"],
      API_URL:
        "https://script.google.com/macros/s/AKfycbz_vsTrvAjmYq51LTtQhe-nkdOzbMQcpMGslSU8tuSObycF9l5HT7cqYKhJ11uqrpL8/exec",
    };
  },

  computed: {
    filteredNotes() {
      return this.notes
        .filter((n) =>
          `${n.tieu_de} ${n.noi_dung}`.toLowerCase().includes(this.search.toLowerCase())
        )
        .filter((n) => (this.filterPriority ? n.uu_tien === this.filterPriority : true))
        .filter((n) => (this.filterStatus ? n.trang_thai === this.filterStatus : true))
        .filter((n) => (this.filterTag ? n.nhan === this.filterTag : true))
        .sort((a, b) => new Date(a.han_chot || 0) - new Date(b.han_chot || 0));
    },
  },

  methods: {
    formatDateTime(date) {
      if (!date) return "";
      const d = new Date(date);
      if (isNaN(d.getTime())) return "";

      const pad = (n) => n.toString().padStart(2, "0");
      const hh = pad(d.getHours());
      const mm = pad(d.getMinutes());
      const ss = pad(d.getSeconds());
      const dd = pad(d.getDate());
      const MM = pad(d.getMonth() + 1);
      const yyyy = d.getFullYear();

      return `${hh}:${mm}:${ss} ${dd}/${MM}/${yyyy}`;
    },

    generateID() {
      const d = new Date();
      const pad = (n) => n.toString().padStart(2, "0");
      return `NOTE${pad(d.getDate())}${pad(d.getMonth() + 1)}${d.getFullYear()}${pad(
        d.getHours()
      )}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
    },

    async fetchNotes() {
      try {
        const res = await axios.get(this.API_URL, { params: { action: "getGhiChu" } });
        this.notes = res.data.map((r) => ({
          id: r.id || "",
          tieu_de: r.tieu_de || "",
          noi_dung: r.noi_dung || "",
          uu_tien: r.uu_tien || "bình thường",
          trang_thai: r.trang_thai || "chưa hoàn thành",
          han_chot: r.han_chot || "",
          nhan: r.nhan || "",
          ngay_tao: r.ngay_tao || "",
          thoi_gian_hoan_thanh: r.thoi_gian_hoan_thanh || "",
        }));
      } catch (err) {
        console.error("❌ Lỗi tải ghi chú:", err);
      }
    },

    openAddForm() {
      this.showForm = true;
      this.editing = false;
      this.formNote = {
        id: "",
        tieu_de: "",
        noi_dung: "",
        uu_tien: "bình thường",
        nhan: "",
        han_chot: "",
      };
    },

    openEditForm(note) {
      this.showForm = true;
      this.editing = true;
      this.formNote = { ...note };
      this.formNote.han_chot = note.han_chot;
    },

    closeForm() {
      this.showForm = false;
      this.editing = false;
    },

    async saveNote() {
      if (!String(this.formNote.tieu_de || "").trim()) {
        alert("⚠️ Nhập tiêu đề");
        return;
      }

      let han = "";
      const raw = this.formNote.han_chot?.trim();

      if (raw) {
        if (raw.includes("-") && raw.includes(" ")) {
          const [datePart, timePart] = raw.split(" ");
          const [yyyy, MM, dd] = datePart.split("-");
          const [hh, mm] = timePart.split(":");
          han = `${hh}:${mm}:00 ${dd}/${MM}/${yyyy}`;
        } else if (raw.includes("/") && raw.includes(":")) {
          han = raw;
        }
      }

      const payload = {
        action: this.editing ? "updateGhiChu" : "addGhiChu",
        id: this.editing ? this.formNote.id : this.generateID(),
        tieu_de: String(this.formNote.tieu_de || ""),
        noi_dung: String(this.formNote.noi_dung || ""),
        uu_tien: String(this.formNote.uu_tien || "bình thường"),
        nhan: String(this.formNote.nhan || ""),
        han_chot: String(han || ""),
        trang_thai: String(this.formNote.trang_thai || "chưa hoàn thành"),
      };

      const params = new URLSearchParams();
      Object.entries(payload).forEach(([k, v]) => params.append(k, String(v)));

      try {
        await fetch(this.API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
          mode: "no-cors",
        });

        alert(this.editing ? "✅ Đã cập nhật ghi chú!" : "✅ Đã thêm ghi chú!");
        this.closeForm();
        setTimeout(() => this.fetchNotes(), 800);
      } catch (err) {
        console.error("❌ Lỗi khi lưu:", err);
      }
    },

    async toggleDone(note) {
      if (note.trang_thai === "hoàn thành") return;
      const params = new URLSearchParams();
      params.append("action", "updateTrangThaiGhiChu");
      params.append("id", note.id);
      params.append("trang_thai", "hoàn thành");
      params.append("thoi_gian_hoan_thanh", this.formatDateTime(new Date()));
      await fetch(this.API_URL, { method: "POST", body: params, mode: "no-cors" });
      note.trang_thai = "hoàn thành";
      setTimeout(() => this.fetchNotes(), 600);
    },

    async deleteNote(note) {
      if (!confirm(`Xóa ghi chú "${note.tieu_de}"?`)) return;
      const params = new URLSearchParams();
      params.append("action", "deleteGhiChu");
      params.append("id", note.id);
      await fetch(this.API_URL, { method: "POST", body: params, mode: "no-cors" });
      this.notes = this.notes.filter((n) => n.id !== note.id);
    },

    noteClass(note) {
      return {
        "note-important": note.uu_tien === "quan trọng",
        "note-done": note.trang_thai === "hoàn thành",
      };
    },
  },

  watch: {
    showForm(val) {
      if (val) {
        this.$nextTick(() => {
          let defaultDate = "";
          if (this.editing && this.formNote.han_chot) {
            const parts = this.formNote.han_chot.split(" ");
            if (parts.length === 2) {
              const [time, date] = parts;
              const [hh, mm] = time.split(":");
              const [dd, MM, yyyy] = date.split("/");
              defaultDate = `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
            } else {
              defaultDate = this.formNote.han_chot;
            }
          }

          const picker = flatpickr(this.$refs.timepicker, {
            enableTime: true,
            time_24hr: true,
            dateFormat: "Y-m-d H:i",
            minuteIncrement: 1,
            defaultDate: defaultDate || null,
            locale: { firstDayOfWeek: 1 },
            theme: "material_blue",

            onChange: (selectedDates, dateStr) => {
              this.formNote.han_chot = dateStr;
            },

            onReady: (selectedDates, dateStr, instance) => {
              const doneBtn = document.createElement("button");
              doneBtn.textContent = "✅ Xong";
              doneBtn.className = "btn btn-sm btn-primary mt-2";
              doneBtn.style.width = "100%";
              doneBtn.style.borderRadius = "6px";
              doneBtn.style.fontWeight = "600";
              doneBtn.style.background = "#34e89e";

              doneBtn.addEventListener("click", () => instance.close());

              const container = instance.calendarContainer.querySelector(".flatpickr-time");
              if (container && !container.parentNode.querySelector(".btn-primary")) {
                container.parentNode.appendChild(doneBtn);
              }
            },
          });
        });
      }
    },
  },

  mounted() {
    this.fetchNotes();
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary: #34e89e;
  --primary-dark: #0f3443;
  --success: #34e89e;
  --danger: #ef4444;
  --warning: #f59e0b;
  --dark: #0f172a;
  --light: #f8fafc;
  --border: #e2e8f0;
  --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  --radius: 16px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ========================================
   📱 CONTAINER
======================================== */
.ghi-chu-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #093028 20%, #237a57 75%);
  padding: 2rem;
  font-family: 'Inter', -apple-system, sans-serif;
}

/* ========================================
   🎯 HEADER SECTION
======================================== */
.header-section {
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  margin-bottom: 2rem;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.header-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #093028 0%, #237a57 100%);
}

.header-content {
  position: relative;
  text-align: center;
}

.header-icon {
  font-size: 3rem;
  margin-bottom: 0.75rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.header-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #093028 0%, #237a57 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0.5rem 0;
  letter-spacing: -0.5px;
}

.header-subtitle {
  color: #64748b;
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}

/* ========================================
   🔍 FILTER SECTION
======================================== */
.filter-section {
  background: white;
  border-radius: 20px;
  padding: 1.75rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow);
  border: 3px solid transparent;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(135deg, #093028, #237a57) border-box;
}

.filter-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto;
  gap: 1.25rem;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--dark);
  font-size: 0.9rem;
}

.label-icon {
  font-size: 1rem;
}

.filter-input,
.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid green ;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: var(--transition);
  background: var(--light);
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #237a57;
  background: white;
  box-shadow: 0 0 0 3px rgba(35, 122, 87, 0.1);
}

.btn-add {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #093028 0%, #237a57 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 4px 14px rgba(9, 48, 40, 0.4);
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(9, 48, 40, 0.5);
}

.btn-icon {
  font-size: 1.1rem;
}

/* ========================================
   📋 NOTES GRID
======================================== */
.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.note-card-wrapper {
  animation: fadeInUp 0.5s ease-out backwards;
}

.note-card-wrapper:nth-child(1) { animation-delay: 0.05s; }
.note-card-wrapper:nth-child(2) { animation-delay: 0.1s; }
.note-card-wrapper:nth-child(3) { animation-delay: 0.15s; }
.note-card-wrapper:nth-child(4) { animation-delay: 0.2s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.note-card {
  position: relative;
  background: linear-gradient(135deg, #141e30 0%, #243b55 100%);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: var(--transition);
  overflow: hidden;
  border-left: 5px solid #1e3a5f;
  box-shadow: 0 4px 12px rgba(20, 30, 48, 0.4);
  color: white;
}

.note-card.note-important {
  border-left-color: #fbbf24;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
}

.note-card.note-done {
  opacity: 0.75;
  cursor: default;
  border-left-color: #10b981;
  background: linear-gradient(135deg, #0d2818 0%, #1a4d3a 100%);
}

.note-card:not(.note-done):hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(20, 30, 48, 0.5);
}

.card-gradient {
  position: absolute;
  top: 0;
  right: 0;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
  opacity: 0;
  transition: var(--transition);
}

.note-card:hover .card-gradient {
  opacity: 1;
}

/* Note Header */
.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.note-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  margin: 0;
  line-height: 1.4;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.priority-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.priority-high {
  background: rgba(251, 191, 36, 0.3);
  border-color: rgba(251, 191, 36, 0.5);
  color: #fef3c7;
}

.priority-normal {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.9);
}

/* Note Content */
.note-content {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Note Meta */
.note-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.meta-icon {
  font-size: 1rem;
}

.meta-text {
  color: rgba(255, 255, 255, 0.85);
}

.meta-text.deadline {
  color: #fef3c7;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Note Actions */
.note-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: var(--transition);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: white;
}

.btn-done {
  flex: 1;
}

.btn-done:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.95);
  color: #0f3443;
  border-color: white;
}

.btn-done.is-done {
  background: rgba(16, 185, 129, 0.3);
  border-color: rgba(16, 185, 129, 0.5);
  color: #d1fae5;
  cursor: default;
}

.btn-done:disabled {
  opacity: 1;
}

.btn-delete {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
  color: #fecaca;
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border-color: #ef4444;
}

.action-icon {
  font-size: 1rem;
}

/* Note Footer */
.note-footer {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.75);
}

.footer-icon {
  font-size: 0.875rem;
}

.footer-text {
  font-weight: 500;
}

/* ========================================
   📭 EMPTY STATE
======================================== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.empty-icon {
  font-size: 5rem;
  opacity: 0.3;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1.25rem;
  color: #94a3b8;
  font-weight: 500;
  margin: 0;
}

/* ========================================
   📝 MODAL
======================================== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(9, 48, 40, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-popup {
  background: white;
  border-radius: var(--radius);
  width: 600px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  animation: slideUp 0.3s ease-out;
  border: 3px solid transparent;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(135deg, #141e30, #243b55) border-box;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #141e30 0%, #243b55 100%);
  color: white;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0;
}

.modal-icon {
  font-size: 1.5rem;
}

.modal-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 2rem;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-body {
  padding: 2rem;
  max-height: calc(90vh - 180px);
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--dark);
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border);
  border-radius: 10px;
  font-size: 0.95rem;
  transition: var(--transition);
  background: var(--light);
  font-family: inherit;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #237a57;
  background: white;
  box-shadow: 0 0 0 3px rgba(35, 122, 87, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem 2rem;
  background: var(--light);
  border-top: 1px solid var(--border);
}

.modal-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: var(--transition);
}

.btn-cancel {
  background: white;
  color: #64748b;
  border: 2px solid var(--border);
}

.btn-cancel:hover {
  background: var(--light);
  border-color: #94a3b8;
}

.btn-save {
  background: linear-gradient(135deg, #093028 0%, #237a57 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(9, 48, 40, 0.4);
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(9, 48, 40, 0.5);
}

/* ========================================
   📱 RESPONSIVE
======================================== */
@media (max-width: 1200px) {
  .filter-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .notes-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .ghi-chu-container {
    padding: 1rem;
  }

  .header-section {
    padding: 1.5rem 1rem;
  }

  .header-title {
    font-size: 1.5rem;
  }

  .filter-section {
    padding: 1.25rem;
  }

  .filter-grid {
    grid-template-columns: 1fr;
  }

  .notes-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-popup {
    width: 95vw;
  }
}
</style>