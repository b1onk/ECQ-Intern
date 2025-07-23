import { fetchAllEndpoints } from './api.js';
import { renderSearchResults } from './search.js';

import { createPost, updatePost, deletePost } from './crudPosts.js';
import { addComment, updateComment, deleteComment } from './crudComments.js';
import { addUser, updateUser, deleteUser } from './crudUser.js';
import { addAlbum, updateAlbum, deleteAlbum } from './crudAlbums.js';
import { addTodo, updateTodo, deleteTodo } from './crudTodos.js';
import { addPhoto, updatePhoto, deletePhoto } from './crudPhotos.js';
export { renderCurrentTab };

let allData = [];
let currentTab = 'posts';

document.addEventListener('DOMContentLoaded', async () => {
  allData = await fetchAllEndpoints();
  renderCurrentTab();

  document.getElementById('searchInput').addEventListener('input', () => {
    renderSearchResults(allData, currentTab);
  });

    // Mở modal tạo mới
   const openModalBtn = document.getElementById('openModalBtn');
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
        openModal(currentTab, null);
    });
  }

  // Tab click

  // Lưu modal
  document.getElementById('modalSaveBtn').addEventListener('click', () => {
    handleSave();
  });

  // Đóng modal
  document.querySelector('#modal .close').addEventListener('click', () => {
    document.getElementById('modal').classList.add('hidden');
  });

  // Sửa/xoá
  document.getElementById('contentArea').addEventListener('click', e => {
    const id = e.target.dataset.id;
    if (e.target.classList.contains('editBtn')) {
      openModal(currentTab, id);
    }
    if (e.target.classList.contains('deleteBtn')) {
      handleDelete(currentTab, id);
    }
  });
});

