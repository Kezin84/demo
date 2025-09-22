<template>
  <div class="page">
    <div class="layout">
      <!-- LEFT COLUMN -->
      <div class="left-col">
        <section class="panel">
          <h3>Thông tin hóa đơn & khách</h3>
          <div class="form">
            <div class="field"><label>Mã hóa đơn</label><input v-model="header.ma_hoa_don"/></div>
            <div class="field"><label>Tên khách hàng</label><input v-model="header.ten_khach_hang"/></div>
            <div class="field"><label>Số điện thoại</label><input v-model="header.so_dien_thoai"/></div>
            <div class="field"><label>Nợ cũ</label><input v-model.number="header.no_cu" type="number"/></div>
            <div class="field"><label>Ghi chú khách hàng</label><textarea v-model="header.ghi_chu_khach" rows="2"/></div>
          </div>
        </section>

        <section class="panel">
          <h3>Form nhập hóa đơn</h3>
          <div class="form">
            <div class="field"><label>Mã hàng</label><input v-model="draft.ma_hang"/></div>
            <div class="field"><label>Tên hàng</label><input v-model="draft.ten_hang"/></div>
            <div class="field"><label>ĐVT</label><input v-model="draft.dvt"/></div>
            <div class="field"><label>Số lượng</label><input v-model.number="draft.so_luong" type="number"/></div>
            <div class="field"><label>Đơn giá</label><input v-model.number="draft.don_gia" type="number"/></div>
            <div class="field"><label>Giảm giá</label><input v-model.number="draft.giam_gia" type="number"/></div>
            <div class="field">
              <label>Thanh toán</label>
              <div class="radios">
                <label><input type="radio" value="cash" v-model="header.hinh_thuc_thanh_toan"/> Tiền mặt</label>
                <label><input type="radio" value="transfer" v-model="header.hinh_thuc_thanh_toan"/> Chuyển khoản</label>
                <label><input type="radio" value="debt" v-model="header.hinh_thuc_thanh_toan"/> Nợ</label>
              </div>
            </div>
            <div class="field"><label>Ghi chú đơn hàng</label><textarea v-model="draft.ghi_chu" rows="2"/></div>
            <div class="buttons">
              <button class="btn green" @click="addLine(false)">Chốt hàng</button>
              <button class="btn red" @click="addLine(true)">Trả hàng</button>
            </div>
          </div>
        </section>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="right-col">
        <section class="panel">
          <h3>Thông tin hóa đơn</h3>
          <div class="info">
            <p><span>Mã HĐ:</span> {{ header.ma_hoa_don || '-' }}</p>
            <p><span>Khách:</span> {{ header.ten_khach_hang || '-' }}</p>
            <p><span>SDT:</span> {{ header.so_dien_thoai || '-' }}</p>
            <p><span>Nợ cũ:</span> {{ fmt(header.no_cu || 0) }}</p>
            <p><span>Hình thức:</span> {{ labelPay }}</p>
          </div>
          <div class="summary">
            <div><span>Tạm tính</span><b>{{ fmt(tamTinh) }}</b></div>
            <div><span>Khách trả</span><input v-model.number="header.tra_tien" type="number"/></div>
            <div class="total"><span>Tổng cộng</span><b>{{ fmt(tongCong) }}</b></div>
          </div>
        </section>

        <section class="panel">
          <h3>Chi tiết hóa đơn</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Mã hàng</th>
                <th>Tên hàng</th>
                <th>ĐVT</th>
                <th>SL</th>
                <th>Đơn giá</th>
                <th>Giảm</th>
                <th>Thành tiền</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in rows" :key="idx">
                <td>{{ idx + 1 }}</td>
                <td>{{ row.ma_hang }}</td>
                <td>{{ row.ten_hang }}</td>
                <td>{{ row.dvt }}</td>
                <td>{{ row.so_luong }}</td>
                <td>{{ fmt(row.don_gia) }}</td>
                <td>{{ fmt(row.giam_gia || 0) }}</td>
                <td>{{ fmt(row.thanh_tien) }}</td>
                <td><button class="link" @click="removeLine(idx)">Xoá</button></td>
              </tr>
              <tr v-if="rows.length===0"><td colspan="9" class="empty">Chưa có dòng hàng</td></tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

const header = reactive({ ma_hoa_don:'', ten_khach_hang:'', so_dien_thoai:'', no_cu:0, ghi_chu_khach:'', tra_tien:0, hinh_thuc_thanh_toan:'cash'})
const draft = reactive({ ma_hang:'', ten_hang:'', dvt:'', so_luong:0, don_gia:0, giam_gia:0, ghi_chu:'' })
const rows = ref([])

