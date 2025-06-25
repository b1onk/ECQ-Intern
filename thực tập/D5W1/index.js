const baseURL = "https://jsonplaceholder.typicode.com";
let currentType = "users";
let fullData = [];
let modalMode = "add";
let currentMaxId = 0;

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

async function fetchData(type) {
  currentType = type;
  try {
    const res = await fetch(`${baseURL}/${type}`);
    const data = await res.json();
    fullData = data;
    currentMaxId = data.reduce((max, item) => Math.max(max, item.id || 0), 0);
    displayData(data);
  } catch (e) {
    alert("Lỗi fetch dữ liệu!");
  }
}

function displayData(data) {
  const container = document.getElementById("data-container");
  container.innerHTML = `<h2>${currentType.toUpperCase()}</h2>`;

  if (!data.length) {
    container.innerHTML += "<p>Không có dữ liệu.</p>";
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "table-wrapper";

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const keys = Object.keys(data[0]);

  keys.forEach((key) => {
    const th = document.createElement("th");
    th.textContent = key;
    headerRow.appendChild(th);
  });

  const actionTh = document.createElement("th");
  actionTh.textContent = "Hành động";
  headerRow.appendChild(actionTh);
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  data.forEach((item) => {
    const row = document.createElement("tr");

    keys.forEach((key) => {
      const td = document.createElement("td");
      const val = item[key];
      if (typeof val === "object" && val !== null) {
        if (currentType === "users" && key === "address") {
          td.innerHTML = `${val.street}, ${val.city}<br><small>${val.zipcode}</small>`;
        } else if (currentType === "users" && key === "company") {
          td.innerHTML = `<strong>${val.name}</strong><br><small>${val.catchPhrase}</small>`;
        } else {
          td.textContent = JSON.stringify(val);
        }
      } else if (typeof val === "boolean") {
        td.textContent = val ? "✅" : "❌";
      } else {
        td.textContent = val;
      }
      row.appendChild(td);
    });

    const actionTd = document.createElement("td");
    actionTd.innerHTML = `
      <div class="action-buttons">
        <button class="action-btn edit-btn" onclick="editItem(${item.id})">✏️</button>
        <button class="action-btn delete-btn" onclick="deleteItem(${item.id})">🗑️</button>
      </div>`;
    row.appendChild(actionTd);
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  wrapper.appendChild(table);
  container.appendChild(wrapper);
}

function editItem(id) {
  const item = fullData.find(u => u.id === id);
  if (item) openModal(currentType, "edit", item);
}

async function deleteItem(id) {
  if (!confirm("Bạn có chắc chắn muốn xoá?")) return;
  try {
    await fetch(`${baseURL}/${currentType}/${id}`, { method: "DELETE" });
    fullData = fullData.filter(item => item.id !== id);
    displayData(fullData);
    alert("Xoá thành công");
  } catch (e) {
    alert("Xoá thất bại!");
  }
}

document.getElementById("searchId").addEventListener("input", debounce(async function (e) {
  const keyword = e.target.value.trim().toLowerCase();
  if (!keyword) {
    displayData(fullData);
    return;
  }
  try {
    const res = await fetch(`${baseURL}/${currentType}`);
    const data = await res.json();
    const filtered = data.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(keyword)
      )
    );
    displayData(filtered);
  } catch (error) {
    alert("Không thể tìm kiếm do lỗi kết nối.");
  }
}, 400));

document.getElementById("addBtn").addEventListener("click", () => {
  openModal(currentType, "add");
});

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("tab-active"));
    btn.classList.add("tab-active");
    fetchData(btn.dataset.type);
  });
});

const modalHTML = `
  <div id="formModal" class="modal">
    <div class="modal-content">
      <span class="close-btn" onclick="closeModal()">×</span>
      <h3 id="modalTitle">Thêm dữ liệu</h3>
      <form id="dataForm">
        <div id="formFields"></div>
        <button type="submit" id="modalSubmitBtn" class="saveBtn">Gửi</button>
      </form>
    </div>
  </div>`;
document.body.insertAdjacentHTML("beforeend", modalHTML);

function openModal(type, mode = "add", data = {}) {
  modalMode = mode;
  document.getElementById("modalTitle").textContent = mode === "add" ? "Thêm dữ liệu" : "Chỉnh sửa dữ liệu";
  document.getElementById("modalSubmitBtn").textContent = mode === "add" ? "Thêm" : "Lưu";
  document.getElementById("formModal").style.display = "flex";
  buildFormFields(type, data);
}

function closeModal() {
  document.getElementById("formModal").style.display = "none";
}

function buildFormFields(type, data = {}) {
  const fieldsContainer = document.getElementById("formFields");
  fieldsContainer.innerHTML = "";
  let fields = [];
  switch (type) {
    case "users": fields = ["id", "name", "username", "email", "phone", "website"]; break;
    case "posts": fields = ["id", "userId", "title", "body"]; break;
    case "comments": fields = ["id", "postId", "name", "email", "body"]; break;
    case "albums": fields = ["id", "userId", "title"]; break;
    case "todos": fields = ["id", "userId", "title", "completed"]; break;
    case "photos": fields = ["id", "albumId", "title", "url", "thumbnailUrl"]; break;
  }
  fields.forEach(field => {
    const isAddMode = modalMode === "add";
    const isIdField = field === "id";
    if (isAddMode && isIdField) return;
    const value = data[field] || "";
    fieldsContainer.innerHTML += `
      <div class="form-group">
        <label for="${field}">${field}</label>
        <input type="text" name="${field}" id="${field}" value="${value}" ${isIdField ? "readonly" : ""}>
      </div>`;
  });
}

function getFormDataAsJSON() {
  const inputs = document.querySelectorAll("#formFields input");
  const data = {};
  inputs.forEach(input => {
    const name = input.name;
    let value = input.value;
    if (name === "id" || name.endsWith("Id")) value = Number(value);
    if (name === "completed") value = value === "true" || value === "1";
    data[name] = value;
  });
  return data;
}

document.getElementById("dataForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const jsonData = getFormDataAsJSON();
  try {
    if (modalMode === "add") {
      const res = await fetch(`${baseURL}/${currentType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
      });
      const result = await res.json();
      result.id = ++currentMaxId;
      fullData.unshift(result);
      displayData(fullData);
      alert("Thêm thành công");
    } else if (modalMode === "edit") {
      const res = await fetch(`${baseURL}/${currentType}/${jsonData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
      });
      const result = await res.json();
      const index = fullData.findIndex(item => item.id === result.id);
      if (index !== -1) fullData[index] = result;
      displayData(fullData);
      alert("Sửa thành công");
    }
  } catch (err) {
    alert("Lỗi xử lý dữ liệu!");
  }
  closeModal();
});

window.onload = () => {
  fetchData("users");
};
