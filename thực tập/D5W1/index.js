const baseURL = "https://jsonplaceholder.typicode.com";
let currentType = "users";
let fullData = [];
let modalMode = "add";

// Fetch dữ liệu từ API
async function fetchData(type) {
  currentType = type;
  try {
    const res = await fetch(`${baseURL}/${type}`);
    const data = await res.json();
    fullData = data;
    displayData(data);
  } catch (e) {
    console.error("Lỗi khi fetch:", e);
    alert("Lỗi fetch dữ liệu!");
  }
}

// Hiển thị dữ liệu
function displayData(data) {
  const container = document.getElementById("data-container");
  container.innerHTML = `<h2>${currentType.toUpperCase()}</h2>`;

  if (!data.length) {
    container.innerHTML += "<p>Không có dữ liệu.</p>";
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.style.overflowX = "auto";
  wrapper.style.width = "100%";
  wrapper.style.borderRadius = "8px";

  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";
  table.style.minWidth = "900px";
  table.style.backgroundColor = "white";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const keys = Object.keys(data[0]);
  keys.forEach((key) => {
    const th = document.createElement("th");
    th.textContent = key;
    th.style.padding = "12px 16px";
    th.style.backgroundColor = "#f2f2f2";
    th.style.fontWeight = "bold";
    th.style.whiteSpace = "nowrap";
    th.style.borderBottom = "1px solid #ddd";
    headerRow.appendChild(th);
  });

  const actionTh = document.createElement("th");
  actionTh.textContent = "Hành động";
  actionTh.style.padding = "12px 16px";
  actionTh.style.backgroundColor = "#f2f2f2";
  actionTh.style.fontWeight = "bold";
  actionTh.style.whiteSpace = "nowrap";
  actionTh.style.borderBottom = "1px solid #ddd";
  headerRow.appendChild(actionTh);
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  data.forEach((item) => {
    const row = document.createElement("tr");

    keys.forEach((key) => {
      const td = document.createElement("td");
      const val = item[key];

      td.style.padding = "12px 16px";
      td.style.borderBottom = "1px solid #ddd";
      td.style.wordBreak = "break-word";
      td.style.maxWidth = "240px";
      td.style.verticalAlign = "top";

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
      <button onclick="editItem(${item.id})">✏️</button>
      <button onclick="deleteItem(${item.id})">🗑️</button>
    `;
    actionTd.style.padding = "12px 16px";
    actionTd.style.borderBottom = "1px solid #ddd";
    actionTd.style.whiteSpace = "nowrap";
    row.appendChild(actionTd);

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  wrapper.appendChild(table);
  container.appendChild(wrapper);
}

// Chức năng edit trực tiếp từ bảng
function editItem(id) {
  const item = fullData.find(u => u.id === id);
  if (item) openModal(currentType, "edit", item);
}

// Xoá bằng API
async function deleteItem(id) {
  if (!confirm("Bạn có chắc chắn muốn xoá?")) return;
  try {
    await fetch(`${baseURL}/${currentType}/${id}`, { method: "DELETE" });
    fullData = fullData.filter((item) => item.id !== id);
    displayData(fullData);
    alert("Xoá thành công (giả lập)");
  } catch (e) {
    alert("Xoá thất bại!");
  }
}

// Tìm kiếm
document.getElementById("searchBtn").addEventListener("click", async () => {
  const keyword = document.getElementById("searchId").value.trim().toLowerCase();
  if (!keyword) return alert("Nhập từ khóa để tìm kiếm!");

  try {
    const res = await fetch(`${baseURL}/${currentType}`);
    const data = await res.json();
    fullData = data;

    const filtered = data.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(keyword)
      )
    );

    displayData(filtered);
  } catch (error) {
    alert("Không thể tìm kiếm do lỗi kết nối.");
  }
});

// Mở modal thêm
document.getElementById("addBtn").addEventListener("click", () => {
  openModal(currentType, "add");
});

// Chuyển loại dữ liệu
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("tab-active"));
    btn.classList.add("tab-active");
    fetchData(btn.dataset.type);
  });
});

// Modal
const modalHTML = `
  <div id="formModal" class="modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:999;">
    <div class="modal-content" style="background:#fff; padding:20px; max-width:500px; margin:80px auto; border-radius:6px; position:relative;">
      <span class="close-btn" style="position:absolute; right:10px; top:10px; cursor:pointer; font-size:20px;" onclick="closeModal()">×</span>
      <h3 id="modalTitle">Thêm dữ liệu</h3>
      <form id="dataForm">
        <div id="formFields"></div>
        <button type="submit" id="modalSubmitBtn">Gửi</button>
      </form>
    </div>
  </div>
`;
document.body.insertAdjacentHTML("beforeend", modalHTML);

function openModal(type, mode = "add", data = {}) {
  modalMode = mode;
  document.getElementById("modalTitle").textContent = mode === "add" ? "Thêm dữ liệu" : "Chỉnh sửa dữ liệu";
  document.getElementById("modalSubmitBtn").textContent = mode === "add" ? "Thêm" : "Lưu";
  document.getElementById("formModal").style.display = "block";
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
    const value = data[field] || "";
    fieldsContainer.innerHTML += `
      <div style="margin-bottom:10px;">
        <label><strong>${field}</strong></label><br>
        <input type="text" name="${field}" value="${value}" style="width:100%; padding:6px;">
      </div>
    `;
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

// Gửi form modal
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
      fullData.unshift(result);
      displayData(fullData);
      alert("Thêm thành công (giả lập)");
    } else if (modalMode === "edit") {
      if (!jsonData.id) return alert("Phải có ID để sửa!");
      const res = await fetch(`${baseURL}/${currentType}/${jsonData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
      });
      const result = await res.json();
      const index = fullData.findIndex(item => item.id === result.id);
      if (index !== -1) fullData[index] = result;
      displayData(fullData);
      alert("Sửa thành công (giả lập)");
    }
  } catch (err) {
    alert("Lỗi xử lý dữ liệu!");
  }

  closeModal();
});

// Load mặc định
window.onload = () => {
  fetchData("users");
};
