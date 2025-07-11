import { subscribeApplications } from './firebase-app.js';
import { getDatabase, ref, remove, update } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const dashboardTableBody = document.getElementById('dashboardTableBody');
const db = getDatabase();

dashboardTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#aaa;">로딩 중...</td></tr>';

subscribeApplications(snapshot => {
    dashboardTableBody.innerHTML = '';
    let hasData = false;
    snapshot.forEach(child => {
        hasData = true;
        const data = child.val();
        const key = child.key;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${data.name}</td>
            <td>${data.email}</td>
            <td>${data.phone}</td>
            <td>${data.reason}</td>
            <td>${data.createdAt ? data.createdAt.replace('T',' ').slice(0,19) : ''}</td>
            <td><button class="edit-btn" data-key="${key}" style="background:#667eea; color:white; border:none; border-radius:6px; padding:0.4rem 1.2rem; font-size:1rem; cursor:pointer;">수정</button></td>
            <td><button class="delete-btn" data-key="${key}" style="background:#ff6b6b; color:white; border:none; border-radius:6px; padding:0.4rem 1.2rem; font-size:1rem; cursor:pointer;">삭제</button></td>
        `;
        dashboardTableBody.appendChild(tr);
    });
    if (!hasData) {
        dashboardTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#aaa;">신청 데이터가 없습니다.</td></tr>';
    }
    // 삭제 버튼 이벤트 연결
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const key = this.getAttribute('data-key');
            if (confirm('정말 삭제하시겠습니까?')) {
                remove(ref(db, 'applications/' + key));
            }
        });
    });
    // 수정 버튼 이벤트 연결
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const key = this.getAttribute('data-key');
            // 해당 데이터 찾기
            const row = this.closest('tr');
            document.getElementById('editKey').value = key;
            document.getElementById('editName').value = row.children[0].textContent;
            document.getElementById('editEmail').value = row.children[1].textContent;
            document.getElementById('editPhone').value = row.children[2].textContent;
            document.getElementById('editReason').value = row.children[3].textContent;
            document.getElementById('editModal').style.display = 'flex';
        });
    });
});
// 수정 모달 저장/취소
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const editCancelBtn = document.getElementById('editCancelBtn');
editCancelBtn.addEventListener('click', function(e) {
    e.preventDefault();
    editModal.style.display = 'none';
});
editForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const key = document.getElementById('editKey').value;
    const name = document.getElementById('editName').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const phone = document.getElementById('editPhone').value.trim();
    const reason = document.getElementById('editReason').value.trim();
    if (!name || !email || !phone || !reason) {
        alert('모든 항목을 입력해주세요.');
        return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        alert('올바른 이메일 형식을 입력해주세요.');
        return;
    }
    if (!/^\d{2,3}[- ]?\d{3,4}[- ]?\d{4}$/.test(phone)) {
        alert('올바른 휴대폰 번호를 입력해주세요.');
        return;
    }
    update(ref(db, 'applications/' + key), { name, email, phone, reason });
    editModal.style.display = 'none';
});