function addLine(isReturn){
  if(!draft.ma_hang) return
  const soLuong = isReturn? -Math.abs(draft.so_luong||1) : Number(draft.so_luong||0)
  const thanh_tien = soLuong*draft.don_gia - (draft.giam_gia||0)
  rows.value.push({...draft, so_luong:soLuong, thanh_tien})
  draft.ma_hang=''; draft.ten_hang=''; draft.dvt=''; draft.so_luong=0; draft.don_gia=0; draft.giam_gia=0; draft.ghi_chu=''
}
function removeLine(i){ rows.value.splice(i,1) }
const tamTinh = computed(()=> rows.value.reduce((s,r)=>s+(r.thanh_tien||0),0))
const tongCong = computed(()=> tamTinh.value + (header.no_cu||0) - (header.tra_tien||0))
const labelPay = computed(()=> ({cash:'Tiền mặt', transfer:'Chuyển khoản', debt:'Nợ'})[header.hinh_thuc_thanh_toan])
function fmt(n){ return new Intl.NumberFormat('vi-VN').format(n||0) }
</script>

<style scoped>
/* ===== Theme: Bright & Harmonious ===== */
:root {
  --bg: #fdfdfd;
  --card: #ffffff;
  --line: #e2e8f0;
  --muted: #64748b;
  --txt: #1e293b;
  --primary: #3b82f6;
  --primary-light: #eff6ff;
  --danger: #ef4444;
  --success: #10b981;
}
body { background: var(--bg); color: var(--txt); font-family: 'Inter', sans-serif; }

.wrap {
  display: grid;
  grid-template-columns: 420px minmax(600px, 1fr);
  gap: 28px;
  max-width: 1280px;
  margin: 32px auto;
  padding: 0 24px;
}
.left { display: flex; flex-direction: column; gap: 22px; }
.right { display: flex; flex-direction: column; gap: 22px; }

.card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}
.card.sticky { position: sticky; top: 20px; }

h2 {
  margin: 0 0 16px;
  font-size: 15px;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: .3px;
  text-transform: uppercase;
}

.form-col { display: flex; flex-direction: column; gap: 14px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field>label { font-size: 13px; color: var(--muted); font-weight: 600; }
.field input, .field textarea {
  border: 1px solid var(--line);
  border-radius: 10px;
  height: 40px;
  padding: 0 12px;
  background: #fff;
  transition: .15s ease;
}
.field textarea { min-height: 84px; padding: 10px 12px; }
.field input:focus, .field textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59,130,246,.15);
}

.radios { display: flex; align-items: center; gap: 10px; }
.radio-group { display: flex; gap: 12px; }
.radio-group label {
  display: inline-flex; align-items: center; gap: 6px;
  border: 1px solid var(--line);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  color: var(--txt);
  background: var(--primary-light);
}
.radio-group input { accent-color: var(--primary); }

.btn-row { display: flex; gap: 14px; align-items: center; margin-top: 10px; }
button {
  height: 42px;
  border-radius: 10px;
  border: 1px solid var(--line);
  padding: 0 18px;
  cursor: pointer;
  font-weight: 600;
  transition: .15s ease;
}
button.primary { background: var(--success); color: #fff; border-color: var(--success); }
button.danger { background: var(--danger); color: #fff; border-color: var(--danger); }
button.link { background: transparent; border: none; color: var(--primary); }
button:hover { opacity: .95; transform: translateY(-1px); }

.kv { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.kv div {
  display: flex; justify-content: space-between;
  background: #f9fafb;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 8px 12px;
}
.kv span { color: var(--muted); }
.kv b { font-weight: 600; }

.sum { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 14px; }
.sum > div {
  display: flex; align-items: center; justify-content: space-between;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 10px 14px;
  background: #fff;
}
.sum input {
  width: 140px; border: 1px solid var(--line); border-radius: 8px;
  height: 36px; padding: 0 10px;
}
.sum .total {
  grid-column: 1 / -1;
  background: var(--primary-light);
  border-color: #bfdbfe;
}

.table { width: 100%; border-collapse: separate; border-spacing: 0 8px; }
.table thead th {
  font-size: 12px; color: var(--muted);
  text-transform: uppercase;
  letter-spacing: .04em;
  background: #f3f4f6;
}
.table tbody tr {
  background: #fff; border: 1px solid var(--line);
}
.table th, .table td { padding: 10px 12px; }
.table td:first-child, .table th:first-child { border-top-left-radius: 10px; border-bottom-left-radius: 10px; }
.table td:last-child, .table th:last-child { border-top-right-radius: 10px; border-bottom-right-radius: 10px; }
.table .num { text-align: right; }
.table .empty { color: #9ca3af; text-align: center; padding: 16px; }

@media (max-width: 1100px){ .wrap { grid-template-columns: 1fr; } }
</style>
