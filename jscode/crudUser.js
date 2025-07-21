import { baseUrl } from './api.js';
import { renderSearchResults } from './search.js';
import { showAlert } from './popup.js';


// Thêm người dùng
export async function addUser(allData, data) {

  const { name, email, phone, website } = data;
  if (!name || !email || !phone || !website) {
    alert('Vui lòng điền đầy đủ thông tin người dùng.');
    return;
  }

  // fetch(`${baseUrl}/users`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // })
  //   .then(res => res.json())
  //   .then(newUser => {
  //     const userData = allData.find(d => d.endpoint === 'users');
  //     if (userData) {
  //       // Gán ID mới nếu cần (giả lập)
  //       const maxId = Math.max(...userData.data.map(u => u.id));
  //       newUser.id = maxId + 1;
  //       userData.data.unshift(newUser);
  //     }

  //     alert('Đã thêm người dùng!');
  //     renderSearchResults(allData, 'users');
  //   })
  //   .catch(err => {
  //     console.error('Lỗi khi thêm người dùng:', err);
  //     alert('Lỗi khi thêm người dùng');
  //   });

   try {
    const res = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const newUser = await res.json();
    const userData = allData.find(d => d.endpoint === 'users');
    if (userData) {
      const maxId = Math.max(...userData.data.map(u => u.id));
      newUser.id = maxId + 1;
      userData.data.unshift(newUser);
    }

    await showAlert('Đã thêm người dùng!');
    renderSearchResults(allData, 'users');
  } catch (err) {
    console.error('Lỗi khi thêm người dùng:', err);
    await showAlert('Lỗi khi thêm người dùng');
  }
}

// Cập nhật người dùng
export async function updateUser(allData, data) {

  const { id, name, email, phone, website } = data;
  if (!id || !name || !email || !phone || !website) {
    await showAlert('Vui lòng nhập đầy đủ thông tin để cập nhật người dùng.');
    return;
  }

  const userId = parseInt(id);

  try {
    const res = await fetch(`${baseUrl}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      throw new Error(`Lỗi server: ${res.status}`);
    }

    const updatedUser = await res.json();

    const userData = allData.find(d => d.endpoint === 'users');
    if (userData) {
      const index = userData.data.findIndex(u => u.id === userId);
      if (index !== -1) {
        userData.data[index] = updatedUser;
      }
    }

    await showAlert('Đã cập nhật người dùng!');
    renderSearchResults(allData, 'users');

  } catch (err) {
    console.error('Lỗi khi cập nhật người dùng:', err);
    await showAlert('Lỗi khi cập nhật người dùng');
  }
}

// Xoá người dùng
export async function deleteUser(allData, id) {
  const userId = parseInt(id);

  try {
    await fetch(`${baseUrl}/users/${userId}`, {
      method: 'DELETE'
    });

    const userData = allData.find(d => d.endpoint === 'users');
    if (userData) {
      userData.data = userData.data.filter(u => u.id !== userId);
      console.log('Sau khi xoá userData.data:', userData.data);
    }

    await showAlert(`Đã xoá người dùng có ID = ${userId}`);
    renderSearchResults(allData, 'users');
  } catch (err) {
    console.error('Lỗi khi xoá người dùng:', err);
    await showAlert('Lỗi khi xoá người dùng');
  }
}