function setActiveTab(tab) {
  document.querySelectorAll('.tabBtn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
}

function renderCurrentTab() {
  const contentArea = document.getElementById('contentArea');
  const dataset = allData.find(d => d.endpoint === currentTab);
  if (!dataset || dataset.data.length === 0) {
    contentArea.innerHTML = '<p>Không có dữ liệu.</p>';
    return;
  }

  const data = dataset.data.slice(0, 10);
  const keys = Object.keys(data[0]).slice(0, 4);
  let html = '<table><thead><tr>';
  keys.forEach(k => html += `<th>${k}</th>`);
  html += '<th class="action-col">Hành động</th>';
  data.forEach(item => {
    html += '<tr>';
    keys.forEach(k => html += `<td>${item[k]}</td>`);
    html += `<td class="action-col">
        <button class="editBtn" data-id="${item.id}">✏️</button>
        <button class="deleteBtn" data-id="${item.id}">🗑️</button>
</td>`;
  });
  html += '</tbody></table>';
  contentArea.innerHTML = html;
}

function openModal(tab, id = null) {
  const modal = document.getElementById('modal');
  const form = document.getElementById('modalForm');
  const title = document.getElementById('modalTitle');
  form.innerHTML = '';
  title.textContent = id ? 'Chỉnh sửa' : 'Thêm mới';

  const dataset = allData.find(d => d.endpoint === tab);
  const item = id ? dataset.data.find(d => d.id == id) : {};

  if (tab === 'posts') {
    form.innerHTML = `
      <input type="hidden" name="id" value="${item.id || ''}">
      <input type="text" name="title" placeholder="Tiêu đề" value="${item.title || ''}">
      <input type="text" name="body" placeholder="Nội dung" value="${item.body || ''}">
      <input type="number" name="userId" placeholder="User ID" value="${item.userId || ''}">
    `;
  } else if (tab === 'comments') {
    form.innerHTML = `
      <input type="hidden" name="id" value="${item.id || ''}">
      <input type="number" name="postId" placeholder="Post ID" value="${item.postId || ''}">
      <input type="text" name="name" placeholder="Tên" value="${item.name || ''}">
      <input type="email" name="email" placeholder="Email" value="${item.email || ''}">
      <input type="text" name="body" placeholder="Nội dung" value="${item.body || ''}">
    `;
  } else if (tab === 'users') {
    form.innerHTML = `
      <input type="hidden" name="id" value="${item.id || ''}">
      <input type="text" name="name" placeholder="Tên" value="${item.name || ''}">
      <input type="email" name="email" placeholder="Email" value="${item.email || ''}">
      <input type="text" name="phone" placeholder="Số điện thoại" value="${item.phone || ''}">
      <input type="text" name="website" placeholder="Website" value="${item.website || ''}">
    `;
  } else if (tab === 'albums') {
    form.innerHTML = `
      <input type="hidden" name="id" value="${item.id || ''}">
      <input type="text" name="title" placeholder="Tiêu đề album" value="${item.title || ''}">
      <input type="number" name="userId" placeholder="User ID" value="${item.userId || ''}">
    `;
  } else if (tab === 'todos') {
    form.innerHTML = `
      <input type="hidden" name="id" value="${item.id || ''}">
      <input type="text" name="title" placeholder="Tiêu đề todo" value="${item.title || ''}">
      <input type="number" name="userId" placeholder="User ID" value="${item.userId || ''}">
      <label>
        <input type="checkbox" name="completed" ${item.completed ? 'checked' : ''}> Hoàn thành
      </label>
    `;
  } else if (tab === 'photos') {
    form.innerHTML = `
      <input type="hidden" name="id" value="${item.id || ''}">
      <input type="text" name="title" placeholder="Tiêu đề ảnh" value="${item.title || ''}">
      <input type="text" name="url" placeholder="URL ảnh" value="${item.url || ''}">
      <input type="text" name="thumbnailUrl" placeholder="Thumbnail URL" value="${item.thumbnailUrl || ''}">
      <input type="number" name="albumId" placeholder="Album ID" value="${item.albumId || ''}">
    `;
  }

  modal.classList.remove('hidden');
}

function handleSave() {
  const form = document.getElementById('modalForm');
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const hasId = !!data.id;

  ['id', 'userId', 'postId', 'albumId'].forEach(key => {
    if (data[key]) data[key] = parseInt(data[key]);
  });

  const id = data.id;
  if (currentTab === 'todos') {
    const checkbox = form.querySelector('[name="completed"]');
    data.completed = checkbox && checkbox.checked;
  }

  switch (currentTab) {
    case 'posts':    hasId ? updatePost(allData,id, data)    : createPost(allData, data); break;
    case 'comments': hasId ? updateComment(allData, data) : addComment(allData, data); break;
    case 'users':    hasId ? updateUser(allData, data)    : addUser(allData, data); break;
    case 'albums':   hasId ? updateAlbum(allData, data)   : addAlbum(allData, data); break;
    case 'todos':    hasId ? updateTodo(allData, data)    : addTodo(allData, data); break;
    case 'photos':   hasId ? updatePhoto(allData, data)   : addPhoto(allData, data); break;
  }

  document.getElementById('modal').classList.add('hidden');
  renderCurrentTab();
}

async function handleDelete(tab, id) {
  const confirmed = await showConfirm("Bạn có chắc chắn muốn xoá mục này?");
  if (!confirmed) return;

  switch (tab) {
    case 'posts': deletePost(allData, id); break;
    case 'comments': deleteComment(allData, id); break;
    case 'users': deleteUser(allData, id); break;
    case 'albums': deleteAlbum(allData, id); break;
    case 'todos': deleteTodo(allData, id); break;
    case 'photos': deletePhoto(allData, id); break;
  }

  renderCurrentTab();
}

// làm popup xóa
function showConfirm(message = "Bạn có chắc muốn xoá?") {
  const modal = document.getElementById("confirmModal");
  const messageEl = document.getElementById("confirmMessage");
  modal.classList.remove("hidden");
  messageEl.textContent = message;

  return new Promise((resolve) => {
    const ok = () => {
      cleanup();
      resolve(true);
    };
    const cancel = () => {
      cleanup();
      resolve(false);
    };
    const cleanup = () => {
      modal.classList.add("hidden");
      okBtn.removeEventListener("click", ok);
      cancelBtn.removeEventListener("click", cancel);
    };

    const okBtn = document.getElementById("confirmOkBtn");
    const cancelBtn = document.getElementById("confirmCancelBtn");
    okBtn.addEventListener("click", ok);
    cancelBtn.addEventListener("click", cancel);
  });
}

document.querySelectorAll('.tabBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    currentTab = tab;

    setActiveTab(tab); // tô sáng tab
    renderCurrentTab(); // load dữ liệu

    // Đổi tiêu đề
    const dataTitle = document.getElementById('dataTitle');
    if (tab === 'users') dataTitle.textContent = 'Quản lý người dùng';
    else if (tab === 'posts') dataTitle.textContent = 'Quản lý bài viết';
    else if (tab === 'albums') dataTitle.textContent = 'Quản lý album';
    else if (tab === 'todos') dataTitle.textContent = 'Quản lý công việc';
    else if (tab === 'photos') dataTitle.textContent = 'Quản lý hình ảnh';
    else if (tab === 'comments') dataTitle.textContent = 'Quản lý bình luận';
  });
});
